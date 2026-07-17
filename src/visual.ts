"use strict";

import type powerbi from "powerbi-visuals-api";
import "../style/visual.less";
import { evaluateConditionalFormatting } from "./conditionalFormatting";
import { AdditionalRowPoint, AdditionalRowSeries, parseDataView, TopFilterControlKind, TopFilterDefinition, TopFilterRole, TopFilterState, TrendDataModel, TrendPoint, TrendSeries, TrendTotalPoint } from "./dataParser";
import { attachSelectionIds, selectionContains } from "./selection";
import { buildBasicFormattingModel, buildFormattingModel, ChartType, enumerateObjectInstances, parseVisualSettings, ShapeType, TopFilterStyleSettings, VisualSettings } from "./settings";
import { TooltipController } from "./tooltips";
import { formatValue } from "./valueFormatter";

type IVisual = powerbi.extensibility.visual.IVisual;
type VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
type VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
type IVisualHost = powerbi.extensibility.visual.IVisualHost;

interface VisualLayout {
  viewportWidth: number;
  viewportHeight: number;
  rowLabelWidth: number;
  columnWidth: number;
  totalColumnWidth: number;
  columnGap: number;
  contentWidth: number;
  chartHeight: number;
  topFilterHeight: number;
  rowHeight: number;
  plotTop: number;
  plotBottom: number;
  plotLeft: number;
  plotRight: number;
}

interface ChartScale {
  min: number;
  max: number;
  y: (value: number) => number;
}

interface LabelBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ChartLabelPlacement {
  x: number;
  y: number;
  anchor: "start" | "middle" | "end";
}

type RenderedFilterKind = TopFilterControlKind | "checkbox" | "bullet";

const SVG_NS = "http://www.w3.org/2000/svg";

export class Visual implements IVisual {
  private readonly host: IVisualHost;
  private readonly root: HTMLDivElement;
  private readonly selectionManager: any;
  private readonly tooltipController: TooltipController;
  private settings: VisualSettings;
  private model: TrendDataModel;
  private selectedIds: any[] = [];
  private filterState: TopFilterState = {};
  private lastOptions?: VisualUpdateOptions;

  constructor(options: VisualConstructorOptions) {
    this.host = options.host;
    this.selectionManager = this.host.createSelectionManager();
    this.settings = parseVisualSettings();
    this.model = parseDataView(undefined, this.settings);

    this.root = document.createElement("div");
    this.root.className = "compact-trend-matrix";
    this.root.setAttribute("role", "application");
    this.root.tabIndex = 0;
    options.element.appendChild(this.root);
    this.tooltipController = new TooltipController(this.host, options.element);
    this.renderMessage("Add X-axis, Y-axis / Category, and Values fields.");

    this.root.addEventListener("click", (event) => {
      if (event.target === this.root) {
        this.clearSelection();
      }
    });
  }

  public update(options: VisualUpdateOptions): void {
    this.lastOptions = options;

    try {
      this.notifyRenderingStarted(options);
      const dataView = options.dataViews?.[0];
      this.settings = parseVisualSettings(dataView);
      this.model = attachSelectionIds(this.host, dataView, parseDataView(dataView, this.settings, (category, index) => this.getThemeColor(category, index), this.effectiveFilterState()));
      this.render(options);
      this.notifyRenderingFinished(options);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown rendering error.";
      this.applyViewport(options);
      this.renderMessage(`Compact Trend Matrix could not render: ${message}`);
      this.notifyRenderingFailed(options, message);
    }
  }

  public getFormattingModel(): powerbi.visuals.FormattingModel {
    try {
      return buildFormattingModel(this.settings, this.model.series, this.model.additionalRows);
    } catch {
      return buildBasicFormattingModel(this.settings);
    }
  }

  public enumerateObjectInstances(options: powerbi.EnumerateVisualObjectInstancesOptions): powerbi.VisualObjectInstanceEnumeration {
    // Native Power BI conditional formatting can be exposed for color properties.
    // Bold and font-size-like behavior remain in the visual's manual rules engine.
    return enumerateObjectInstances(options, this.settings, this.model.series);
  }

  public destroy(): void {
    this.clearRoot();
  }

  private render(options: VisualUpdateOptions): void {
    this.clearRoot();

    const layout = this.computeLayout(options);
    this.applyViewport(options, layout.viewportWidth, layout.viewportHeight);
    this.root.style.background = this.settings.table.backgroundColor;

    if (this.model.warnings.length > 0) {
      this.renderMessage(this.model.warnings[0]);
      return;
    }

    if (!this.settings.chart.show && !this.settings.table.show) {
      this.renderMessage("Enable the chart or table in the formatting pane.");
      return;
    }

    const content = document.createElement("div");
    content.className = "compact-trend-matrix__content";
    content.style.width = `${layout.contentWidth}px`;
    content.addEventListener("click", (event) => {
      if (event.target === content) {
        this.clearSelection();
      }
    });

    const topFilters = this.activeTopFilters();
    const topControls = this.renderTopControls(topFilters);
    if (topControls) {
      content.appendChild(topControls);
    }

    if (this.settings.chart.show && this.settings.chart.chartType !== "none") {
      content.appendChild(this.renderChart(layout));
    }

    if (this.settings.chart.show && this.settings.chart.chartType !== "none" && this.settings.table.show) {
      const divider = document.createElement("div");
      divider.className = "compact-trend-matrix__chart-divider";
      divider.style.borderTopColor = this.settings.table.dividerColor;
      divider.style.borderTopWidth = `${this.settings.table.dividerWidth}px`;
      content.appendChild(divider);
    }

    if (this.settings.table.show) {
      content.appendChild(this.renderTable(layout));
    }

    this.root.appendChild(content);
  }

  private renderTopControls(filters: TopFilterDefinition[]): HTMLDivElement | null {
    const showFilters = filters.length > 0;
    const showChartSelector = this.showChartSelector();
    if (!showFilters && !showChartSelector) {
      return null;
    }

    const controls = document.createElement("div");
    controls.className = "compact-trend-matrix__top-controls";

    if (showFilters) {
      controls.appendChild(this.renderTopFilters(filters));
    } else {
      const spacer = document.createElement("div");
      spacer.className = "compact-trend-matrix__top-controls-spacer";
      controls.appendChild(spacer);
    }

    if (showChartSelector) {
      controls.appendChild(this.renderChartSelector());
    }

    return controls;
  }

  private showChartSelector(): boolean {
    return this.settings.chartSelector.show && this.settings.chart.show;
  }

  private renderChartSelector(): HTMLDivElement {
    const wrapper = document.createElement("div");
    wrapper.className = "compact-trend-matrix__chart-selector";
    wrapper.style.fontFamily = this.settings.chartSelector.fontFamily;
    wrapper.style.fontSize = `${this.settings.chartSelector.fontSize}px`;

    const label = document.createElement("span");
    label.className = "compact-trend-matrix__chart-selector-label";
    label.style.color = this.settings.chartSelector.labelColor;
    label.textContent = this.settings.chartSelector.labelText.trim() || "Chart type";

    const select = document.createElement("select");
    select.className = "compact-trend-matrix__chart-selector-select";
    select.setAttribute("aria-label", label.textContent);
    select.style.background = this.settings.chartSelector.backgroundColor;
    select.style.borderColor = this.settings.chartSelector.borderColor;
    select.style.borderRadius = `${this.settings.chartSelector.cornerRadius}px`;
    select.style.borderWidth = `${this.settings.chartSelector.borderWidth}px`;
    select.style.color = this.settings.chartSelector.valueColor;

    chartTypeOptions().forEach((option) => {
      const itemOption = document.createElement("option");
      itemOption.value = option.value;
      itemOption.textContent = option.label;
      select.appendChild(itemOption);
    });
    select.value = this.settings.chart.chartType === "none" ? "line" : this.settings.chart.chartType;

    select.addEventListener("change", () => {
      const chartType = select.value as ChartType;
      this.settings.chart.chartType = chartType;
      try {
        (this.host as any).persistProperties?.({
          merge: [
            {
              objectName: "chart",
              selector: null,
              properties: { chartType }
            }
          ]
        });
      } catch {
        // The dropdown should still update the current render if persistence is unavailable.
      }

      if (this.lastOptions) {
        this.render(this.lastOptions);
      }
    });

    wrapper.appendChild(label);
    wrapper.appendChild(select);
    return wrapper;
  }

  private activeTopFilters(): TopFilterDefinition[] {
    if (!this.settings.topFilters.show) {
      return [];
    }

    return this.model.filters.filter((filter) => {
      if (filter.options.length === 0) {
        return false;
      }

      if (filter.role === "filterOne") {
        return this.settings.topFilters.showFilterOne;
      }

      return this.settings.topFilters.showFilterTwo;
    });
  }

  private renderTopFilters(filters: TopFilterDefinition[]): HTMLDivElement {
    const strip = document.createElement("div");
    strip.className = "compact-trend-matrix__filters";
    strip.style.background = this.settings.topFilters.backgroundColor;
    strip.style.border = `${this.settings.topFilters.borderWidth}px solid ${this.settings.topFilters.borderColor}`;
    strip.style.borderRadius = `${this.settings.topFilters.cornerRadius}px`;
    strip.style.color = this.settings.topFilters.valueColor;
    strip.style.fontFamily = this.settings.topFilters.fontFamily;
    strip.style.fontSize = `${this.settings.topFilters.fontSize}px`;
    strip.style.gap = `${this.settings.topFilters.itemGap}px ${Math.max(this.settings.topFilters.itemGap, 12)}px`;
    strip.style.justifyContent = cssAlignment(this.settings.topFilters.alignment);
    strip.style.padding = `${this.settings.topFilters.paddingTop}px ${this.settings.topFilters.paddingRight}px ${this.settings.topFilters.paddingBottom}px ${this.settings.topFilters.paddingLeft}px`;

    filters.forEach((filter) => {
      const style = this.topFilterStyle(filter.role);
      const group = document.createElement("div");
      group.className = "compact-trend-matrix__filter-group";
      group.style.gap = `${style.itemGap}px`;
      group.style.fontFamily = style.fontFamily;
      group.style.fontSize = `${style.fontSize}px`;

      const label = document.createElement("span");
      label.className = "compact-trend-matrix__filter-label";
      label.style.color = style.labelColor;
      label.textContent = this.topFilterDisplayName(filter);
      group.appendChild(label);

      const controlKind = this.topFilterControlKind(filter);
      if (controlKind === "checkbox" || controlKind === "buttons") {
        group.appendChild(this.renderButtonFilter(filter));
      } else if (controlKind === "bullet") {
        group.appendChild(this.renderBulletFilter(filter));
      } else if (controlKind === "timeline") {
        group.appendChild(this.renderTimelineFilter(filter));
      } else {
        group.appendChild(this.renderDropdownFilter(filter));
      }

      strip.appendChild(group);
    });

    return strip;
  }

  private topFilterDisplayName(filter: TopFilterDefinition): string {
    const configured = filter.role === "filterOne" ? this.settings.topFilters.filterOneLabel : this.settings.topFilters.filterTwoLabel;
    return configured.trim() || filter.displayName;
  }

  private topFilterControlKind(filter: TopFilterDefinition): RenderedFilterKind {
    const style = filter.role === "filterOne"
      ? this.settings.topFilters.filterOneControlStyle
      : this.settings.topFilters.filterTwoControlStyle;
    if (style === "auto") {
      return filter.controlKind;
    }

    return style;
  }

  private topFilterStyle(role: TopFilterRole): TopFilterStyleSettings {
    return role === "filterOne"
      ? this.settings.topFilters.filterOneStyle
      : this.settings.topFilters.filterTwoStyle;
  }

  private renderDropdownFilter(filter: TopFilterDefinition): HTMLSelectElement {
    const style = this.topFilterStyle(filter.role);
    const select = document.createElement("select");
    select.className = "compact-trend-matrix__filter-select";
    select.setAttribute("aria-label", this.topFilterDisplayName(filter));
    select.style.backgroundColor = style.controlBackgroundColor;
    select.style.borderColor = style.borderColor;
    select.style.borderStyle = "solid";
    select.style.borderWidth = `${style.borderWidth}px`;
    select.style.borderRadius = `${style.cornerRadius}px`;
    select.style.color = style.valueColor;
    select.style.fontFamily = style.fontFamily;
    select.style.fontSize = `${style.fontSize}px`;

    const allOption = document.createElement("option");
    allOption.value = "__all__";
    allOption.textContent = "All";
    allOption.style.backgroundColor = style.controlBackgroundColor;
    allOption.style.color = style.valueColor;
    select.appendChild(allOption);

    filter.options.forEach((option) => {
      const item = document.createElement("option");
      item.value = option.key;
      item.textContent = option.label;
      item.style.backgroundColor = style.controlBackgroundColor;
      item.style.color = style.valueColor;
      select.appendChild(item);
    });

    const selectedKeys = this.filterState[filter.role]?.selectedKeys;
    select.value = selectedKeys?.length === 1 ? selectedKeys[0] : "__all__";
    select.addEventListener("change", () => {
      this.setTopFilterSelection(filter.role, select.value === "__all__" ? undefined : [select.value]);
    });

    return select;
  }

  private renderButtonFilter(filter: TopFilterDefinition): HTMLDivElement {
    const style = this.topFilterStyle(filter.role);
    const group = document.createElement("div");
    group.className = "compact-trend-matrix__filter-buttons";
    group.style.gap = `${style.itemGap}px`;
    const selected = this.selectedFilterKeys(filter);

    filter.options.forEach((option) => {
      const label = document.createElement("label");
      label.className = "compact-trend-matrix__filter-check";
      label.style.color = style.valueColor;
      label.style.fontFamily = style.fontFamily;
      label.style.fontSize = `${style.fontSize}px`;
      label.style.setProperty("--cf-filter-check-bg", style.checkboxBackgroundColor);
      label.style.setProperty("--cf-filter-check-tick", style.checkboxTickColor);
      label.style.setProperty("--cf-filter-check-border", style.borderColor);

      const input = document.createElement("input");
      input.type = "checkbox";
      input.checked = selected.has(option.key);
      input.addEventListener("change", () => {
        const next = new Set(this.selectedFilterKeys(filter));
        if (input.checked) {
          next.add(option.key);
        } else {
          next.delete(option.key);
        }

        this.setTopFilterSelection(filter.role, next.size === filter.options.length ? undefined : Array.from(next));
      });

      const text = document.createElement("span");
      text.textContent = option.label;
      const checkmark = document.createElement("span");
      checkmark.className = "compact-trend-matrix__filter-checkmark";
      label.appendChild(input);
      label.appendChild(checkmark);
      label.appendChild(text);
      group.appendChild(label);
    });

    return group;
  }

  private renderBulletFilter(filter: TopFilterDefinition): HTMLDivElement {
    const style = this.topFilterStyle(filter.role);
    const group = document.createElement("div");
    group.className = "compact-trend-matrix__filter-bullets";
    group.style.gap = `${style.itemGap}px`;
    const selected = this.selectedFilterKeys(filter);

    filter.options.forEach((option) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "compact-trend-matrix__filter-bullet";
      button.classList.toggle("is-selected", selected.has(option.key));
      button.style.backgroundColor = style.controlBackgroundColor;
      button.style.borderColor = style.borderColor;
      button.style.borderStyle = "solid";
      button.style.borderWidth = `${style.borderWidth}px`;
      button.style.borderRadius = `${style.cornerRadius}px`;
      button.style.color = style.valueColor;
      button.style.fontFamily = style.fontFamily;
      button.style.fontSize = `${style.fontSize}px`;
      button.setAttribute("aria-pressed", String(selected.has(option.key)));
      button.setAttribute("aria-label", `${this.topFilterDisplayName(filter)} ${option.label}`);

      const bullet = document.createElement("span");
      bullet.className = "compact-trend-matrix__filter-bullet-dot";
      bullet.style.background = selected.has(option.key) ? style.valueColor : "transparent";
      bullet.style.borderColor = style.valueColor;

      const text = document.createElement("span");
      text.textContent = option.label;

      button.appendChild(bullet);
      button.appendChild(text);
      button.addEventListener("click", () => {
        const next = new Set(this.selectedFilterKeys(filter));
        if (next.has(option.key)) {
          next.delete(option.key);
        } else {
          next.add(option.key);
        }

        this.setTopFilterSelection(filter.role, next.size === filter.options.length ? undefined : Array.from(next));
      });
      group.appendChild(button);
    });

    return group;
  }

  private renderTimelineFilter(filter: TopFilterDefinition): HTMLDivElement {
    const style = this.topFilterStyle(filter.role);
    const group = document.createElement("div");
    group.className = "compact-trend-matrix__filter-timeline";
    group.style.gap = `${style.itemGap}px`;
    const selectedKeys = this.filterState[filter.role]?.selectedKeys;
    const selectedIndex = Math.max(0, filter.options.findIndex((option) => option.key === selectedKeys?.[0]));
    const activeIndex = selectedKeys?.length === 1 ? selectedIndex : filter.options.length - 1;

    const allButton = document.createElement("button");
    allButton.type = "button";
    allButton.className = "compact-trend-matrix__filter-all";
    allButton.style.backgroundColor = style.controlBackgroundColor;
    allButton.style.borderColor = style.borderColor;
    allButton.style.borderStyle = "solid";
    allButton.style.borderWidth = `${style.borderWidth}px`;
    allButton.style.borderRadius = `${style.cornerRadius}px`;
    allButton.style.color = style.valueColor;
    allButton.style.fontFamily = style.fontFamily;
    allButton.style.fontSize = `${style.fontSize}px`;
    allButton.textContent = selectedKeys?.length === 1 ? "All" : "All on";
    allButton.addEventListener("click", () => this.setTopFilterSelection(filter.role, undefined));

    const range = document.createElement("input");
    range.type = "range";
    range.min = "0";
    range.max = String(Math.max(0, filter.options.length - 1));
    range.value = String(activeIndex);
    range.setAttribute("aria-label", this.topFilterDisplayName(filter));
    range.style.accentColor = style.valueColor;

    const value = document.createElement("span");
    value.className = "compact-trend-matrix__filter-value";
    value.style.color = style.valueColor;
    value.style.fontFamily = style.fontFamily;
    value.style.fontSize = `${style.fontSize}px`;
    value.textContent = selectedKeys?.length === 1 ? filter.options[activeIndex]?.label || "" : "All";

    range.addEventListener("input", () => {
      const option = filter.options[Number(range.value)];
      value.textContent = option?.label || "";
    });

    range.addEventListener("change", () => {
      const option = filter.options[Number(range.value)];
      if (option) {
        this.setTopFilterSelection(filter.role, [option.key]);
      }
    });

    group.appendChild(allButton);
    group.appendChild(range);
    group.appendChild(value);
    return group;
  }

  private selectedFilterKeys(filter: TopFilterDefinition): Set<string> {
    const selectedKeys = this.filterState[filter.role]?.selectedKeys;
    return new Set(selectedKeys ?? filter.options.map((option) => option.key));
  }

  private setTopFilterSelection(role: TopFilterRole, selectedKeys: string[] | undefined): void {
    if (!selectedKeys) {
      delete this.filterState[role];
    } else {
      this.filterState[role] = { selectedKeys };
    }

    if (!this.lastOptions) {
      return;
    }

    const dataView = this.lastOptions.dataViews?.[0];
    this.model = attachSelectionIds(this.host, dataView, parseDataView(dataView, this.settings, (category, index) => this.getThemeColor(category, index), this.effectiveFilterState()));
    this.render(this.lastOptions);
  }

  private effectiveFilterState(): TopFilterState {
    if (!this.settings.topFilters.show) {
      return {};
    }

    return {
      ...(this.settings.topFilters.showFilterOne && this.filterState.filterOne ? { filterOne: this.filterState.filterOne } : {}),
      ...(this.settings.topFilters.showFilterTwo && this.filterState.filterTwo ? { filterTwo: this.filterState.filterTwo } : {})
    };
  }

  private renderChart(layout: VisualLayout): SVGSVGElement {
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.classList.add("compact-trend-matrix__chart");
    svg.setAttribute("width", String(layout.contentWidth));
    svg.setAttribute("height", String(layout.chartHeight));
    svg.setAttribute("viewBox", `0 0 ${layout.contentWidth} ${layout.chartHeight}`);
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", `${this.model.measureName} trend chart`);

    const scale = this.createScale(layout);
    this.renderGridAndAxes(svg, layout, scale);

    if (this.settings.chart.chartType === "line") {
      this.renderLineChart(svg, layout, scale);
    } else if (this.settings.chart.chartType === "clusteredBar") {
      this.renderClusteredBars(svg, layout, scale);
    } else if (this.settings.chart.chartType === "stackedBar") {
      this.renderStackedBars(svg, layout, scale);
    } else if (this.settings.chart.chartType === "lollipop") {
      this.renderLollipopChart(svg, layout, scale);
    }

    this.renderReferenceLine(svg, layout, scale);

    return svg;
  }

  private renderGridAndAxes(svg: SVGSVGElement, layout: VisualLayout, scale: ChartScale): void {
    const tickCount = 4;

    if (this.settings.chart.showGridlines || this.settings.chart.showYAxis) {
      for (let index = 0; index <= tickCount; index += 1) {
        const ratio = index / tickCount;
        const value = scale.min + (scale.max - scale.min) * ratio;
        const y = scale.y(value);

        if (this.settings.chart.showGridlines) {
          const gridline = svgLine(layout.plotLeft, y, layout.plotRight, y, "compact-trend-matrix__gridline");
          gridline.setAttribute("stroke", this.settings.chart.gridlineColor);
          gridline.setAttribute("stroke-width", String(this.settings.chart.gridlineWidth));
          gridline.setAttribute("stroke-dasharray", lineDash(this.settings.chart.gridlineStyle));
          svg.appendChild(gridline);
        }

        if (this.settings.chart.showYAxis) {
          const label = svgText(layout.plotLeft - 6, y + 3, formatAxisValue(value), "compact-trend-matrix__axis-label");
          label.setAttribute("text-anchor", "end");
          label.style.fill = this.settings.chart.yAxisLabelColor;
          label.style.fontFamily = this.settings.chart.yAxisLabelFontFamily;
          label.style.fontSize = `${this.settings.chart.yAxisLabelFontSize}px`;
          svg.appendChild(label);
        }
      }
    }

    if (this.settings.chart.showXAxisLabels) {
      this.model.xValues.forEach((xValue, index) => {
        const x = this.xCenter(layout, index);
        const label = svgText(x, layout.chartHeight - 6, xValue, "compact-trend-matrix__axis-label");
        label.setAttribute("text-anchor", "middle");
        label.style.fill = this.settings.chart.xAxisLabelColor;
        label.style.fontFamily = this.settings.chart.xAxisLabelFontFamily;
        label.style.fontSize = `${this.settings.chart.xAxisLabelFontSize}px`;
        svg.appendChild(label);
      });
    }
  }

  private renderLineChart(svg: SVGSVGElement, layout: VisualLayout, scale: ChartScale): void {
    const placedLabels: LabelBox[] = [];

    this.model.series.forEach((series) => {
      const definedPoints = series.values
        .filter((point) => this.valueForChart(point) !== null)
        .map((point) => ({
          point,
          x: this.xCenter(layout, point.xIndex),
          y: scale.y(this.valueForChart(point) as number)
        }));

      if (definedPoints.length > 1) {
        const path = document.createElementNS(SVG_NS, "path");
        path.classList.add("compact-trend-matrix__line");
        path.setAttribute("d", this.linePath(definedPoints));
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", series.color);
        path.setAttribute("stroke-width", String(this.settings.chart.lineWidth));
        path.setAttribute("stroke-linecap", "round");
        path.setAttribute("stroke-linejoin", "round");
        path.setAttribute("stroke-dasharray", lineDash(this.settings.chart.lineStyle));
        path.classList.toggle("is-dimmed", this.isDimmed(series.selectionId));
        this.wireSelection(path, series.selectionId);
        this.tooltipController.addCategoryTooltip(path, series.category, [], series.selectionId);
        svg.appendChild(path);
      }

      definedPoints.forEach(({ point, x, y }) => {
        const value = this.valueForChart(point);
        const conditional = evaluateConditionalFormatting(value, this.settings.conditionalFormatting, this.model.minValue, this.model.maxValue, false);
        const color = conditional.chartColor || series.color;

        if (this.settings.chart.showMarkers) {
          const marker = this.svgShape(this.settings.chart.markerShape, x, y, this.settings.chart.markerSize, color, "#ffffff", 1);
          marker.classList.add("compact-trend-matrix__mark");
          marker.classList.toggle("is-dimmed", this.isDimmed(point.selectionId));
          marker.setAttribute("tabindex", "0");
          marker.setAttribute("role", "button");
          marker.setAttribute("aria-label", `${point.category}, ${point.x}, ${this.model.measureName} ${formatValue(value, this.settings.values)}`);
          this.wireSelection(marker, point.selectionId);
          this.tooltipController.addPointTooltip(marker, point, this.model.measureName, formatValue(value, this.settings.values));
          svg.appendChild(marker);
        }

        if (this.settings.chart.showChartDataLabels && value !== null) {
          this.appendChartLabel(svg, layout, placedLabels, x, y, formatValue(value, this.settings.values));
        }
      });
    });
  }

  private renderClusteredBars(svg: SVGSVGElement, layout: VisualLayout, scale: ChartScale): void {
    const seriesCount = Math.max(1, this.model.series.length);
    const groupWidth = layout.columnWidth * (1 - this.settings.chart.barPadding);
    const gap = groupWidth * this.settings.chart.barInnerPadding;
    const barWidth = Math.max(2, (groupWidth - gap * (seriesCount - 1)) / seriesCount);
    const baseline = scale.y(0);

    this.model.xValues.forEach((_xValue, xIndex) => {
      const groupLeft = this.xCenter(layout, xIndex) - groupWidth / 2;

      this.model.series.forEach((series, seriesIndex) => {
        const point = series.values[xIndex];
        const value = this.valueForChart(point);
        if (value === null) {
          return;
        }

        const conditional = evaluateConditionalFormatting(value, this.settings.conditionalFormatting, this.model.minValue, this.model.maxValue, false);
        const color = conditional.chartColor || series.color;
        const barX = groupLeft + seriesIndex * (barWidth + gap);
        const y = scale.y(value);
        const rect = svgRect(barX, Math.min(y, baseline), barWidth, Math.abs(baseline - y), this.settings.chart.barCornerRadius);
        rect.classList.add("compact-trend-matrix__bar");
        rect.classList.toggle("is-dimmed", this.isDimmed(point.selectionId));
        rect.setAttribute("fill", color);
        rect.setAttribute("tabindex", "0");
        rect.setAttribute("role", "button");
        rect.setAttribute("aria-label", `${point.category}, ${point.x}, ${this.model.measureName} ${formatValue(value, this.settings.values)}`);
        this.wireSelection(rect, point.selectionId);
        this.tooltipController.addPointTooltip(rect, point, this.model.measureName, formatValue(value, this.settings.values));
        svg.appendChild(rect);

        if (this.settings.chart.showChartDataLabels) {
          this.appendChartLabel(svg, layout, [], barX + barWidth / 2, Math.min(y, baseline), formatValue(value, this.settings.values));
        }
      });
    });
  }

  private renderLollipopChart(svg: SVGSVGElement, layout: VisualLayout, scale: ChartScale): void {
    const placedLabels: LabelBox[] = [];
    const seriesCount = Math.max(1, this.model.series.length);
    const groupWidth = layout.columnWidth * (1 - this.settings.chart.barPadding);
    const gap = groupWidth * this.settings.chart.barInnerPadding;
    const slotWidth = Math.max(2, (groupWidth - gap * (seriesCount - 1)) / seriesCount);
    const baseline = scale.y(0);

    this.model.xValues.forEach((_xValue, xIndex) => {
      const groupLeft = this.xCenter(layout, xIndex) - groupWidth / 2;

      this.model.series.forEach((series, seriesIndex) => {
        const point = series.values[xIndex];
        const value = this.valueForChart(point);
        if (value === null) {
          return;
        }

        const conditional = evaluateConditionalFormatting(value, this.settings.conditionalFormatting, this.model.minValue, this.model.maxValue, false);
        const color = conditional.chartColor || series.color;
        const x = groupLeft + seriesIndex * (slotWidth + gap) + slotWidth / 2;
        const y = scale.y(value);
        const stem = svgLine(x, baseline, x, y, "compact-trend-matrix__lollipop-stem");
        stem.setAttribute("stroke", color);
        stem.setAttribute("stroke-width", String(this.settings.chart.lineWidth));
        stem.setAttribute("stroke-dasharray", lineDash(this.settings.chart.lineStyle));
        stem.classList.toggle("is-dimmed", this.isDimmed(point.selectionId));
        this.wireSelection(stem, point.selectionId);
        this.tooltipController.addPointTooltip(stem, point, this.model.measureName, formatValue(value, this.settings.values));
        svg.appendChild(stem);

        const marker = this.svgShape(this.settings.chart.markerShape, x, y, Math.max(5, this.settings.chart.markerSize + 2), color, "#ffffff", 1);
        marker.classList.add("compact-trend-matrix__mark");
        marker.classList.toggle("is-dimmed", this.isDimmed(point.selectionId));
        marker.setAttribute("tabindex", "0");
        marker.setAttribute("role", "button");
        marker.setAttribute("aria-label", `${point.category}, ${point.x}, ${this.model.measureName} ${formatValue(value, this.settings.values)}`);
        this.wireSelection(marker, point.selectionId);
        this.tooltipController.addPointTooltip(marker, point, this.model.measureName, formatValue(value, this.settings.values));
        svg.appendChild(marker);

        if (this.settings.chart.showChartDataLabels) {
          this.appendChartLabel(svg, layout, placedLabels, x, y, formatValue(value, this.settings.values));
        }
      });
    });
  }

  private renderReferenceLine(svg: SVGSVGElement, layout: VisualLayout, scale: ChartScale): void {
    const referenceLine = this.model.referenceLine;
    if (!this.settings.referenceLine.show || !referenceLine) {
      return;
    }

    const definedPoints = referenceLine.values
      .filter((point) => point.value !== null)
      .map((point) => ({
        point,
        x: this.xCenter(layout, point.xIndex),
        y: scale.y(point.value as number)
      }));

    if (definedPoints.length === 0) {
      return;
    }

    const placedReferenceLabels: LabelBox[] = [];

    if (definedPoints.length === 1) {
      const y = definedPoints[0].y;
      const line = svgLine(layout.plotLeft, y, layout.plotRight, y, "compact-trend-matrix__reference-line");
      line.setAttribute("stroke", this.settings.referenceLine.lineColor);
      line.setAttribute("stroke-width", String(this.settings.referenceLine.lineWidth));
      line.setAttribute("stroke-dasharray", lineDash(this.settings.referenceLine.lineStyle));
      svg.appendChild(line);
    } else {
      const path = document.createElementNS(SVG_NS, "path");
      path.classList.add("compact-trend-matrix__reference-line");
      path.setAttribute("d", this.linePath(definedPoints));
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", this.settings.referenceLine.lineColor);
      path.setAttribute("stroke-width", String(this.settings.referenceLine.lineWidth));
      path.setAttribute("stroke-linecap", "round");
      path.setAttribute("stroke-linejoin", "round");
      path.setAttribute("stroke-dasharray", lineDash(this.settings.referenceLine.lineStyle));
      svg.appendChild(path);
    }

    definedPoints.forEach(({ point, x, y }) => {
      if (this.settings.referenceLine.showMarkers) {
        const marker = this.svgShape(
          this.settings.referenceLine.markerShape,
          x,
          y,
          this.settings.referenceLine.markerSize,
          this.settings.referenceLine.markerColor,
          this.settings.referenceLine.markerBorderColor,
          this.settings.referenceLine.markerBorderWidth
        );
        marker.classList.add("compact-trend-matrix__mark");
        marker.setAttribute("aria-label", `${referenceLine.displayName}, ${point.x}, ${formatValue(point.value, this.settings.values)}`);
        svg.appendChild(marker);
      }

      if (this.settings.referenceLine.showDataLabels && point.value !== null) {
        this.appendReferenceLabel(svg, layout, placedReferenceLabels, x, y, formatValue(point.value, this.settings.values));
      }
    });

    if (this.settings.referenceLine.showLabel) {
      const labelText = this.settings.referenceLine.labelText.trim() || referenceLine.displayName;
      const last = definedPoints[definedPoints.length - 1];
      const fontSize = this.settings.referenceLine.labelFontSize;
      const labelWidth = estimateTextWidth(labelText, fontSize);
      const labelFitsRight = last.x + labelWidth + 10 <= layout.plotRight;
      const x = labelFitsRight ? last.x + 6 : Math.max(layout.plotLeft + labelWidth, last.x - 6);
      const y = Math.max(fontSize + 2, last.y - 6);
      this.appendReferenceLabel(svg, layout, placedReferenceLabels, x, y, labelText, labelFitsRight ? "start" : "end", false);
    }
  }

  private renderStackedBars(svg: SVGSVGElement, layout: VisualLayout, scale: ChartScale): void {
    const groupWidth = layout.columnWidth * (1 - this.settings.chart.barPadding);
    const placedLabels: LabelBox[] = [];

    this.model.xValues.forEach((_xValue, xIndex) => {
      let positiveBase = 0;
      let negativeBase = 0;

      this.model.series.forEach((series) => {
        const point = series.values[xIndex];
        const value = this.valueForChart(point);
        if (value === null) {
          return;
        }

        const start = value >= 0 ? positiveBase : negativeBase;
        const end = start + value;
        if (value >= 0) {
          positiveBase = end;
        } else {
          negativeBase = end;
        }

        const conditional = evaluateConditionalFormatting(value, this.settings.conditionalFormatting, this.model.minValue, this.model.maxValue, false);
        const color = conditional.chartColor || series.color;
        const y1 = scale.y(start);
        const y2 = scale.y(end);
        const rect = svgRect(this.xCenter(layout, xIndex) - groupWidth / 2, Math.min(y1, y2), groupWidth, Math.abs(y2 - y1), this.settings.chart.barCornerRadius);
        rect.classList.add("compact-trend-matrix__bar");
        rect.classList.toggle("is-dimmed", this.isDimmed(point.selectionId));
        rect.setAttribute("fill", color);
        rect.setAttribute("tabindex", "0");
        rect.setAttribute("role", "button");
        rect.setAttribute("aria-label", `${point.category}, ${point.x}, ${this.model.measureName} ${formatValue(value, this.settings.values)}`);
        this.wireSelection(rect, point.selectionId);
        this.tooltipController.addPointTooltip(rect, point, this.model.measureName, formatValue(value, this.settings.values));
        svg.appendChild(rect);

        if (this.settings.chart.showChartDataLabels) {
          this.appendChartLabel(svg, layout, placedLabels, this.xCenter(layout, xIndex), Math.min(y1, y2) + Math.abs(y2 - y1) / 2, formatValue(value, this.settings.values));
        }
      });
    });
  }

  private renderTable(layout: VisualLayout): HTMLDivElement {
    const table = document.createElement("div");
    table.className = "compact-trend-matrix__table";
    table.setAttribute("role", "grid");
    table.style.rowGap = `${this.settings.table.rowGap}px`;
    table.style.background = this.settings.table.backgroundColor;
    table.style.padding = `${this.settings.table.tablePaddingTop + (this.settings.table.showColumnLabels ? 2 : 0)}px ${this.settings.table.tablePaddingRight}px ${this.settings.table.tablePaddingBottom}px ${this.settings.table.tablePaddingLeft}px`;

    if (this.settings.table.showColumnLabels) {
      table.appendChild(this.renderColumnHeader(layout));
    }

    this.model.series.forEach((series) => {
      table.appendChild(this.renderSeriesRow(series, layout));
    });

    if (this.settings.additionalRows.show) {
      this.model.additionalRows.forEach((row) => {
        table.appendChild(this.renderAdditionalRow(row, layout));
      });
    }

    if (this.settings.totalRow.show) {
      table.appendChild(this.renderTotalRow(layout));
    }

    return table;
  }

  private renderColumnHeader(layout: VisualLayout): HTMLDivElement {
    const row = this.createTableRow(layout, "compact-trend-matrix__header-row");
    row.setAttribute("role", "row");

    const labelCell = document.createElement("div");
    labelCell.className = "compact-trend-matrix__corner-cell";
    labelCell.style.height = `${layout.rowHeight}px`;
    labelCell.textContent = this.model.categoryName;
    labelCell.style.fontFamily = this.settings.columnLabels.fontFamily;
    labelCell.style.fontSize = `${this.settings.columnLabels.fontSize}px`;
    labelCell.style.fontWeight = this.settings.columnLabels.bold ? "600" : "400";
    labelCell.style.color = this.settings.columnLabels.fontColor;
    row.appendChild(labelCell);

    this.model.xValues.forEach((xValue) => {
      const cell = document.createElement("div");
      cell.className = "compact-trend-matrix__column-header";
      cell.setAttribute("role", "columnheader");
      cell.textContent = xValue;
      cell.style.height = `${layout.rowHeight}px`;
      cell.style.fontFamily = this.settings.columnLabels.fontFamily;
      cell.style.fontSize = `${this.settings.columnLabels.fontSize}px`;
      cell.style.fontWeight = this.settings.columnLabels.bold ? "600" : "400";
      cell.style.fontStyle = this.settings.columnLabels.italic ? "italic" : "normal";
      cell.style.color = this.settings.columnLabels.fontColor;
      cell.style.background = "#f4f6f8";
      cell.style.borderColor = this.settings.table.columnCardBorderColor;
      cell.style.borderWidth = `${this.tableBorderWidth()}px`;
      cell.style.borderRadius = `${this.settings.table.columnCardCornerRadius}px`;
      cell.style.textAlign = this.settings.columnLabels.alignment;
      cell.style.justifyContent = cssAlignment(this.settings.columnLabels.alignment);
      row.appendChild(cell);
    });

    if (this.hasTotalColumn()) {
      const cell = document.createElement("div");
      cell.className = "compact-trend-matrix__column-header compact-trend-matrix__total-column-header";
      cell.setAttribute("role", "columnheader");
      cell.textContent = this.settings.totalRow.columnLabelText;
      cell.style.height = `${layout.rowHeight}px`;
      cell.style.fontFamily = this.settings.columnLabels.fontFamily;
      cell.style.fontSize = `${this.settings.columnLabels.fontSize}px`;
      cell.style.fontWeight = "700";
      cell.style.color = this.settings.totalRow.fontColor;
      cell.style.background = this.totalBackgroundColor();
      cell.style.borderColor = this.totalCardBorderColor();
      cell.style.borderWidth = `${this.totalCardBorderWidth()}px`;
      cell.style.borderRadius = `${this.totalCardCornerRadius()}px`;
      cell.style.justifyContent = cssAlignment(this.settings.columnLabels.alignment);
      row.appendChild(cell);
    }

    return row;
  }

  private renderSeriesRow(series: TrendSeries, layout: VisualLayout): HTMLDivElement {
    const row = this.createTableRow(layout, "compact-trend-matrix__data-row");
    row.setAttribute("role", "row");

    const labelCell = document.createElement("div");
    labelCell.className = "compact-trend-matrix__row-label";
    labelCell.setAttribute("role", "rowheader");
    labelCell.setAttribute("tabindex", "0");
    labelCell.style.height = `${layout.rowHeight}px`;
    labelCell.style.fontFamily = this.settings.rowLabels.fontFamily;
    labelCell.style.fontSize = `${this.settings.rowLabels.fontSize}px`;
    labelCell.style.fontWeight = this.settings.rowLabels.bold ? "600" : "400";
    labelCell.style.fontStyle = this.settings.rowLabels.italic ? "italic" : "normal";
    labelCell.style.color = this.settings.rowLabels.fontColor;
    labelCell.style.justifyContent = cssAlignment(this.settings.rowLabels.alignment);
    labelCell.classList.toggle("is-dimmed", this.isDimmed(series.selectionId));
    labelCell.setAttribute("aria-label", `Category ${series.category}`);

    if (this.settings.table.showRowLabels) {
      this.appendCategoryLabelContent(labelCell, series);
      this.wireSelection(labelCell, series.selectionId);
      this.tooltipController.addCategoryTooltip(labelCell, series.category, [], series.selectionId);
    }

    row.appendChild(labelCell);

    series.values.forEach((point) => {
      row.appendChild(this.renderValueCell(point, layout));
    });

    if (this.settings.totalRow.showColumn) {
      row.appendChild(this.renderSeriesTotalCell(series, layout));
    } else if (this.hasTotalColumn()) {
      row.appendChild(this.renderEmptyTotalCell(layout));
    }

    return row;
  }

  private renderAdditionalRow(additionalRow: AdditionalRowSeries, layout: VisualLayout): HTMLDivElement {
    const row = this.createTableRow(layout, "compact-trend-matrix__data-row compact-trend-matrix__additional-row");
    row.setAttribute("role", "row");

    const labelCell = document.createElement("div");
    labelCell.className = "compact-trend-matrix__row-label compact-trend-matrix__additional-row-label";
    labelCell.setAttribute("role", "rowheader");
    labelCell.style.height = `${layout.rowHeight}px`;
    labelCell.style.fontFamily = this.additionalRowLabelFontFamily(additionalRow);
    labelCell.style.fontSize = `${this.additionalRowLabelFontSize(additionalRow)}px`;
    labelCell.style.fontWeight = this.additionalRowLabelBold(additionalRow) ? "700" : "400";
    labelCell.style.fontStyle = this.additionalRowLabelItalic(additionalRow) ? "italic" : "normal";
    labelCell.style.color = this.additionalRowLabelColor(additionalRow);
    labelCell.style.gap = `${this.settings.additionalRows.markerTextGap}px`;
    labelCell.style.justifyContent = cssAlignment(this.settings.additionalRows.labelAlignment);
    labelCell.style.paddingLeft = `${this.settings.additionalRows.labelPaddingLeft}px`;
    labelCell.style.paddingRight = `${this.settings.additionalRows.labelPaddingRight}px`;
    labelCell.setAttribute("aria-label", `Additional row ${additionalRow.label}`);

    if (this.settings.table.showRowLabels) {
      this.appendAdditionalRowLabelContent(labelCell, additionalRow);
    }

    row.appendChild(labelCell);

    additionalRow.values.forEach((point) => {
      row.appendChild(this.renderAdditionalRowValueCell(additionalRow, point, layout));
    });

    if (this.hasTotalColumn()) {
      row.appendChild(this.settings.additionalRows.showTotals ? this.renderAdditionalRowTotalCell(additionalRow, layout) : this.renderEmptyTotalCell(layout));
    }

    return row;
  }

  private renderValueCell(point: TrendPoint, layout: VisualLayout): HTMLDivElement {
    const value = point.value;
    const formattedValue = formatValue(value, this.settings.values);
    const conditional = evaluateConditionalFormatting(value, this.settings.conditionalFormatting, this.model.minValue, this.model.maxValue, false);
    const cell = document.createElement("div");
    cell.className = "compact-trend-matrix__value-cell";
    cell.setAttribute("role", "gridcell");
    cell.setAttribute("tabindex", "0");
    cell.setAttribute("aria-label", `${point.category}, ${point.x}, ${this.model.measureName} ${formattedValue}`);
    cell.textContent = formattedValue;
    cell.style.height = `${layout.rowHeight}px`;
    cell.style.padding = `0 ${this.settings.table.cellPadding}px`;
    cell.style.fontFamily = this.settings.values.fontFamily;
    cell.style.fontSize = `${conditional.fontSize || this.settings.values.fontSize}px`;
    cell.style.fontWeight = conditional.bold || this.settings.values.bold ? "600" : "400";
    cell.style.fontStyle = this.settings.values.italic ? "italic" : "normal";
    cell.style.textDecoration = this.settings.values.underline ? "underline" : "none";
    cell.style.color = conditional.color || this.settings.values.fontColor;
    cell.style.background = conditional.backgroundColor || this.settings.table.columnCardBackgroundColor;
    cell.style.borderColor = this.settings.table.columnCardBorderColor;
    cell.style.borderWidth = `${this.tableBorderWidth()}px`;
    cell.style.borderRadius = `${this.settings.table.columnCardCornerRadius}px`;
    cell.style.textAlign = this.settings.values.horizontalAlignment;
    cell.style.justifyContent = cssAlignment(this.settings.values.horizontalAlignment);
    cell.classList.toggle("is-dimmed", this.isDimmed(point.selectionId));

    this.wireSelection(cell, point.selectionId);
    this.tooltipController.addPointTooltip(cell, point, this.model.measureName, formattedValue);

    return cell;
  }

  private renderAdditionalRowValueCell(additionalRow: AdditionalRowSeries, point: AdditionalRowPoint, layout: VisualLayout): HTMLDivElement {
    const formattedValue = formatValue(point.value, this.settings.values, additionalRow.format);
    const cell = document.createElement("div");
    cell.className = "compact-trend-matrix__value-cell compact-trend-matrix__additional-row-value";
    cell.setAttribute("role", "gridcell");
    cell.setAttribute("aria-label", `${additionalRow.label}, ${point.x}, ${formattedValue}`);
    cell.textContent = formattedValue;
    cell.style.height = `${layout.rowHeight}px`;
    cell.style.padding = `0 ${this.settings.table.cellPadding}px`;
    cell.style.fontFamily = this.additionalRowValueFontFamily(additionalRow);
    cell.style.fontSize = `${this.additionalRowValueFontSize(additionalRow)}px`;
    cell.style.fontWeight = this.additionalRowValueBold(additionalRow) ? "600" : "400";
    cell.style.fontStyle = this.additionalRowValueItalic(additionalRow) ? "italic" : "normal";
    cell.style.color = this.additionalRowValueColor(additionalRow);
    cell.style.background = this.additionalRowBackgroundColor();
    cell.style.borderColor = this.settings.additionalRows.cellBorderColor;
    cell.style.borderWidth = `${this.additionalRowBorderWidth()}px`;
    cell.style.borderRadius = `${this.settings.table.columnCardCornerRadius}px`;
    cell.style.textAlign = this.settings.values.horizontalAlignment;
    cell.style.justifyContent = cssAlignment(this.settings.values.horizontalAlignment);
    return cell;
  }

  private renderAdditionalRowTotalCell(additionalRow: AdditionalRowSeries, layout: VisualLayout): HTMLDivElement {
    const value = this.additionalRowTotal(additionalRow);
    const cell = document.createElement("div");
    cell.className = "compact-trend-matrix__total-cell compact-trend-matrix__additional-row-total-cell";
    cell.setAttribute("role", "gridcell");
    cell.textContent = formatValue(value, this.settings.values, additionalRow.format);
    cell.style.height = `${layout.rowHeight}px`;
    cell.style.padding = `0 ${this.settings.table.cellPadding}px`;
    cell.style.fontFamily = this.additionalRowValueFontFamily(additionalRow);
    cell.style.fontSize = `${this.additionalRowValueFontSize(additionalRow)}px`;
    cell.style.fontWeight = "700";
    cell.style.fontStyle = this.additionalRowValueItalic(additionalRow) ? "italic" : "normal";
    cell.style.color = this.additionalRowValueColor(additionalRow);
    cell.style.background = this.additionalRowBackgroundColor();
    cell.style.borderColor = this.settings.additionalRows.cellBorderColor;
    cell.style.borderWidth = `${this.additionalRowBorderWidth()}px`;
    cell.style.borderRadius = `${this.settings.table.columnCardCornerRadius}px`;
    cell.style.textAlign = this.settings.values.horizontalAlignment;
    cell.style.justifyContent = cssAlignment(this.settings.values.horizontalAlignment);
    return cell;
  }

  private renderEmptyTotalCell(layout: VisualLayout): HTMLDivElement {
    const cell = document.createElement("div");
    cell.className = "compact-trend-matrix__total-cell compact-trend-matrix__empty-total-cell";
    cell.setAttribute("role", "gridcell");
    cell.style.height = `${layout.rowHeight}px`;
    cell.style.background = "transparent";
    cell.style.borderWidth = "0";
    return cell;
  }

  private renderSeriesTotalCell(series: TrendSeries, layout: VisualLayout): HTMLDivElement {
    const value = this.seriesTotal(series);
    const conditional = evaluateConditionalFormatting(value, this.settings.conditionalFormatting, Math.min(this.model.minValue, value), Math.max(this.model.maxValue, value), true);
    const cell = document.createElement("div");
    cell.className = "compact-trend-matrix__total-cell compact-trend-matrix__total-column-cell";
    cell.setAttribute("role", "gridcell");
    cell.textContent = formatValue(value, this.settings.values);
    cell.style.height = `${layout.rowHeight}px`;
    cell.style.padding = `0 ${this.settings.table.cellPadding}px`;
    cell.style.fontFamily = this.settings.values.fontFamily;
    cell.style.fontSize = `${conditional.fontSize || this.settings.totalRow.fontSize}px`;
    cell.style.fontWeight = conditional.bold || this.settings.totalRow.bold ? "700" : "400";
    cell.style.color = conditional.color || this.settings.totalRow.fontColor;
    cell.style.background = conditional.backgroundColor || this.totalBackgroundColor();
    cell.style.borderColor = this.totalCardBorderColor();
    cell.style.borderWidth = `${this.totalCardBorderWidth()}px`;
    cell.style.borderRadius = `${this.totalCardCornerRadius()}px`;
    cell.style.textAlign = this.settings.values.horizontalAlignment;
    cell.style.justifyContent = cssAlignment(this.settings.values.horizontalAlignment);
    return cell;
  }

  private renderTotalRow(layout: VisualLayout): HTMLDivElement {
    const row = this.createTableRow(layout, "compact-trend-matrix__total-row");
    row.setAttribute("role", "row");
    row.style.background = this.totalBackgroundColor();
    row.style.paddingTop = this.settings.totalRow.showDivider ? `${this.settings.totalRow.dividerSpacing}px` : "0";

    if (this.settings.totalRow.showDivider) {
      row.style.borderTop = `${Math.max(1, this.settings.table.dividerWidth)}px solid ${this.settings.totalRow.dividerColor}`;
    }

    const labelCell = document.createElement("div");
    labelCell.className = "compact-trend-matrix__total-label";
    labelCell.setAttribute("role", "rowheader");
    labelCell.textContent = this.settings.totalRow.labelText;
    labelCell.style.height = `${layout.rowHeight}px`;
    labelCell.style.fontSize = `${this.settings.totalRow.fontSize}px`;
    labelCell.style.fontWeight = this.settings.totalRow.bold ? "700" : "400";
    labelCell.style.color = this.settings.totalRow.fontColor;
    labelCell.style.background = this.totalBackgroundColor();
    labelCell.style.borderColor = this.totalCardBorderColor();
    labelCell.style.borderWidth = `${this.totalCardBorderWidth()}px`;
    labelCell.style.borderRadius = `${this.totalCardCornerRadius()}px`;
    labelCell.style.padding = `0 ${this.settings.table.cellPadding}px`;
    labelCell.style.justifyContent = cssAlignment(this.settings.rowLabels.alignment);
    row.appendChild(labelCell);

    this.model.totals.forEach((point) => {
      row.appendChild(this.renderTotalCell(point, layout));
    });

    if (this.settings.totalRow.showColumn) {
      row.appendChild(this.renderGrandTotalCell(layout));
    } else if (this.hasTotalColumn()) {
      row.appendChild(this.renderEmptyTotalCell(layout));
    }

    return row;
  }

  private renderTotalCell(point: TrendTotalPoint, layout: VisualLayout): HTMLDivElement {
    const conditional = evaluateConditionalFormatting(point.value, this.settings.conditionalFormatting, this.model.minValue, this.model.maxValue, true);
    const cell = document.createElement("div");
    cell.className = "compact-trend-matrix__total-cell";
    cell.setAttribute("role", "gridcell");
    cell.textContent = formatValue(point.value, this.settings.values);
    cell.style.height = `${layout.rowHeight}px`;
    cell.style.padding = `0 ${this.settings.table.cellPadding}px`;
    cell.style.fontFamily = this.settings.values.fontFamily;
    cell.style.fontSize = `${conditional.fontSize || this.settings.totalRow.fontSize}px`;
    cell.style.fontWeight = conditional.bold || this.settings.totalRow.bold ? "700" : "400";
    cell.style.color = conditional.color || this.settings.totalRow.fontColor;
    cell.style.background = conditional.backgroundColor || this.totalBackgroundColor();
    cell.style.borderColor = this.totalCardBorderColor();
    cell.style.borderWidth = `${this.totalCardBorderWidth()}px`;
    cell.style.borderRadius = `${this.totalCardCornerRadius()}px`;
    cell.style.textAlign = this.settings.values.horizontalAlignment;
    cell.style.justifyContent = cssAlignment(this.settings.values.horizontalAlignment);
    this.tooltipController.addTotalTooltip(cell, point, this.settings.totalRow.labelText, this.model.measureName, this.settings.values);
    return cell;
  }

  private renderGrandTotalCell(layout: VisualLayout): HTMLDivElement {
    const value = this.model.series.reduce((sum, series) => sum + this.seriesTotal(series), 0);
    const conditional = evaluateConditionalFormatting(value, this.settings.conditionalFormatting, Math.min(this.model.minValue, value), Math.max(this.model.maxValue, value), true);
    const cell = document.createElement("div");
    cell.className = "compact-trend-matrix__total-cell compact-trend-matrix__grand-total-cell";
    cell.setAttribute("role", "gridcell");
    cell.textContent = formatValue(value, this.settings.values);
    cell.style.height = `${layout.rowHeight}px`;
    cell.style.padding = `0 ${this.settings.table.cellPadding}px`;
    cell.style.fontFamily = this.settings.values.fontFamily;
    cell.style.fontSize = `${conditional.fontSize || this.settings.totalRow.fontSize}px`;
    cell.style.fontWeight = "700";
    cell.style.color = conditional.color || this.settings.totalRow.fontColor;
    cell.style.background = conditional.backgroundColor || this.totalBackgroundColor();
    cell.style.borderColor = this.totalCardBorderColor();
    cell.style.borderWidth = `${this.totalCardBorderWidth()}px`;
    cell.style.borderRadius = `${this.totalCardCornerRadius()}px`;
    cell.style.textAlign = this.settings.values.horizontalAlignment;
    cell.style.justifyContent = cssAlignment(this.settings.values.horizontalAlignment);
    return cell;
  }

  private appendCategoryLabelContent(labelCell: HTMLDivElement, series: TrendSeries): void {
    const rowTotal = series.values.reduce((sum, point) => sum + (point.value ?? 0), 0);
    const conditional = evaluateConditionalFormatting(rowTotal, this.settings.conditionalFormatting, this.model.minValue, this.model.maxValue, false);
    const shapeColor = conditional.shapeColor || series.color;
    const text = document.createElement("span");
    text.className = "compact-trend-matrix__row-label-text";
    text.textContent = series.category;
    text.style.maxWidth = `${this.settings.rowLabels.maxLabelWidth}px`;
    text.style.whiteSpace = this.settings.rowLabels.textWrap ? "normal" : "nowrap";
    text.style.textAlign = this.settings.rowLabels.alignment;

    if (this.settings.categoryShape.show && this.settings.table.showCategoryShapes && this.settings.categoryShape.shapeType !== "none") {
      const shape = document.createElement("span");
      shape.className = "compact-trend-matrix__category-shape";
      shape.style.width = `${this.categoryShapeWidth()}px`;
      shape.style.height = `${this.settings.categoryShape.size}px`;
      shape.style.opacity = String(this.settings.categoryShape.opacity);
      shape.appendChild(this.htmlShape(this.settings.categoryShape.shapeType, shapeColor));

      if (this.settings.categoryShape.layout === "edge") {
        labelCell.classList.add("is-edge-layout");
        labelCell.style.justifyContent = "space-between";
        text.style.flex = "1 1 auto";
        if (this.settings.categoryShape.position === "before") {
          text.style.marginLeft = "auto";
          labelCell.appendChild(shape);
          labelCell.appendChild(text);
        } else {
          shape.style.marginLeft = "auto";
          labelCell.appendChild(text);
          labelCell.appendChild(shape);
        }
        return;
      }

      if (this.settings.categoryShape.position === "before") {
        labelCell.appendChild(shape);
        labelCell.appendChild(text);
      } else {
        labelCell.appendChild(text);
        labelCell.appendChild(shape);
      }
    } else {
      labelCell.appendChild(text);
    }
  }

  private appendAdditionalRowLabelContent(labelCell: HTMLDivElement, additionalRow: AdditionalRowSeries): void {
    const text = document.createElement("span");
    text.className = "compact-trend-matrix__row-label-text";
    text.textContent = additionalRow.label;
    text.style.maxWidth = `${this.settings.rowLabels.maxLabelWidth}px`;
    text.style.whiteSpace = this.settings.rowLabels.textWrap ? "normal" : "nowrap";
    text.style.textAlign = this.settings.additionalRows.labelAlignment;

    const markerShape = this.additionalRowMarkerShape(additionalRow);
    if (this.settings.additionalRows.markerShow && markerShape !== "none") {
      const shape = document.createElement("span");
      shape.className = "compact-trend-matrix__category-shape compact-trend-matrix__additional-row-shape";
      shape.style.width = `${this.additionalRowShapeWidth(additionalRow)}px`;
      shape.style.height = `${this.additionalRowMarkerSize(additionalRow)}px`;
      shape.style.opacity = String(this.settings.additionalRows.markerOpacity);
      shape.appendChild(this.htmlShape(
        markerShape,
        this.additionalRowMarkerColor(additionalRow),
        this.additionalRowMarkerSize(additionalRow),
        this.settings.additionalRows.markerBorderColor,
        this.settings.additionalRows.markerBorderWidth
      ));

      if (this.settings.additionalRows.markerLayout === "edge") {
        labelCell.classList.add("is-edge-layout");
        labelCell.style.justifyContent = "space-between";
        text.style.flex = "1 1 auto";
        if (this.settings.additionalRows.markerPosition === "before") {
          text.style.marginLeft = "auto";
          labelCell.appendChild(shape);
          labelCell.appendChild(text);
        } else {
          shape.style.marginLeft = "auto";
          labelCell.appendChild(text);
          labelCell.appendChild(shape);
        }
        return;
      }

      if (this.settings.additionalRows.markerPosition === "before") {
        labelCell.appendChild(shape);
        labelCell.appendChild(text);
      } else {
        labelCell.appendChild(text);
        labelCell.appendChild(shape);
      }
      return;
    }

    labelCell.appendChild(text);
  }

  private createTableRow(layout: VisualLayout, className: string): HTMLDivElement {
    const row = document.createElement("div");
    row.className = className;
    row.style.display = "grid";
    row.style.gridTemplateColumns = `${layout.rowLabelWidth}px repeat(${this.model.xValues.length}, ${layout.columnWidth}px)${this.hasTotalColumn() ? ` ${layout.totalColumnWidth}px` : ""}`;
    row.style.columnGap = `${layout.columnGap}px`;

    if (this.settings.table.showDividers) {
      row.style.borderBottom = `${this.settings.table.dividerWidth}px solid ${this.settings.table.dividerColor}`;
    }

    return row;
  }

  private topFilterHeight(): number {
    const filters = this.activeTopFilters();
    if (filters.length === 0 && !this.showChartSelector()) {
      return 0;
    }

    const maxFilterFontSize = filters.reduce((maximum, filter) => Math.max(maximum, this.topFilterStyle(filter.role).fontSize), 0);
    const filterHeight = filters.length > 0
      ? maxFilterFontSize + this.settings.topFilters.paddingTop + this.settings.topFilters.paddingBottom + 22
      : 0;
    const selectorHeight = this.showChartSelector() ? this.settings.chartSelector.fontSize + 26 : 0;
    return Math.max(34, filterHeight, selectorHeight);
  }

  private computeLayout(options: VisualUpdateOptions): VisualLayout {
    const viewportWidth = Math.max(80, Math.floor(options.viewport.width || this.root.clientWidth || 320));
    const viewportHeight = Math.max(60, Math.floor(options.viewport.height || this.root.clientHeight || 240));
    const xCount = Math.max(1, this.model.xValues.length);
    const columnGap = this.settings.table.columnGap;
    const rowLabelWidth = this.settings.table.showRowLabels ? this.settings.table.rowLabelWidth : 0;
    const hasTotalColumn = this.hasTotalColumn();
    const totalColumnWidth = hasTotalColumn ? this.settings.totalRow.columnWidth : 0;
    const tableColumnGapCount = Math.max(0, xCount - 1 + (hasTotalColumn ? 1 : 0));
    const availableWidth = Math.max(40, viewportWidth - rowLabelWidth - totalColumnWidth - columnGap * tableColumnGapCount - 8 - this.settings.table.tablePaddingLeft - this.settings.table.tablePaddingRight);
    let columnWidth = this.settings.table.fixedColumnWidth;
    const topFilterHeight = this.topFilterHeight();

    if (this.settings.table.columnWidthMode === "fit") {
      columnWidth = Math.max(42, availableWidth / xCount);
    } else if (this.settings.table.columnWidthMode === "auto") {
      columnWidth = Math.max(54, Math.min(110, availableWidth / xCount));
    }

    const xAreaWidth = columnWidth * xCount + columnGap * Math.max(0, xCount - 1);
    const contentWidth = Math.ceil(rowLabelWidth + xAreaWidth + totalColumnWidth + columnGap * (hasTotalColumn ? 1 : 0) + 8 + this.settings.table.tablePaddingLeft + this.settings.table.tablePaddingRight);
    const rowHeight = Math.max(
      26,
      this.settings.values.fontSize + this.settings.table.cellPadding * 2,
      this.settings.additionalRows.valueFontSize + this.settings.table.cellPadding * 2,
      this.settings.categoryShape.size + 12,
      this.settings.additionalRows.markerSize + 12
    );
    const chartHeight = this.settings.chart.show && this.settings.chart.chartType !== "none"
      ? Math.max(48, Math.min(this.settings.chart.chartHeight, Math.max(48, viewportHeight - rowHeight - topFilterHeight)))
      : 0;
    const plotTop = Math.max(0, this.settings.chart.chartPaddingTop);
    const plotBottom = Math.max(plotTop + 8, chartHeight - (this.settings.chart.showXAxisLabels ? 24 : 8) - this.settings.chart.chartPaddingBottom);
    const plotLeft = this.settings.table.tablePaddingLeft + rowLabelWidth + this.settings.chart.chartPaddingLeft;
    const plotRight = Math.max(plotLeft + 1, this.settings.table.tablePaddingLeft + rowLabelWidth + xAreaWidth - this.settings.chart.chartPaddingRight);

    return {
      viewportWidth,
      viewportHeight,
      rowLabelWidth,
      columnWidth,
      totalColumnWidth,
      columnGap,
      contentWidth,
      chartHeight,
      topFilterHeight,
      rowHeight,
      plotTop,
      plotBottom,
      plotLeft,
      plotRight
    };
  }

  private createScale(layout: VisualLayout): ChartScale {
    const stacked = this.settings.chart.chartType === "stackedBar";
    const values = stacked ? this.stackedExtents() : [this.model.minValue, this.model.maxValue];
    let min = values[0];
    let max = values[1];

    if (!this.settings.chart.autoScaleYAxis && this.settings.chart.yAxisEnd > this.settings.chart.yAxisStart) {
      min = this.settings.chart.yAxisStart;
      max = this.settings.chart.yAxisEnd;
    }

    if (min === max) {
      max = min + 1;
    }

    const plotHeight = Math.max(1, layout.plotBottom - layout.plotTop);

    return {
      min,
      max,
      y: (value: number) => layout.plotBottom - ((value - min) / (max - min)) * plotHeight
    };
  }

  private stackedExtents(): [number, number] {
    let min = 0;
    let max = 0;

    this.model.xValues.forEach((_xValue, xIndex) => {
      let positive = 0;
      let negative = 0;
      this.model.series.forEach((series) => {
        const value = this.valueForChart(series.values[xIndex]) || 0;
        if (value >= 0) {
          positive += value;
        } else {
          negative += value;
        }
      });
      min = Math.min(min, negative);
      max = Math.max(max, positive);
    });

    return [min, max || 1];
  }

  private getThemeColor(category: string, index: number): string | undefined {
    try {
      const colorPalette = (this.host as any).colorPalette;
      const color = colorPalette?.getColor?.(category || String(index));
      return color?.value;
    } catch {
      return undefined;
    }
  }

  private xCenter(layout: VisualLayout, xIndex: number): number {
    return this.settings.table.tablePaddingLeft + layout.rowLabelWidth + xIndex * (layout.columnWidth + layout.columnGap) + layout.columnWidth / 2;
  }

  private valueForChart(point: TrendPoint | undefined): number | null {
    if (!point) {
      return null;
    }

    return point.highlight ?? point.value;
  }

  private appendChartLabel(svg: SVGSVGElement, layout: VisualLayout, placedLabels: LabelBox[], pointX: number, pointY: number, text: string): void {
    const fontSize = this.settings.chart.chartLabelFontSize;
    const width = estimateTextWidth(text, fontSize);
    const height = fontSize + 4;
    const placement = this.chartLabelPlacement(pointX, pointY, width, height);
    const box = labelBox(placement.x, placement.y, width, height, placement.anchor);
    placedLabels.push(box);

    if (this.settings.chart.avoidLabelCollisions && this.settings.chart.chartLabelPosition === "auto") {
      const candidates = this.chartLabelAutoPlacements(pointX, pointY);
      const chosen = candidates.find((candidate) => !labelBoxCollides(labelBox(candidate.x, candidate.y, width, height, candidate.anchor), placedLabels.slice(0, -1), layout));
      if (chosen) {
        placement.x = chosen.x;
        placement.y = chosen.y;
        placement.anchor = chosen.anchor;
        placedLabels[placedLabels.length - 1] = labelBox(placement.x, placement.y, width, height, placement.anchor);
      }
    }

    if (this.settings.chart.chartLabelBackgroundShow) {
      const paddingX = 3;
      const paddingY = 2;
      const backgroundBox = labelBox(placement.x, placement.y, width, height, placement.anchor);
      const background = svgRect(backgroundBox.x - paddingX, backgroundBox.y - paddingY, backgroundBox.width + paddingX * 2, backgroundBox.height + paddingY * 2, 3);
      background.classList.add("compact-trend-matrix__chart-label-background");
      background.setAttribute("fill", this.settings.chart.chartLabelBackgroundColor);
      background.setAttribute("fill-opacity", String(1 - this.settings.chart.chartLabelBackgroundTransparency / 100));
      svg.appendChild(background);
    }

    const label = svgText(placement.x, placement.y, text, "compact-trend-matrix__chart-label");
    label.setAttribute("fill", this.settings.chart.chartLabelColor);
    label.setAttribute("font-size", String(fontSize));
    label.setAttribute("text-anchor", placement.anchor);
    label.setAttribute("dominant-baseline", "central");
    svg.appendChild(label);
  }

  private appendReferenceLabel(
    svg: SVGSVGElement,
    layout: VisualLayout,
    placedLabels: LabelBox[],
    pointX: number,
    pointY: number,
    text: string,
    fixedAnchor: "start" | "middle" | "end" = "middle",
    autoPlace = true
  ): void {
    const fontSize = this.settings.referenceLine.labelFontSize;
    const width = estimateTextWidth(text, fontSize);
    const height = fontSize + 4;
    const markerGap = this.settings.referenceLine.markerSize + 4;
    let placement: ChartLabelPlacement = { x: pointX, y: pointY - markerGap, anchor: fixedAnchor };

    if (autoPlace) {
      const candidates: ChartLabelPlacement[] = [
        { x: pointX, y: pointY - markerGap, anchor: "middle" },
        { x: pointX + markerGap, y: pointY, anchor: "start" },
        { x: pointX - markerGap, y: pointY, anchor: "end" },
        { x: pointX, y: pointY + markerGap, anchor: "middle" }
      ];
      placement = candidates.find((candidate) => !labelBoxCollides(labelBox(candidate.x, candidate.y, width, height, candidate.anchor), placedLabels, layout)) || candidates[0];
    }

    const box = labelBox(placement.x, placement.y, width, height, placement.anchor);
    placedLabels.push(box);

    if (this.settings.referenceLine.labelBackgroundShow) {
      const paddingX = 3;
      const paddingY = 2;
      const background = svgRect(box.x - paddingX, box.y - paddingY, box.width + paddingX * 2, box.height + paddingY * 2, 3);
      background.classList.add("compact-trend-matrix__reference-label-background");
      background.setAttribute("fill", this.settings.referenceLine.labelBackgroundColor);
      background.setAttribute("fill-opacity", String(1 - this.settings.referenceLine.labelBackgroundTransparency / 100));
      svg.appendChild(background);
    }

    const label = svgText(placement.x, placement.y, text, "compact-trend-matrix__reference-label");
    label.setAttribute("fill", this.settings.referenceLine.labelColor);
    label.setAttribute("font-size", String(fontSize));
    label.setAttribute("text-anchor", placement.anchor);
    label.setAttribute("dominant-baseline", "central");
    svg.appendChild(label);
  }

  private chartLabelPlacement(pointX: number, pointY: number, width: number, height: number): ChartLabelPlacement {
    const position = this.settings.chart.chartLabelPosition;
    if (position === "insideMarker") {
      return this.insideMarkerLabelPlacement(pointX, pointY, width, height);
    }

    if (position !== "auto") {
      return this.fixedChartLabelPlacement(pointX, pointY, position);
    }

    return this.chartLabelAutoPlacements(pointX, pointY)[0];
  }

  private chartLabelAutoPlacements(pointX: number, pointY: number): ChartLabelPlacement[] {
    const offsetX = this.settings.chart.labelOffsetX;
    const offsetY = this.settings.chart.labelOffsetY;
    const markerGap = this.settings.chart.markerSize + 3;
    return [
      { x: pointX + markerGap + offsetX, y: pointY, anchor: "start" },
      { x: pointX, y: pointY - markerGap - offsetY, anchor: "middle" },
      { x: pointX - markerGap - offsetX, y: pointY, anchor: "end" },
      { x: pointX, y: pointY + markerGap + offsetY, anchor: "middle" }
    ];
  }

  private fixedChartLabelPlacement(pointX: number, pointY: number, position: string): ChartLabelPlacement {
    const offsetX = this.settings.chart.labelOffsetX;
    const offsetY = this.settings.chart.labelOffsetY;
    const markerGap = this.settings.chart.markerSize + 3;

    if (position === "above") {
      return { x: pointX, y: pointY - markerGap - offsetY, anchor: "middle" };
    }

    if (position === "below") {
      return { x: pointX, y: pointY + markerGap + offsetY, anchor: "middle" };
    }

    if (position === "left") {
      return { x: pointX - markerGap - offsetX, y: pointY, anchor: "end" };
    }

    return { x: pointX + markerGap + offsetX, y: pointY, anchor: "start" };
  }

  private insideMarkerLabelPlacement(pointX: number, pointY: number, width: number, height: number): ChartLabelPlacement {
    const markerHalf = Math.max(4, this.settings.chart.markerSize / 2);
    let x = pointX;
    let anchor: "start" | "middle" | "end" = "middle";
    if (this.settings.chart.chartLabelHorizontalAlignment === "left") {
      x = pointX - markerHalf + 2;
      anchor = "start";
    } else if (this.settings.chart.chartLabelHorizontalAlignment === "right") {
      x = pointX + markerHalf - 2;
      anchor = "end";
    }

    let y = pointY;
    if (this.settings.chart.chartLabelVerticalAlignment === "top") {
      y = pointY - markerHalf + height / 2;
    } else if (this.settings.chart.chartLabelVerticalAlignment === "bottom") {
      y = pointY + markerHalf - height / 2;
    }

    return {
      x,
      y,
      anchor
    };
  }

  private tableBorderWidth(): number {
    return this.settings.table.showCellBorders ? this.settings.table.columnCardBorderWidth : 0;
  }

  private additionalRowBorderWidth(): number {
    return this.settings.table.showCellBorders ? this.settings.additionalRows.cellBorderWidth : 0;
  }

  private additionalRowBackgroundColor(): string {
    return this.settings.additionalRows.cellBackgroundShow ? this.settings.additionalRows.cellBackgroundColor : "transparent";
  }

  private totalBackgroundColor(): string {
    return this.settings.totalRow.backgroundShow ? this.settings.totalRow.cardBackgroundColor : "transparent";
  }

  private totalCardBorderColor(): string {
    return this.settings.totalRow.cardBorderColor;
  }

  private totalCardBorderWidth(): number {
    return this.settings.table.showCellBorders ? this.settings.totalRow.cardBorderWidth : 0;
  }

  private totalCardCornerRadius(): number {
    return this.settings.totalRow.cardCornerRadius;
  }

  private hasTotalColumn(): boolean {
    return this.settings.totalRow.showColumn || (this.settings.additionalRows.show && this.settings.additionalRows.showTotals && this.model.additionalRows.length > 0);
  }

  private categoryShapeWidth(): number {
    return shapeWidth(this.settings.categoryShape.shapeType, this.settings.categoryShape.size);
  }

  private additionalRowLabelFontFamily(row: AdditionalRowSeries): string {
    return row.formatting.labelFontFamily ?? this.settings.additionalRows.labelFontFamily;
  }

  private additionalRowLabelFontSize(row: AdditionalRowSeries): number {
    return row.formatting.labelFontSize ?? this.settings.additionalRows.labelFontSize;
  }

  private additionalRowLabelColor(row: AdditionalRowSeries): string {
    return row.formatting.labelFontColor ?? this.settings.additionalRows.labelFontColor;
  }

  private additionalRowLabelBold(row: AdditionalRowSeries): boolean {
    return row.formatting.labelBold ?? this.settings.additionalRows.labelBold;
  }

  private additionalRowLabelItalic(row: AdditionalRowSeries): boolean {
    return row.formatting.labelItalic ?? this.settings.additionalRows.labelItalic;
  }

  private additionalRowMarkerShape(row: AdditionalRowSeries): ShapeType {
    return row.formatting.markerShape ?? this.settings.additionalRows.markerShape;
  }

  private additionalRowMarkerSize(row: AdditionalRowSeries): number {
    return row.formatting.markerSize ?? this.settings.additionalRows.markerSize;
  }

  private additionalRowMarkerColor(row: AdditionalRowSeries): string {
    return row.formatting.markerColor ?? this.settings.additionalRows.markerColor;
  }

  private additionalRowValueFontFamily(row: AdditionalRowSeries): string {
    return row.formatting.valueFontFamily ?? this.settings.additionalRows.valueFontFamily;
  }

  private additionalRowValueFontSize(row: AdditionalRowSeries): number {
    return row.formatting.valueFontSize ?? this.settings.additionalRows.valueFontSize;
  }

  private additionalRowValueColor(row: AdditionalRowSeries): string {
    return row.formatting.valueFontColor ?? this.settings.additionalRows.valueFontColor;
  }

  private additionalRowValueBold(row: AdditionalRowSeries): boolean {
    return row.formatting.valueBold ?? this.settings.additionalRows.valueBold;
  }

  private additionalRowValueItalic(row: AdditionalRowSeries): boolean {
    return row.formatting.valueItalic ?? this.settings.additionalRows.valueItalic;
  }

  private additionalRowShapeWidth(row: AdditionalRowSeries): number {
    return shapeWidth(this.additionalRowMarkerShape(row), this.additionalRowMarkerSize(row));
  }

  private additionalRowTotal(row: AdditionalRowSeries): number | null {
    const values = row.values.map((point) => point.value).filter((value): value is number => value !== null);
    if (values.length === 0) {
      return null;
    }

    const sum = values.reduce((total, value) => total + value, 0);
    return sum;
  }

  private seriesTotal(series: TrendSeries): number {
    return series.values.reduce((sum, point) => sum + (point.value ?? 0), 0);
  }

  private linePath(points: Array<{ x: number; y: number }>): string {
    if (!this.settings.chart.lineSmoothing || points.length < 3) {
      return points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
    }

    const commands = [`M ${points[0].x} ${points[0].y}`];
    for (let index = 1; index < points.length; index += 1) {
      const previous = points[index - 1];
      const current = points[index];
      const midX = (previous.x + current.x) / 2;
      const midY = (previous.y + current.y) / 2;
      commands.push(`Q ${previous.x} ${previous.y} ${midX} ${midY}`);
    }
    const last = points[points.length - 1];
    commands.push(`T ${last.x} ${last.y}`);
    return commands.join(" ");
  }

  private svgShape(shape: ShapeType, x: number, y: number, size: number, fill: string, stroke: string, strokeWidth: number): SVGElement {
    const half = size / 2;

    if (shape === "square") {
      const rect = svgRect(x - half, y - half, size, size, 1);
      rect.setAttribute("fill", fill);
      rect.setAttribute("stroke", stroke);
      rect.setAttribute("stroke-width", String(strokeWidth));
      return rect;
    }

    if (shape === "rectangle") {
      const rect = svgRect(x - size * 0.65, y - half, size * 1.3, size, 1);
      rect.setAttribute("fill", fill);
      rect.setAttribute("stroke", stroke);
      rect.setAttribute("stroke-width", String(strokeWidth));
      return rect;
    }

    if (shape === "diamond") {
      const polygon = svgPolygon(`${x},${y - half} ${x + half},${y} ${x},${y + half} ${x - half},${y}`);
      polygon.setAttribute("fill", fill);
      polygon.setAttribute("stroke", stroke);
      polygon.setAttribute("stroke-width", String(strokeWidth));
      return polygon;
    }

    if (shape === "triangle") {
      const polygon = svgPolygon(`${x},${y - half} ${x + half},${y + half} ${x - half},${y + half}`);
      polygon.setAttribute("fill", fill);
      polygon.setAttribute("stroke", stroke);
      polygon.setAttribute("stroke-width", String(strokeWidth));
      return polygon;
    }

    if (shape === "pentagon" || shape === "hexagon") {
      const sides = shape === "pentagon" ? 5 : 6;
      const polygon = svgPolygon(regularPolygonPoints(x, y, half, sides, -90));
      polygon.setAttribute("fill", fill);
      polygon.setAttribute("stroke", stroke);
      polygon.setAttribute("stroke-width", String(strokeWidth));
      return polygon;
    }

    if (shape === "star") {
      const polygon = svgPolygon(starPolygonPoints(x, y, half, half * 0.45, 5, -90));
      polygon.setAttribute("fill", fill);
      polygon.setAttribute("stroke", stroke);
      polygon.setAttribute("stroke-width", String(strokeWidth));
      return polygon;
    }

    if (shape === "line") {
      const line = svgLine(x - half, y, x + half, y, "");
      line.setAttribute("stroke", fill);
      line.setAttribute("stroke-width", String(Math.max(2, strokeWidth)));
      line.setAttribute("stroke-linecap", "round");
      return line;
    }

    if (shape === "plus" || shape === "cross") {
      const group = document.createElementNS(SVG_NS, "g");
      const width = String(Math.max(2, size * 0.18, strokeWidth));
      const first = shape === "plus"
        ? svgLine(x - half, y, x + half, y, "")
        : svgLine(x - half * 0.72, y - half * 0.72, x + half * 0.72, y + half * 0.72, "");
      const second = shape === "plus"
        ? svgLine(x, y - half, x, y + half, "")
        : svgLine(x + half * 0.72, y - half * 0.72, x - half * 0.72, y + half * 0.72, "");
      [first, second].forEach((line) => {
        line.setAttribute("stroke", fill);
        line.setAttribute("stroke-width", width);
        line.setAttribute("stroke-linecap", "round");
        group.appendChild(line);
      });
      return group;
    }

    const circle = document.createElementNS(SVG_NS, "circle");
    circle.setAttribute("cx", String(x));
    circle.setAttribute("cy", String(y));
    circle.setAttribute("r", String(half));
    circle.setAttribute("fill", fill);
    circle.setAttribute("stroke", stroke);
    circle.setAttribute("stroke-width", String(strokeWidth));
    return circle;
  }

  private htmlShape(shape: ShapeType, color: string, size = this.settings.categoryShape.size, stroke = this.settings.categoryShape.borderColor, strokeWidth = this.settings.categoryShape.borderWidth): SVGSVGElement {
    const svg = document.createElementNS(SVG_NS, "svg");
    const width = shapeWidth(shape, size);
    svg.setAttribute("width", String(width));
    svg.setAttribute("height", String(size));
    svg.setAttribute("viewBox", `0 0 ${width} ${size}`);
    svg.setAttribute("aria-hidden", "true");
    svg.appendChild(this.svgShape(shape, width / 2, size / 2, size, color, stroke, strokeWidth));
    return svg;
  }

  private wireSelection(element: Element, selectionId?: any): void {
    if (!selectionId) {
      return;
    }

    element.classList.add("is-selectable");
    element.addEventListener("click", (event: Event) => {
      event.stopPropagation();
      this.select(selectionId, event as MouseEvent);
    });

    element.addEventListener("keydown", (event: Event) => {
      const keyboardEvent = event as KeyboardEvent;
      if (keyboardEvent.key === "Enter" || keyboardEvent.key === " ") {
        keyboardEvent.preventDefault();
        this.select(selectionId, keyboardEvent);
      }
    });
  }

  private select(selectionId: any, event: MouseEvent | KeyboardEvent): void {
    const multiSelect = Boolean(event.ctrlKey || event.metaKey);
    this.selectionManager.select(selectionId, multiSelect).then((selectedIds: any[]) => {
      this.selectedIds = selectedIds || [];
      if (this.lastOptions) {
        this.render(this.lastOptions);
      }
    });
  }

  private clearSelection(): void {
    this.selectionManager.clear().then(() => {
      this.selectedIds = [];
      if (this.lastOptions) {
        this.render(this.lastOptions);
      }
    });
  }

  private isDimmed(selectionId?: any): boolean {
    return this.selectedIds.length > 0 && !selectionContains(this.selectedIds, selectionId);
  }

  private renderMessage(message: string): void {
    this.clearRoot();
    this.root.style.minHeight = this.root.style.minHeight || "80px";
    this.root.style.width = this.root.style.width || "100%";
    this.root.style.height = this.root.style.height || "100%";
    this.root.style.background = "#ffffff";
    const wrapper = document.createElement("div");
    wrapper.className = "compact-trend-matrix__message";
    wrapper.textContent = message;
    wrapper.style.alignItems = "center";
    wrapper.style.color = "#323130";
    wrapper.style.display = "flex";
    wrapper.style.fontFamily = "\"Segoe UI\", sans-serif";
    wrapper.style.fontSize = "12px";
    wrapper.style.height = "100%";
    wrapper.style.justifyContent = "center";
    wrapper.style.padding = "12px";
    wrapper.style.textAlign = "center";
    wrapper.style.width = "100%";
    this.root.appendChild(wrapper);
  }

  private clearRoot(): void {
    while (this.root.firstChild) {
      this.root.removeChild(this.root.firstChild);
    }
  }

  private applyViewport(options: VisualUpdateOptions, width?: number, height?: number): void {
    const viewportWidth = Math.max(80, Math.floor(width ?? options.viewport?.width ?? this.root.clientWidth ?? 320));
    const viewportHeight = Math.max(60, Math.floor(height ?? options.viewport?.height ?? this.root.clientHeight ?? 240));
    this.root.style.width = `${viewportWidth}px`;
    this.root.style.height = `${viewportHeight}px`;
    this.root.style.minHeight = "60px";
    this.root.style.display = "block";
  }

  private notifyRenderingStarted(options: VisualUpdateOptions): void {
    try {
      this.host.eventService.renderingStarted(options);
    } catch {
      // Rendering events are advisory; they should never stop drawing.
    }
  }

  private notifyRenderingFinished(options: VisualUpdateOptions): void {
    try {
      this.host.eventService.renderingFinished(options);
    } catch {
      // Rendering events are advisory; they should never stop drawing.
    }
  }

  private notifyRenderingFailed(options: VisualUpdateOptions, message: string): void {
    try {
      this.host.eventService.renderingFailed(options, message);
    } catch {
      // Rendering events are advisory; they should never stop drawing.
    }
  }
}

function chartTypeOptions(): Array<{ label: string; value: ChartType }> {
  return [
    { label: "Line", value: "line" },
    { label: "Bar", value: "stackedBar" },
    { label: "Lollipop", value: "lollipop" },
    { label: "Clustered bar", value: "clusteredBar" }
  ];
}

function svgText(x: number, y: number, text: string, className: string): SVGTextElement {
  const element = document.createElementNS(SVG_NS, "text");
  if (className) {
    element.classList.add(className);
  }
  element.setAttribute("x", String(x));
  element.setAttribute("y", String(y));
  element.textContent = text;
  return element;
}

function svgLine(x1: number, y1: number, x2: number, y2: number, className: string): SVGLineElement {
  const element = document.createElementNS(SVG_NS, "line");
  if (className) {
    element.classList.add(className);
  }
  element.setAttribute("x1", String(x1));
  element.setAttribute("y1", String(y1));
  element.setAttribute("x2", String(x2));
  element.setAttribute("y2", String(y2));
  return element;
}

function svgRect(x: number, y: number, width: number, height: number, radius: number): SVGRectElement {
  const element = document.createElementNS(SVG_NS, "rect");
  element.setAttribute("x", String(x));
  element.setAttribute("y", String(y));
  element.setAttribute("width", String(Math.max(0, width)));
  element.setAttribute("height", String(Math.max(0, height)));
  element.setAttribute("rx", String(radius));
  element.setAttribute("ry", String(radius));
  return element;
}

function svgPolygon(points: string): SVGPolygonElement {
  const element = document.createElementNS(SVG_NS, "polygon");
  element.setAttribute("points", points);
  return element;
}

function regularPolygonPoints(centerX: number, centerY: number, radius: number, sides: number, startAngle: number): string {
  return Array.from({ length: sides }, (_value, index) => {
    const angle = ((startAngle + index * (360 / sides)) * Math.PI) / 180;
    return `${centerX + Math.cos(angle) * radius},${centerY + Math.sin(angle) * radius}`;
  }).join(" ");
}

function starPolygonPoints(centerX: number, centerY: number, outerRadius: number, innerRadius: number, points: number, startAngle: number): string {
  return Array.from({ length: points * 2 }, (_value, index) => {
    const radius = index % 2 === 0 ? outerRadius : innerRadius;
    const angle = ((startAngle + index * (180 / points)) * Math.PI) / 180;
    return `${centerX + Math.cos(angle) * radius},${centerY + Math.sin(angle) * radius}`;
  }).join(" ");
}

function shapeWidth(shape: ShapeType, size: number): number {
  return shape === "rectangle" || shape === "line" ? size * 1.3 : size;
}

function lineDash(style: string): string {
  if (style === "dashed") {
    return "6 4";
  }

  if (style === "dotted") {
    return "2 4";
  }

  return "";
}

function formatAxisValue(value: number): string {
  const absolute = Math.abs(value);
  if (absolute >= 1000000000) {
    return `${(value / 1000000000).toFixed(1)}B`;
  }

  if (absolute >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }

  if (absolute >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }

  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function cssAlignment(alignment: string): string {
  if (alignment === "center") {
    return "center";
  }

  if (alignment === "right") {
    return "flex-end";
  }

  return "flex-start";
}

function estimateTextWidth(text: string, fontSize: number): number {
  return Math.max(10, text.length * fontSize * 0.58);
}

function labelBox(x: number, y: number, width: number, height: number, anchor: string): LabelBox {
  let left = x;
  if (anchor === "middle") {
    left = x - width / 2;
  } else if (anchor === "end") {
    left = x - width;
  }

  return {
    x: left,
    y: y - height / 2,
    width,
    height
  };
}

function labelBoxCollides(candidate: LabelBox, existing: LabelBox[], layout: VisualLayout): boolean {
  const margin = 4;
  if (candidate.x < layout.plotLeft - 4 || candidate.x + candidate.width > layout.contentWidth - 4 || candidate.y < 0 || candidate.y + candidate.height > layout.chartHeight) {
    return true;
  }

  return existing.some((box) => {
    return !(
      candidate.x + candidate.width + margin < box.x ||
      candidate.x > box.x + box.width + margin ||
      candidate.y + candidate.height + margin < box.y ||
      candidate.y > box.y + box.height + margin
    );
  });
}
