import type powerbi from "powerbi-visuals-api";
import { dataViewWildcard } from "powerbi-visuals-utils-dataviewutils";

type DataView = powerbi.DataView;
type DataViewObjects = powerbi.DataViewObjects;

export type ChartType = "line" | "clusteredBar" | "stackedBar" | "lollipop" | "none";
export type LineStyle = "solid" | "dashed" | "dotted";
export type ShapeType = "circle" | "square" | "rectangle" | "diamond" | "triangle" | "line" | "plus" | "cross" | "star" | "pentagon" | "hexagon" | "none";
export type Alignment = "left" | "center" | "right";
export type VerticalAlignment = "top" | "middle" | "bottom";
export type ChartLabelPosition = "auto" | "insideMarker" | "above" | "below" | "left" | "right";
export type ColumnWidthMode = "auto" | "fixed" | "fit";
export type SortOrder = "source" | "ascending" | "descending";
export type DisplayUnits = "auto" | "none" | "thousands" | "millions" | "billions";
export type NegativeValueStyle = "minus" | "parentheses";
export type ConditionalApplyTo = "tableFont" | "tableBackground" | "chart" | "shape" | "total" | "both";
export type ConditionalFormatMode = "rules" | "gradient";
export type ConditionalOperator = ">=" | ">" | "<=" | "<" | "=";
export type TopFilterControlStyle = "auto" | "dropdown" | "checkbox" | "bullet" | "timeline";

export interface ChartSettings {
  show: boolean;
  chartType: ChartType;
  chartHeight: number;
  yAxisStart: number;
  yAxisEnd: number;
  autoScaleYAxis: boolean;
  showXAxisLabels: boolean;
  xAxisLabelFontFamily: string;
  xAxisLabelColor: string;
  xAxisLabelFontSize: number;
  showYAxis: boolean;
  yAxisLabelFontFamily: string;
  yAxisLabelColor: string;
  yAxisLabelFontSize: number;
  showGridlines: boolean;
  gridlineColor: string;
  gridlineStyle: LineStyle;
  gridlineWidth: number;
  lineWidth: number;
  lineStyle: LineStyle;
  lineSmoothing: boolean;
  showMarkers: boolean;
  markerSize: number;
  markerShape: ShapeType;
  barPadding: number;
  barInnerPadding: number;
  barCornerRadius: number;
  showChartDataLabels: boolean;
  chartLabelFontSize: number;
  chartLabelColor: string;
  chartLabelPosition: ChartLabelPosition;
  chartLabelHorizontalAlignment: Alignment;
  chartLabelVerticalAlignment: VerticalAlignment;
  chartLabelBackgroundShow: boolean;
  chartLabelBackgroundColor: string;
  chartLabelBackgroundTransparency: number;
  chartPaddingTop: number;
  chartPaddingRight: number;
  chartPaddingBottom: number;
  chartPaddingLeft: number;
  labelOffsetX: number;
  labelOffsetY: number;
  avoidLabelCollisions: boolean;
}

export interface TableSettings {
  show: boolean;
  backgroundColor: string;
  columnCardBackgroundColor: string;
  columnCardBorderColor: string;
  columnCardBorderWidth: number;
  showCellBorders: boolean;
  columnCardCornerRadius: number;
  columnGap: number;
  rowGap: number;
  cellPadding: number;
  tablePaddingTop: number;
  tablePaddingRight: number;
  tablePaddingBottom: number;
  tablePaddingLeft: number;
  rowLabelWidth: number;
  columnWidthMode: ColumnWidthMode;
  fixedColumnWidth: number;
  showRowLabels: boolean;
  showColumnLabels: boolean;
  showCategoryShapes: boolean;
  showDividers: boolean;
  dividerColor: string;
  dividerWidth: number;
}

export interface TextStyleSettings {
  fontFamily: string;
  fontSize: number;
  fontColor: string;
  bold: boolean;
  italic: boolean;
}

export interface ValuesSettings extends TextStyleSettings {
  underline: boolean;
  horizontalAlignment: Alignment;
  displayUnits: DisplayUnits;
  decimalPlaces: number;
  thousandSeparator: boolean;
  blankValueText: string;
  negativeValueStyle: NegativeValueStyle;
}

export interface RowLabelSettings extends TextStyleSettings {
  alignment: Alignment;
  textWrap: boolean;
  maxLabelWidth: number;
}

export interface ColumnLabelSettings extends TextStyleSettings {
  alignment: Alignment;
  categoryLabelFormat: string;
  sortOrder: SortOrder;
}

export interface TotalRowSettings {
  show: boolean;
  showColumn: boolean;
  labelText: string;
  columnLabelText: string;
  columnWidth: number;
  calculation: "sum";
  fontSize: number;
  fontColor: string;
  bold: boolean;
  backgroundShow: boolean;
  backgroundColor: string;
  cardBackgroundColor: string;
  cardBorderColor: string;
  cardBorderWidth: number;
  cardCornerRadius: number;
  showDivider: boolean;
  dividerColor: string;
  dividerSpacing: number;
  includeHiddenBlankCategories: boolean;
}

export interface AdditionalRowsSettings {
  show: boolean;
  showTotals: boolean;
  labelFontFamily: string;
  labelFontSize: number;
  labelFontColor: string;
  labelBold: boolean;
  labelItalic: boolean;
  labelAlignment: Alignment;
  labelPaddingLeft: number;
  labelPaddingRight: number;
  markerShow: boolean;
  markerShape: ShapeType;
  markerSize: number;
  markerColor: string;
  markerBorderColor: string;
  markerBorderWidth: number;
  markerOpacity: number;
  markerPosition: "before" | "after";
  markerLayout: "inline" | "edge";
  markerTextGap: number;
  valueFontFamily: string;
  valueFontSize: number;
  valueFontColor: string;
  valueBold: boolean;
  valueItalic: boolean;
  cellBackgroundShow: boolean;
  cellBackgroundColor: string;
  cellBorderColor: string;
  cellBorderWidth: number;
}

export interface TopFilterStyleSettings {
  fontFamily: string;
  fontSize: number;
  labelColor: string;
  valueColor: string;
  controlBackgroundColor: string;
  checkboxBackgroundColor: string;
  checkboxTickColor: string;
  borderColor: string;
  borderWidth: number;
  cornerRadius: number;
  itemGap: number;
}

export interface TopFilterSettings {
  show: boolean;
  showFilterOne: boolean;
  showFilterTwo: boolean;
  filterOneLabel: string;
  filterTwoLabel: string;
  controlStyle: TopFilterControlStyle;
  filterOneControlStyle: TopFilterControlStyle;
  filterTwoControlStyle: TopFilterControlStyle;
  filterOneStyle: TopFilterStyleSettings;
  filterTwoStyle: TopFilterStyleSettings;
  alignment: Alignment;
  fontFamily: string;
  fontSize: number;
  labelColor: string;
  valueColor: string;
  checkboxBackgroundColor: string;
  checkboxTickColor: string;
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  cornerRadius: number;
  paddingTop: number;
  paddingRight: number;
  paddingBottom: number;
  paddingLeft: number;
  itemGap: number;
}

export interface DataColorSettings {
  defaultPalette: "powerbi" | "accessible" | "vivid";
  resetColors: boolean;
  useConditionalFormattingColors: boolean;
  applyCategoryColorsToChart: boolean;
  applyCategoryColorsToShapes: boolean;
}

export interface CategoryShapeSettings {
  show: boolean;
  shapeType: ShapeType;
  size: number;
  fillColor: string;
  borderColor: string;
  borderWidth: number;
  opacity: number;
  position: "before" | "after";
  layout: "inline" | "edge";
}

export interface ConditionalRuleSettings {
  threshold: number;
  operator: ConditionalOperator;
  color: string;
  bold: boolean;
  fontSize: number;
}

export interface ConditionalFormattingSettings {
  enabled: boolean;
  applyTo: ConditionalApplyTo;
  formatMode: ConditionalFormatMode;
  rules: ConditionalRuleSettings[];
  gradientLowColor: string;
  gradientHighColor: string;
  applyToTotalRow: boolean;
  applyToBlanks: boolean;
}

export interface ReferenceLineSettings {
  show: boolean;
  lineColor: string;
  lineWidth: number;
  lineStyle: LineStyle;
  showMarkers: boolean;
  markerShape: ShapeType;
  markerSize: number;
  markerColor: string;
  markerBorderColor: string;
  markerBorderWidth: number;
  showDataLabels: boolean;
  showLabel: boolean;
  labelText: string;
  labelColor: string;
  labelFontSize: number;
  labelBackgroundShow: boolean;
  labelBackgroundColor: string;
  labelBackgroundTransparency: number;
}

export interface ChartSelectorSettings {
  show: boolean;
  labelText: string;
  fontFamily: string;
  fontSize: number;
  labelColor: string;
  valueColor: string;
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  cornerRadius: number;
}

export interface VisualSettings {
  chart: ChartSettings;
  chartSelector: ChartSelectorSettings;
  table: TableSettings;
  values: ValuesSettings;
  rowLabels: RowLabelSettings;
  columnLabels: ColumnLabelSettings;
  totalRow: TotalRowSettings;
  additionalRows: AdditionalRowsSettings;
  topFilters: TopFilterSettings;
  dataColors: DataColorSettings;
  categoryShape: CategoryShapeSettings;
  conditionalFormatting: ConditionalFormattingSettings;
  referenceLine: ReferenceLineSettings;
}

export const DEFAULT_SETTINGS: VisualSettings = {
  chart: {
    show: true,
    chartType: "line",
    chartHeight: 150,
    yAxisStart: 0,
    yAxisEnd: 0,
    autoScaleYAxis: true,
    showXAxisLabels: true,
    xAxisLabelFontFamily: "Segoe UI",
    xAxisLabelColor: "#605e5c",
    xAxisLabelFontSize: 10,
    showYAxis: true,
    yAxisLabelFontFamily: "Segoe UI",
    yAxisLabelColor: "#605e5c",
    yAxisLabelFontSize: 10,
    showGridlines: true,
    gridlineColor: "#e8ebef",
    gridlineStyle: "solid",
    gridlineWidth: 1,
    lineWidth: 2,
    lineStyle: "solid",
    lineSmoothing: false,
    showMarkers: true,
    markerSize: 7,
    markerShape: "circle",
    barPadding: 0.18,
    barInnerPadding: 0.12,
    barCornerRadius: 2,
    showChartDataLabels: false,
    chartLabelFontSize: 10,
    chartLabelColor: "#323130",
    chartLabelPosition: "auto",
    chartLabelHorizontalAlignment: "center",
    chartLabelVerticalAlignment: "middle",
    chartLabelBackgroundShow: false,
    chartLabelBackgroundColor: "#ffffff",
    chartLabelBackgroundTransparency: 0,
    chartPaddingTop: 16,
    chartPaddingRight: 18,
    chartPaddingBottom: 4,
    chartPaddingLeft: 0,
    labelOffsetX: 8,
    labelOffsetY: 8,
    avoidLabelCollisions: true
  },
  chartSelector: {
    show: false,
    labelText: "Chart type",
    fontFamily: "Segoe UI",
    fontSize: 12,
    labelColor: "#323130",
    valueColor: "#201f1e",
    backgroundColor: "#ffffff",
    borderColor: "#c8ccd1",
    borderWidth: 1,
    cornerRadius: 6
  },
  table: {
    show: true,
    backgroundColor: "#ffffff",
    columnCardBackgroundColor: "#fbfcfe",
    columnCardBorderColor: "#c8ccd1",
    columnCardBorderWidth: 1,
    showCellBorders: true,
    columnCardCornerRadius: 3,
    columnGap: 3,
    rowGap: 4,
    cellPadding: 5,
    tablePaddingTop: 0,
    tablePaddingRight: 0,
    tablePaddingBottom: 0,
    tablePaddingLeft: 0,
    rowLabelWidth: 118,
    columnWidthMode: "fit",
    fixedColumnWidth: 76,
    showRowLabels: true,
    showColumnLabels: true,
    showCategoryShapes: true,
    showDividers: false,
    dividerColor: "#e1e4e8",
    dividerWidth: 1
  },
  values: {
    fontFamily: "Segoe UI",
    fontSize: 12,
    fontColor: "#201f1e",
    bold: false,
    italic: false,
    underline: false,
    horizontalAlignment: "center",
    displayUnits: "auto",
    decimalPlaces: 0,
    thousandSeparator: true,
    blankValueText: "-",
    negativeValueStyle: "minus"
  },
  rowLabels: {
    fontFamily: "Segoe UI",
    fontSize: 12,
    fontColor: "#201f1e",
    bold: false,
    italic: false,
    alignment: "left",
    textWrap: false,
    maxLabelWidth: 160
  },
  columnLabels: {
    fontFamily: "Segoe UI",
    fontSize: 11,
    fontColor: "#605e5c",
    bold: true,
    italic: false,
    alignment: "center",
    categoryLabelFormat: "",
    sortOrder: "source"
  },
  totalRow: {
    show: true,
    showColumn: false,
    labelText: "Total",
    columnLabelText: "Total",
    columnWidth: 78,
    calculation: "sum",
    fontSize: 12,
    fontColor: "#201f1e",
    bold: true,
    backgroundShow: true,
    backgroundColor: "#eef2f7",
    cardBackgroundColor: "#eef2f7",
    cardBorderColor: "#c8ccd1",
    cardBorderWidth: 1,
    cardCornerRadius: 3,
    showDivider: true,
    dividerSpacing: 4,
    dividerColor: "#8a929c",
    includeHiddenBlankCategories: false
  },
  additionalRows: {
    show: true,
    showTotals: true,
    labelFontFamily: 'Segoe UI',
    labelFontSize: 12,
    labelFontColor: "#201f1e",
    labelBold: true,
    labelItalic: false,
    labelAlignment: "left",
    labelPaddingLeft: 0,
    labelPaddingRight: 8,
    markerShow: true,
    markerShape: "square",
    markerSize: 11,
    markerColor: "#605e5c",
    markerBorderColor: "#ffffff",
    markerBorderWidth: 1,
    markerOpacity: 1,
    markerPosition: "before",
    markerLayout: "inline",
    markerTextGap: 6,
    valueFontFamily: 'Segoe UI',
    valueFontSize: 12,
    valueFontColor: "#201f1e",
    valueBold: false,
    valueItalic: false,
    cellBackgroundShow: true,
    cellBackgroundColor: "#ffffff",
    cellBorderColor: "#c8ccd1",
    cellBorderWidth: 1
  },
  topFilters: {
    show: true,
    showFilterOne: true,
    showFilterTwo: true,
    filterOneStyle: {
      fontFamily: 'Segoe UI',
      fontSize: 12,
      labelColor: '#323130',
      valueColor: '#201f1e',
      controlBackgroundColor: '#ffffff',
      checkboxBackgroundColor: '#ffffff',
      checkboxTickColor: '#605e5c',
      borderColor: '#c8ccd1',
      borderWidth: 1,
      cornerRadius: 6,
      itemGap: 8
    },
    filterTwoStyle: {
      fontFamily: 'Segoe UI',
      fontSize: 12,
      labelColor: '#323130',
      valueColor: '#201f1e',
      controlBackgroundColor: '#ffffff',
      checkboxBackgroundColor: '#ffffff',
      checkboxTickColor: '#605e5c',
      borderColor: '#c8ccd1',
      borderWidth: 1,
      cornerRadius: 6,
      itemGap: 8
    },
    filterOneLabel: "",
    filterTwoLabel: "",
    controlStyle: "auto",
    filterOneControlStyle: "auto",
    filterTwoControlStyle: "auto",
    alignment: "left",
    fontFamily: "Segoe UI",
    fontSize: 12,
    labelColor: "#323130",
    valueColor: "#201f1e",
    checkboxBackgroundColor: "#ffffff",
    checkboxTickColor: "#605e5c",
    backgroundColor: "#ffffff",
    borderColor: "#c8ccd1",
    borderWidth: 1,
    cornerRadius: 6,
    paddingTop: 2,
    paddingRight: 4,
    paddingBottom: 8,
    paddingLeft: 4,
    itemGap: 8
  },
  dataColors: {
    defaultPalette: "powerbi",
    resetColors: false,
    useConditionalFormattingColors: true,
    applyCategoryColorsToChart: true,
    applyCategoryColorsToShapes: true
  },
  categoryShape: {
    show: true,
    shapeType: "rectangle",
    size: 11,
    fillColor: "#118dff",
    borderColor: "#ffffff",
    borderWidth: 1,
    opacity: 1,
    position: "after",
    layout: "edge"
  },
  conditionalFormatting: {
    enabled: false,
    applyTo: "both",
    formatMode: "rules",
    rules: [
      { threshold: 0, operator: ">=", color: "#107c10", bold: false, fontSize: 12 },
      { threshold: 0, operator: "<", color: "#d13438", bold: true, fontSize: 12 },
      { threshold: 0, operator: "=", color: "#605e5c", bold: false, fontSize: 12 }
    ],
    gradientLowColor: "#d13438",
    gradientHighColor: "#107c10",
    applyToTotalRow: true,
    applyToBlanks: false
  },
  referenceLine: {
    show: true,
    lineColor: "#605e5c",
    lineWidth: 2,
    lineStyle: "dotted",
    showMarkers: true,
    markerShape: "circle",
    markerSize: 7,
    markerColor: "#605e5c",
    markerBorderColor: "#ffffff",
    markerBorderWidth: 1,
    showDataLabels: false,
    showLabel: true,
    labelText: "Add Target Line",
    labelColor: "#323130",
    labelFontSize: 10,
    labelBackgroundShow: false,
    labelBackgroundColor: "#ffffff",
    labelBackgroundTransparency: 0
  }
};

const TOGGLE = "ToggleSwitch";
const NUMERIC = "NumUpDown";
const COLOR = "ColorPicker";
const DROPDOWN = "Dropdown";
const TEXT = "TextInput";
const COLOR_INSTANCE_KIND = 3;
const FONT_FAMILY_ITEMS = [
  item("Segoe UI", "Segoe UI"),
  item("Arial", "Arial"),
  item("Calibri", "Calibri"),
  item("Cambria", "Cambria"),
  item("Candara", "Candara"),
  item("Consolas", "Consolas"),
  item("Courier New", "Courier New"),
  item("Georgia", "Georgia"),
  item("Tahoma", "Tahoma"),
  item("Times New Roman", "Times New Roman"),
  item("Trebuchet MS", "Trebuchet MS"),
  item("Verdana", "Verdana")
];
const CATEGORY_COLOR_INSTANCE_KIND = 3;

type SeriesColorContext = Array<{ category: string; color: string; selectionId?: any }>;
export type AdditionalRowFormatContext = Array<{
  label: string;
  queryName: string;
  formatting: AdditionalRowMeasureFormatSettings;
}>;

export interface AdditionalRowMeasureFormatSettings {
  labelFontFamily?: string;
  labelFontSize?: number;
  labelFontColor?: string;
  labelBold?: boolean;
  labelItalic?: boolean;
  markerShape?: ShapeType;
  markerSize?: number;
  markerColor?: string;
  valueFontFamily?: string;
  valueFontSize?: number;
  valueFontColor?: string;
  valueBold?: boolean;
  valueItalic?: boolean;
}

export function parseVisualSettings(dataView?: DataView): VisualSettings {
  const objects = dataView?.metadata?.objects;
  return {
    chart: {
      show: getObjectValue(objects, "chart", "show", DEFAULT_SETTINGS.chart.show),
      chartType: getObjectValue(objects, "chart", "chartType", DEFAULT_SETTINGS.chart.chartType),
      chartHeight: clamp(getObjectValue(objects, "chart", "chartHeight", DEFAULT_SETTINGS.chart.chartHeight), 40, 700),
      yAxisStart: getObjectValue(objects, "chart", "yAxisStart", DEFAULT_SETTINGS.chart.yAxisStart),
      yAxisEnd: getObjectValue(objects, "chart", "yAxisEnd", DEFAULT_SETTINGS.chart.yAxisEnd),
      autoScaleYAxis: getObjectValue(objects, "chart", "autoScaleYAxis", DEFAULT_SETTINGS.chart.autoScaleYAxis),
      showXAxisLabels: getObjectValue(objects, "chart", "showXAxisLabels", DEFAULT_SETTINGS.chart.showXAxisLabels),
      xAxisLabelFontFamily: getObjectValue(objects, "chart", "xAxisLabelFontFamily", DEFAULT_SETTINGS.chart.xAxisLabelFontFamily),
      xAxisLabelColor: getFillColor(objects, "chart", "xAxisLabelColor", DEFAULT_SETTINGS.chart.xAxisLabelColor),
      xAxisLabelFontSize: clamp(getObjectValue(objects, "chart", "xAxisLabelFontSize", DEFAULT_SETTINGS.chart.xAxisLabelFontSize), 7, 36),
      showYAxis: getObjectValue(objects, "chart", "showYAxis", DEFAULT_SETTINGS.chart.showYAxis),
      yAxisLabelFontFamily: getObjectValue(objects, "chart", "yAxisLabelFontFamily", DEFAULT_SETTINGS.chart.yAxisLabelFontFamily),
      yAxisLabelColor: getFillColor(objects, "chart", "yAxisLabelColor", DEFAULT_SETTINGS.chart.yAxisLabelColor),
      yAxisLabelFontSize: clamp(getObjectValue(objects, "chart", "yAxisLabelFontSize", DEFAULT_SETTINGS.chart.yAxisLabelFontSize), 7, 36),
      showGridlines: getObjectValue(objects, "chart", "showGridlines", DEFAULT_SETTINGS.chart.showGridlines),
      gridlineColor: getFillColor(objects, "chart", "gridlineColor", DEFAULT_SETTINGS.chart.gridlineColor),
      gridlineStyle: getObjectValue(objects, "chart", "gridlineStyle", DEFAULT_SETTINGS.chart.gridlineStyle),
      gridlineWidth: clamp(getObjectValue(objects, "chart", "gridlineWidth", DEFAULT_SETTINGS.chart.gridlineWidth), 0, 8),
      lineWidth: clamp(getObjectValue(objects, "chart", "lineWidth", DEFAULT_SETTINGS.chart.lineWidth), 1, 12),
      lineStyle: getObjectValue(objects, "chart", "lineStyle", DEFAULT_SETTINGS.chart.lineStyle),
      lineSmoothing: getObjectValue(objects, "chart", "lineSmoothing", DEFAULT_SETTINGS.chart.lineSmoothing),
      showMarkers: getObjectValue(objects, "chart", "showMarkers", DEFAULT_SETTINGS.chart.showMarkers),
      markerSize: clamp(getObjectValue(objects, "chart", "markerSize", DEFAULT_SETTINGS.chart.markerSize), 2, 28),
      markerShape: normalizeShape(getObjectValue(objects, "chart", "markerShape", DEFAULT_SETTINGS.chart.markerShape), DEFAULT_SETTINGS.chart.markerShape),
      barPadding: clamp(getObjectValue(objects, "chart", "barPadding", DEFAULT_SETTINGS.chart.barPadding), 0, 0.9),
      barInnerPadding: clamp(getObjectValue(objects, "chart", "barInnerPadding", DEFAULT_SETTINGS.chart.barInnerPadding), 0, 0.9),
      barCornerRadius: clamp(getObjectValue(objects, "chart", "barCornerRadius", DEFAULT_SETTINGS.chart.barCornerRadius), 0, 12),
      showChartDataLabels: getObjectValue(objects, "chart", "showChartDataLabels", DEFAULT_SETTINGS.chart.showChartDataLabels),
      chartLabelFontSize: clamp(getObjectValue(objects, "chart", "chartLabelFontSize", DEFAULT_SETTINGS.chart.chartLabelFontSize), 7, 36),
      chartLabelColor: getFillColor(objects, "chart", "chartLabelColor", DEFAULT_SETTINGS.chart.chartLabelColor),
      chartLabelPosition: getObjectValue(objects, "chart", "chartLabelPosition", DEFAULT_SETTINGS.chart.chartLabelPosition),
      chartLabelHorizontalAlignment: getObjectValue(objects, "chart", "chartLabelHorizontalAlignment", DEFAULT_SETTINGS.chart.chartLabelHorizontalAlignment),
      chartLabelVerticalAlignment: getObjectValue(objects, "chart", "chartLabelVerticalAlignment", DEFAULT_SETTINGS.chart.chartLabelVerticalAlignment),
      chartLabelBackgroundShow: getObjectValue(objects, "chart", "chartLabelBackgroundShow", DEFAULT_SETTINGS.chart.chartLabelBackgroundShow),
      chartLabelBackgroundColor: getFillColor(objects, "chart", "chartLabelBackgroundColor", DEFAULT_SETTINGS.chart.chartLabelBackgroundColor),
      chartLabelBackgroundTransparency: clamp(getObjectValue(objects, "chart", "chartLabelBackgroundTransparency", DEFAULT_SETTINGS.chart.chartLabelBackgroundTransparency), 0, 100),
      chartPaddingTop: clamp(getObjectValue(objects, "chart", "chartPaddingTop", DEFAULT_SETTINGS.chart.chartPaddingTop), 0, 80),
      chartPaddingRight: clamp(getObjectValue(objects, "chart", "chartPaddingRight", DEFAULT_SETTINGS.chart.chartPaddingRight), 0, 120),
      chartPaddingBottom: clamp(getObjectValue(objects, "chart", "chartPaddingBottom", DEFAULT_SETTINGS.chart.chartPaddingBottom), 0, 80),
      chartPaddingLeft: clamp(getObjectValue(objects, "chart", "chartPaddingLeft", DEFAULT_SETTINGS.chart.chartPaddingLeft), 0, 120),
      labelOffsetX: clamp(getObjectValue(objects, "chart", "labelOffsetX", DEFAULT_SETTINGS.chart.labelOffsetX), -80, 80),
      labelOffsetY: clamp(getObjectValue(objects, "chart", "labelOffsetY", DEFAULT_SETTINGS.chart.labelOffsetY), -80, 80),
      avoidLabelCollisions: getObjectValue(objects, "chart", "avoidLabelCollisions", DEFAULT_SETTINGS.chart.avoidLabelCollisions)
    },
    chartSelector: {
      show: getObjectValue(objects, "chartSelector", "show", DEFAULT_SETTINGS.chartSelector.show),
      labelText: getObjectValue(objects, "chartSelector", "labelText", DEFAULT_SETTINGS.chartSelector.labelText),
      fontFamily: getObjectValue(objects, "chartSelector", "fontFamily", DEFAULT_SETTINGS.chartSelector.fontFamily),
      fontSize: clamp(getObjectValue(objects, "chartSelector", "fontSize", DEFAULT_SETTINGS.chartSelector.fontSize), 8, 24),
      labelColor: getFillColor(objects, "chartSelector", "labelColor", DEFAULT_SETTINGS.chartSelector.labelColor),
      valueColor: getFillColor(objects, "chartSelector", "valueColor", DEFAULT_SETTINGS.chartSelector.valueColor),
      backgroundColor: getFillColor(objects, "chartSelector", "backgroundColor", DEFAULT_SETTINGS.chartSelector.backgroundColor),
      borderColor: getFillColor(objects, "chartSelector", "borderColor", DEFAULT_SETTINGS.chartSelector.borderColor),
      borderWidth: clamp(getObjectValue(objects, "chartSelector", "borderWidth", DEFAULT_SETTINGS.chartSelector.borderWidth), 0, 8),
      cornerRadius: clamp(getObjectValue(objects, "chartSelector", "cornerRadius", DEFAULT_SETTINGS.chartSelector.cornerRadius), 0, 16)
    },
    table: {
      show: getObjectValue(objects, "table", "show", DEFAULT_SETTINGS.table.show),
      backgroundColor: getFillColor(objects, "table", "backgroundColor", DEFAULT_SETTINGS.table.backgroundColor),
      columnCardBackgroundColor: getFillColor(objects, "table", "columnCardBackgroundColor", DEFAULT_SETTINGS.table.columnCardBackgroundColor),
      columnCardBorderColor: getFillColor(objects, "table", "columnCardBorderColor", DEFAULT_SETTINGS.table.columnCardBorderColor),
      columnCardBorderWidth: clamp(getObjectValue(objects, "table", "columnCardBorderWidth", DEFAULT_SETTINGS.table.columnCardBorderWidth), 0, 8),
      showCellBorders: getObjectValue(objects, "table", "showCellBorders", DEFAULT_SETTINGS.table.showCellBorders),
      columnCardCornerRadius: clamp(getObjectValue(objects, "table", "columnCardCornerRadius", DEFAULT_SETTINGS.table.columnCardCornerRadius), 0, 8),
      columnGap: clamp(getObjectValue(objects, "table", "columnGap", DEFAULT_SETTINGS.table.columnGap), 0, 24),
      rowGap: clamp(getObjectValue(objects, "table", "rowGap", DEFAULT_SETTINGS.table.rowGap), 0, 24),
      cellPadding: clamp(getObjectValue(objects, "table", "cellPadding", DEFAULT_SETTINGS.table.cellPadding), 0, 24),
      tablePaddingTop: clamp(getObjectValue(objects, "table", "tablePaddingTop", DEFAULT_SETTINGS.table.tablePaddingTop), 0, 80),
      tablePaddingRight: clamp(getObjectValue(objects, "table", "tablePaddingRight", DEFAULT_SETTINGS.table.tablePaddingRight), 0, 80),
      tablePaddingBottom: clamp(getObjectValue(objects, "table", "tablePaddingBottom", DEFAULT_SETTINGS.table.tablePaddingBottom), 0, 80),
      tablePaddingLeft: clamp(getObjectValue(objects, "table", "tablePaddingLeft", DEFAULT_SETTINGS.table.tablePaddingLeft), 0, 80),
      rowLabelWidth: clamp(getObjectValue(objects, "table", "rowLabelWidth", DEFAULT_SETTINGS.table.rowLabelWidth), 64, 320),
      columnWidthMode: getObjectValue(objects, "table", "columnWidthMode", DEFAULT_SETTINGS.table.columnWidthMode),
      fixedColumnWidth: clamp(getObjectValue(objects, "table", "fixedColumnWidth", DEFAULT_SETTINGS.table.fixedColumnWidth), 36, 240),
      showRowLabels: getObjectValue(objects, "table", "showRowLabels", DEFAULT_SETTINGS.table.showRowLabels),
      showColumnLabels: getObjectValue(objects, "table", "showColumnLabels", DEFAULT_SETTINGS.table.showColumnLabels),
      showCategoryShapes: getObjectValue(objects, "table", "showCategoryShapes", DEFAULT_SETTINGS.table.showCategoryShapes),
      showDividers: getObjectValue(objects, "table", "showDividers", DEFAULT_SETTINGS.table.showDividers),
      dividerColor: getFillColor(objects, "table", "dividerColor", DEFAULT_SETTINGS.table.dividerColor),
      dividerWidth: clamp(getObjectValue(objects, "table", "dividerWidth", DEFAULT_SETTINGS.table.dividerWidth), 0, 8)
    },
    values: {
      fontFamily: getObjectValue(objects, "values", "fontFamily", DEFAULT_SETTINGS.values.fontFamily),
      fontSize: clamp(getObjectValue(objects, "values", "fontSize", DEFAULT_SETTINGS.values.fontSize), 7, 48),
      fontColor: getFillColor(objects, "values", "fontColor", DEFAULT_SETTINGS.values.fontColor),
      bold: getObjectValue(objects, "values", "bold", DEFAULT_SETTINGS.values.bold),
      italic: getObjectValue(objects, "values", "italic", DEFAULT_SETTINGS.values.italic),
      underline: getObjectValue(objects, "values", "underline", DEFAULT_SETTINGS.values.underline),
      horizontalAlignment: getObjectValue(objects, "values", "horizontalAlignment", DEFAULT_SETTINGS.values.horizontalAlignment),
      displayUnits: getObjectValue(objects, "values", "displayUnits", DEFAULT_SETTINGS.values.displayUnits),
      decimalPlaces: clamp(getObjectValue(objects, "values", "decimalPlaces", DEFAULT_SETTINGS.values.decimalPlaces), 0, 6),
      thousandSeparator: getObjectValue(objects, "values", "thousandSeparator", DEFAULT_SETTINGS.values.thousandSeparator),
      blankValueText: getObjectValue(objects, "values", "blankValueText", DEFAULT_SETTINGS.values.blankValueText),
      negativeValueStyle: getObjectValue(objects, "values", "negativeValueStyle", DEFAULT_SETTINGS.values.negativeValueStyle)
    },
    rowLabels: {
      fontFamily: getObjectValue(objects, "table", "rowHeaderFontFamily", getObjectValue(objects, "rowLabels", "fontFamily", DEFAULT_SETTINGS.rowLabels.fontFamily)),
      fontSize: clamp(getObjectValue(objects, "table", "rowHeaderFontSize", getObjectValue(objects, "rowLabels", "fontSize", DEFAULT_SETTINGS.rowLabels.fontSize)), 7, 48),
      fontColor: getFillColor(objects, "table", "rowHeaderFontColor", getFillColor(objects, "rowLabels", "fontColor", DEFAULT_SETTINGS.rowLabels.fontColor)),
      bold: getObjectValue(objects, "table", "rowHeaderBold", getObjectValue(objects, "rowLabels", "bold", DEFAULT_SETTINGS.rowLabels.bold)),
      italic: getObjectValue(objects, "table", "rowHeaderItalic", getObjectValue(objects, "rowLabels", "italic", DEFAULT_SETTINGS.rowLabels.italic)),
      alignment: getObjectValue(objects, "table", "rowHeaderAlignment", getObjectValue(objects, "rowLabels", "alignment", DEFAULT_SETTINGS.rowLabels.alignment)),
      textWrap: getObjectValue(objects, "table", "rowHeaderTextWrap", getObjectValue(objects, "rowLabels", "textWrap", DEFAULT_SETTINGS.rowLabels.textWrap)),
      maxLabelWidth: clamp(getObjectValue(objects, "table", "rowHeaderMaxLabelWidth", getObjectValue(objects, "rowLabels", "maxLabelWidth", DEFAULT_SETTINGS.rowLabels.maxLabelWidth)), 48, 480)
    },
    columnLabels: {
      fontFamily: getObjectValue(objects, "columnLabels", "fontFamily", DEFAULT_SETTINGS.columnLabels.fontFamily),
      fontSize: clamp(getObjectValue(objects, "columnLabels", "fontSize", DEFAULT_SETTINGS.columnLabels.fontSize), 7, 48),
      fontColor: getFillColor(objects, "columnLabels", "fontColor", DEFAULT_SETTINGS.columnLabels.fontColor),
      bold: getObjectValue(objects, "columnLabels", "bold", DEFAULT_SETTINGS.columnLabels.bold),
      italic: getObjectValue(objects, "columnLabels", "italic", DEFAULT_SETTINGS.columnLabels.italic),
      alignment: getObjectValue(objects, "columnLabels", "alignment", DEFAULT_SETTINGS.columnLabels.alignment),
      categoryLabelFormat: getObjectValue(objects, "columnLabels", "categoryLabelFormat", DEFAULT_SETTINGS.columnLabels.categoryLabelFormat),
      sortOrder: getObjectValue(objects, "columnLabels", "sortOrder", DEFAULT_SETTINGS.columnLabels.sortOrder)
    },
    totalRow: {
      show: getObjectValue(objects, "totalRow", "show", DEFAULT_SETTINGS.totalRow.show),
      showColumn: getObjectValue(objects, "totalRow", "showColumn", DEFAULT_SETTINGS.totalRow.showColumn),
      labelText: getObjectValue(objects, "totalRow", "labelText", DEFAULT_SETTINGS.totalRow.labelText),
      columnLabelText: getObjectValue(objects, "totalRow", "columnLabelText", DEFAULT_SETTINGS.totalRow.columnLabelText),
      columnWidth: clamp(getObjectValue(objects, "totalRow", "columnWidth", DEFAULT_SETTINGS.totalRow.columnWidth), 42, 220),
      calculation: getObjectValue(objects, "totalRow", "calculation", DEFAULT_SETTINGS.totalRow.calculation),
      fontSize: clamp(getObjectValue(objects, "totalRow", "fontSize", DEFAULT_SETTINGS.totalRow.fontSize), 7, 48),
      fontColor: getFillColor(objects, "totalRow", "fontColor", DEFAULT_SETTINGS.totalRow.fontColor),
      bold: getObjectValue(objects, "totalRow", "bold", DEFAULT_SETTINGS.totalRow.bold),
      backgroundShow: getObjectValue(objects, "totalRow", "backgroundShow", DEFAULT_SETTINGS.totalRow.backgroundShow),
      backgroundColor: getFillColor(objects, "totalRow", "backgroundColor", DEFAULT_SETTINGS.totalRow.backgroundColor),
      cardBackgroundColor: getFillColor(objects, "totalRow", "cardBackgroundColor", getFillColor(objects, "totalRow", "backgroundColor", DEFAULT_SETTINGS.totalRow.cardBackgroundColor)),
      cardBorderColor: getFillColor(objects, "totalRow", "cardBorderColor", DEFAULT_SETTINGS.totalRow.cardBorderColor),
      cardBorderWidth: clamp(getObjectValue(objects, "totalRow", "cardBorderWidth", DEFAULT_SETTINGS.totalRow.cardBorderWidth), 0, 8),
      cardCornerRadius: clamp(getObjectValue(objects, "totalRow", "cardCornerRadius", DEFAULT_SETTINGS.totalRow.cardCornerRadius), 0, 16),
      showDivider: getObjectValue(objects, "totalRow", "showDivider", DEFAULT_SETTINGS.totalRow.showDivider),
      dividerSpacing: clamp(getObjectValue(objects, "totalRow", "dividerSpacing", DEFAULT_SETTINGS.totalRow.dividerSpacing), 0, 60),
      dividerColor: getFillColor(objects, "totalRow", "dividerColor", DEFAULT_SETTINGS.totalRow.dividerColor),
      includeHiddenBlankCategories: getObjectValue(objects, "totalRow", "includeHiddenBlankCategories", DEFAULT_SETTINGS.totalRow.includeHiddenBlankCategories)
    },
    additionalRows: {
      show: getObjectValue(objects, "additionalRows", "show", DEFAULT_SETTINGS.additionalRows.show),
      showTotals: getObjectValue(objects, "additionalRows", "showTotals", DEFAULT_SETTINGS.additionalRows.showTotals),
      labelFontFamily: getObjectValue(objects, "additionalRows", "labelFontFamily", DEFAULT_SETTINGS.additionalRows.labelFontFamily),
      labelFontSize: clamp(getObjectValue(objects, "additionalRows", "labelFontSize", DEFAULT_SETTINGS.additionalRows.labelFontSize), 7, 48),
      labelFontColor: getFillColor(objects, "additionalRows", "labelFontColor", DEFAULT_SETTINGS.additionalRows.labelFontColor),
      labelBold: getObjectValue(objects, "additionalRows", "labelBold", DEFAULT_SETTINGS.additionalRows.labelBold),
      labelItalic: getObjectValue(objects, "additionalRows", "labelItalic", DEFAULT_SETTINGS.additionalRows.labelItalic),
      labelAlignment: getObjectValue(objects, "additionalRows", "labelAlignment", DEFAULT_SETTINGS.additionalRows.labelAlignment),
      labelPaddingLeft: clamp(getObjectValue(objects, "additionalRows", "labelPaddingLeft", DEFAULT_SETTINGS.additionalRows.labelPaddingLeft), 0, 80),
      labelPaddingRight: clamp(getObjectValue(objects, "additionalRows", "labelPaddingRight", DEFAULT_SETTINGS.additionalRows.labelPaddingRight), 0, 80),
      markerShow: getObjectValue(objects, "additionalRowHeaderMarker", "show", DEFAULT_SETTINGS.additionalRows.markerShow),
      markerShape: normalizeShape(getObjectValue(objects, "additionalRowHeaderMarker", "shapeType", getObjectValue(objects, "additionalRows", "markerShape", DEFAULT_SETTINGS.additionalRows.markerShape)), DEFAULT_SETTINGS.additionalRows.markerShape),
      markerSize: clamp(getObjectValue(objects, "additionalRowHeaderMarker", "size", getObjectValue(objects, "additionalRows", "markerSize", DEFAULT_SETTINGS.additionalRows.markerSize)), 2, 32),
      markerColor: getFillColor(objects, "additionalRowHeaderMarker", "fillColor", getFillColor(objects, "additionalRows", "markerColor", DEFAULT_SETTINGS.additionalRows.markerColor)),
      markerBorderColor: getFillColor(objects, "additionalRowHeaderMarker", "borderColor", DEFAULT_SETTINGS.additionalRows.markerBorderColor),
      markerBorderWidth: clamp(getObjectValue(objects, "additionalRowHeaderMarker", "borderWidth", DEFAULT_SETTINGS.additionalRows.markerBorderWidth), 0, 8),
      markerOpacity: clamp(getObjectValue(objects, "additionalRowHeaderMarker", "opacity", DEFAULT_SETTINGS.additionalRows.markerOpacity), 0, 1),
      markerPosition: getObjectValue(objects, "additionalRowHeaderMarker", "position", DEFAULT_SETTINGS.additionalRows.markerPosition),
      markerLayout: getObjectValue(objects, "additionalRowHeaderMarker", "layout", DEFAULT_SETTINGS.additionalRows.markerLayout),
      markerTextGap: clamp(getObjectValue(objects, "additionalRowHeaderMarker", "textGap", DEFAULT_SETTINGS.additionalRows.markerTextGap), 0, 60),
      valueFontFamily: getObjectValue(objects, "additionalRows", "valueFontFamily", DEFAULT_SETTINGS.additionalRows.valueFontFamily),
      valueFontSize: clamp(getObjectValue(objects, "additionalRows", "valueFontSize", DEFAULT_SETTINGS.additionalRows.valueFontSize), 7, 48),
      valueFontColor: getFillColor(objects, "additionalRows", "valueFontColor", DEFAULT_SETTINGS.additionalRows.valueFontColor),
      valueBold: getObjectValue(objects, "additionalRows", "valueBold", DEFAULT_SETTINGS.additionalRows.valueBold),
      valueItalic: getObjectValue(objects, "additionalRows", "valueItalic", DEFAULT_SETTINGS.additionalRows.valueItalic),
      cellBackgroundShow: getObjectValue(objects, "additionalRows", "cellBackgroundShow", DEFAULT_SETTINGS.additionalRows.cellBackgroundShow),
      cellBackgroundColor: getFillColor(objects, "additionalRows", "cellBackgroundColor", DEFAULT_SETTINGS.additionalRows.cellBackgroundColor),
      cellBorderColor: getFillColor(objects, "additionalRows", "cellBorderColor", DEFAULT_SETTINGS.additionalRows.cellBorderColor),
      cellBorderWidth: clamp(getObjectValue(objects, "additionalRows", "cellBorderWidth", DEFAULT_SETTINGS.additionalRows.cellBorderWidth), 0, 8)
    },
    topFilters: {
      show: getObjectValue(objects, "topFilters", "show", DEFAULT_SETTINGS.topFilters.show),
      showFilterOne: getObjectValue(objects, "topFilters", "showFilterOne", DEFAULT_SETTINGS.topFilters.showFilterOne),
      showFilterTwo: getObjectValue(objects, "topFilters", "showFilterTwo", DEFAULT_SETTINGS.topFilters.showFilterTwo),
      filterOneLabel: getObjectValue(objects, "topFilters", "filterOneLabel", DEFAULT_SETTINGS.topFilters.filterOneLabel),
      filterTwoLabel: getObjectValue(objects, "topFilters", "filterTwoLabel", DEFAULT_SETTINGS.topFilters.filterTwoLabel),
      controlStyle: getObjectValue(objects, "topFilters", "controlStyle", DEFAULT_SETTINGS.topFilters.controlStyle),
      filterOneControlStyle: getObjectValue(objects, "topFilters", "filterOneControlStyle", getObjectValue(objects, "topFilters", "controlStyle", DEFAULT_SETTINGS.topFilters.filterOneControlStyle)),
      filterTwoControlStyle: getObjectValue(objects, "topFilters", "filterTwoControlStyle", getObjectValue(objects, "topFilters", "controlStyle", DEFAULT_SETTINGS.topFilters.filterTwoControlStyle)),
      filterOneStyle: parseTopFilterStyle(objects, "filterOneStyle", DEFAULT_SETTINGS.topFilters.filterOneStyle),
      filterTwoStyle: parseTopFilterStyle(objects, "filterTwoStyle", DEFAULT_SETTINGS.topFilters.filterTwoStyle),
      alignment: getObjectValue(objects, "topFilters", "alignment", DEFAULT_SETTINGS.topFilters.alignment),
      fontFamily: getObjectValue(objects, "topFilters", "fontFamily", DEFAULT_SETTINGS.topFilters.fontFamily),
      fontSize: clamp(getObjectValue(objects, "topFilters", "fontSize", DEFAULT_SETTINGS.topFilters.fontSize), 8, 24),
      labelColor: getFillColor(objects, "topFilters", "labelColor", DEFAULT_SETTINGS.topFilters.labelColor),
      valueColor: getFillColor(objects, "topFilters", "valueColor", DEFAULT_SETTINGS.topFilters.valueColor),
      checkboxBackgroundColor: getFillColor(objects, "topFilters", "checkboxBackgroundColor", DEFAULT_SETTINGS.topFilters.checkboxBackgroundColor),
      checkboxTickColor: getFillColor(objects, "topFilters", "checkboxTickColor", DEFAULT_SETTINGS.topFilters.checkboxTickColor),
      backgroundColor: getFillColor(objects, "topFilters", "backgroundColor", DEFAULT_SETTINGS.topFilters.backgroundColor),
      borderColor: getFillColor(objects, "topFilters", "borderColor", DEFAULT_SETTINGS.topFilters.borderColor),
      borderWidth: clamp(getObjectValue(objects, "topFilters", "borderWidth", DEFAULT_SETTINGS.topFilters.borderWidth), 0, 8),
      cornerRadius: clamp(getObjectValue(objects, "topFilters", "cornerRadius", DEFAULT_SETTINGS.topFilters.cornerRadius), 0, 16),
      paddingTop: clamp(getObjectValue(objects, "topFilters", "paddingTop", DEFAULT_SETTINGS.topFilters.paddingTop), 0, 40),
      paddingRight: clamp(getObjectValue(objects, "topFilters", "paddingRight", DEFAULT_SETTINGS.topFilters.paddingRight), 0, 60),
      paddingBottom: clamp(getObjectValue(objects, "topFilters", "paddingBottom", DEFAULT_SETTINGS.topFilters.paddingBottom), 0, 40),
      paddingLeft: clamp(getObjectValue(objects, "topFilters", "paddingLeft", DEFAULT_SETTINGS.topFilters.paddingLeft), 0, 60),
      itemGap: clamp(getObjectValue(objects, "topFilters", "itemGap", DEFAULT_SETTINGS.topFilters.itemGap), 0, 40)
    },
    dataColors: {
      defaultPalette: getObjectValue(objects, "dataColors", "defaultPalette", DEFAULT_SETTINGS.dataColors.defaultPalette),
      resetColors: getObjectValue(objects, "dataColors", "resetColors", DEFAULT_SETTINGS.dataColors.resetColors),
      useConditionalFormattingColors: getObjectValue(objects, "dataColors", "useConditionalFormattingColors", DEFAULT_SETTINGS.dataColors.useConditionalFormattingColors),
      applyCategoryColorsToChart: getObjectValue(objects, "dataColors", "applyCategoryColorsToChart", DEFAULT_SETTINGS.dataColors.applyCategoryColorsToChart),
      applyCategoryColorsToShapes: getObjectValue(objects, "dataColors", "applyCategoryColorsToShapes", DEFAULT_SETTINGS.dataColors.applyCategoryColorsToShapes)
    },
    categoryShape: {
      show: getObjectValue(objects, "table", "rowHeaderMarkerShow", getObjectValue(objects, "categoryShape", "show", DEFAULT_SETTINGS.categoryShape.show)),
      shapeType: normalizeShape(getObjectValue(objects, "table", "rowHeaderMarkerShape", getObjectValue(objects, "categoryShape", "shapeType", DEFAULT_SETTINGS.categoryShape.shapeType)), DEFAULT_SETTINGS.categoryShape.shapeType),
      size: clamp(getObjectValue(objects, "table", "rowHeaderMarkerSize", getObjectValue(objects, "categoryShape", "size", DEFAULT_SETTINGS.categoryShape.size)), 2, 32),
      fillColor: getFillColor(objects, "table", "rowHeaderMarkerColor", getFillColor(objects, "categoryShape", "fillColor", DEFAULT_SETTINGS.categoryShape.fillColor)),
      borderColor: getFillColor(objects, "table", "rowHeaderMarkerBorderColor", getFillColor(objects, "categoryShape", "borderColor", DEFAULT_SETTINGS.categoryShape.borderColor)),
      borderWidth: clamp(getObjectValue(objects, "table", "rowHeaderMarkerBorderWidth", getObjectValue(objects, "categoryShape", "borderWidth", DEFAULT_SETTINGS.categoryShape.borderWidth)), 0, 8),
      opacity: clamp(getObjectValue(objects, "table", "rowHeaderMarkerOpacity", getObjectValue(objects, "categoryShape", "opacity", DEFAULT_SETTINGS.categoryShape.opacity)), 0, 1),
      position: getObjectValue(objects, "table", "rowHeaderMarkerPosition", getObjectValue(objects, "categoryShape", "position", DEFAULT_SETTINGS.categoryShape.position)),
      layout: getObjectValue(objects, "table", "rowHeaderMarkerLayout", getObjectValue(objects, "categoryShape", "layout", DEFAULT_SETTINGS.categoryShape.layout))
    },
    conditionalFormatting: parseConditionalFormatting(objects),
    referenceLine: {
      show: getObjectValue(objects, "referenceLine", "show", DEFAULT_SETTINGS.referenceLine.show),
      lineColor: getFillColor(objects, "referenceLine", "lineColor", DEFAULT_SETTINGS.referenceLine.lineColor),
      lineWidth: clamp(getObjectValue(objects, "referenceLine", "lineWidth", DEFAULT_SETTINGS.referenceLine.lineWidth), 1, 12),
      lineStyle: getObjectValue(objects, "referenceLine", "lineStyle", DEFAULT_SETTINGS.referenceLine.lineStyle),
      showMarkers: getObjectValue(objects, "referenceLine", "showMarkers", DEFAULT_SETTINGS.referenceLine.showMarkers),
      markerShape: normalizeShape(getObjectValue(objects, "referenceLine", "markerShape", DEFAULT_SETTINGS.referenceLine.markerShape), DEFAULT_SETTINGS.referenceLine.markerShape),
      markerSize: clamp(getObjectValue(objects, "referenceLine", "markerSize", DEFAULT_SETTINGS.referenceLine.markerSize), 2, 32),
      markerColor: getFillColor(objects, "referenceLine", "markerColor", DEFAULT_SETTINGS.referenceLine.markerColor),
      markerBorderColor: getFillColor(objects, "referenceLine", "markerBorderColor", DEFAULT_SETTINGS.referenceLine.markerBorderColor),
      markerBorderWidth: clamp(getObjectValue(objects, "referenceLine", "markerBorderWidth", DEFAULT_SETTINGS.referenceLine.markerBorderWidth), 0, 8),
      showDataLabels: getObjectValue(objects, "referenceLine", "showDataLabels", DEFAULT_SETTINGS.referenceLine.showDataLabels),
      showLabel: getObjectValue(objects, "referenceLine", "showLabel", DEFAULT_SETTINGS.referenceLine.showLabel),
      labelText: getObjectValue(objects, "referenceLine", "labelText", DEFAULT_SETTINGS.referenceLine.labelText),
      labelColor: getFillColor(objects, "referenceLine", "labelColor", DEFAULT_SETTINGS.referenceLine.labelColor),
      labelFontSize: clamp(getObjectValue(objects, "referenceLine", "labelFontSize", DEFAULT_SETTINGS.referenceLine.labelFontSize), 7, 36),
      labelBackgroundShow: getObjectValue(objects, "referenceLine", "labelBackgroundShow", DEFAULT_SETTINGS.referenceLine.labelBackgroundShow),
      labelBackgroundColor: getFillColor(objects, "referenceLine", "labelBackgroundColor", DEFAULT_SETTINGS.referenceLine.labelBackgroundColor),
      labelBackgroundTransparency: clamp(getObjectValue(objects, "referenceLine", "labelBackgroundTransparency", DEFAULT_SETTINGS.referenceLine.labelBackgroundTransparency), 0, 100)
    }
  };
}

function parseConditionalFormatting(objects?: DataViewObjects): ConditionalFormattingSettings {
  const base = DEFAULT_SETTINGS.conditionalFormatting;
  return {
    enabled: getObjectValue(objects, "conditionalFormatting", "enabled", base.enabled),
    applyTo: getObjectValue(objects, "conditionalFormatting", "applyTo", base.applyTo),
    formatMode: getObjectValue(objects, "conditionalFormatting", "formatMode", base.formatMode),
    rules: [1, 2, 3].map((index) => ({
      threshold: getObjectValue(objects, "conditionalFormatting", `rule${index}Threshold`, base.rules[index - 1].threshold),
      operator: getObjectValue(objects, "conditionalFormatting", `rule${index}Operator`, base.rules[index - 1].operator),
      color: getFillColor(objects, "conditionalFormatting", `rule${index}Color`, base.rules[index - 1].color),
      bold: getObjectValue(objects, "conditionalFormatting", `rule${index}Bold`, base.rules[index - 1].bold),
      fontSize: clamp(getObjectValue(objects, "conditionalFormatting", `rule${index}FontSize`, base.rules[index - 1].fontSize), 7, 48)
    })),
    gradientLowColor: getFillColor(objects, "conditionalFormatting", "gradientLowColor", base.gradientLowColor),
    gradientHighColor: getFillColor(objects, "conditionalFormatting", "gradientHighColor", base.gradientHighColor),
    applyToTotalRow: getObjectValue(objects, "conditionalFormatting", "applyToTotalRow", base.applyToTotalRow),
    applyToBlanks: getObjectValue(objects, "conditionalFormatting", "applyToBlanks", base.applyToBlanks)
  };
}

export function buildFormattingModel(settings: VisualSettings, series: SeriesColorContext = [], additionalRows: AdditionalRowFormatContext = []): powerbi.visuals.FormattingModel {
  const cards: any[] = [
    groupedCard("chart", "Chart settings", [
      {
        displayName: "Chart type and scale",
        slices: [
          toggle("chart", "show", "Show chart", settings.chart.show),
          dropdown("chart", "chartType", "Chart type", settings.chart.chartType, [
            item("Line", "line"),
            item("Clustered bar", "clusteredBar"),
            item("Stacked bar", "stackedBar"),
            item("Lollipop", "lollipop"),
            item("None", "none")
          ]),
          numeric("chart", "chartHeight", "Chart height", settings.chart.chartHeight),
          numeric("chart", "yAxisStart", "Y-axis start", settings.chart.yAxisStart),
          numeric("chart", "yAxisEnd", "Y-axis end", settings.chart.yAxisEnd),
          toggle("chart", "autoScaleYAxis", "Auto scale Y-axis", settings.chart.autoScaleYAxis)
        ]
      },
      {
        displayName: "Axis labels",
        slices: [
          toggle("chart", "showXAxisLabels", "Show x-axis labels", settings.chart.showXAxisLabels),
          fontFamily("chart", "xAxisLabelFontFamily", "X-axis label font family", settings.chart.xAxisLabelFontFamily),
          color("chart", "xAxisLabelColor", "X-axis label color", settings.chart.xAxisLabelColor),
          numeric("chart", "xAxisLabelFontSize", "X-axis label font size", settings.chart.xAxisLabelFontSize),
          toggle("chart", "showYAxis", "Show y-axis", settings.chart.showYAxis),
          fontFamily("chart", "yAxisLabelFontFamily", "Y-axis label font family", settings.chart.yAxisLabelFontFamily),
          color("chart", "yAxisLabelColor", "Y-axis label color", settings.chart.yAxisLabelColor),
          numeric("chart", "yAxisLabelFontSize", "Y-axis label font size", settings.chart.yAxisLabelFontSize)
        ]
      },
      {
        displayName: "Gridlines",
        slices: [
          toggle("chart", "showGridlines", "Show gridlines", settings.chart.showGridlines),
          color("chart", "gridlineColor", "Gridline color", settings.chart.gridlineColor),
          dropdown("chart", "gridlineStyle", "Gridline style", settings.chart.gridlineStyle, [item("Solid", "solid"), item("Dashed", "dashed"), item("Dotted", "dotted")]),
          numeric("chart", "gridlineWidth", "Gridline width", settings.chart.gridlineWidth)
        ]
      },
      {
        displayName: "Line and markers",
        slices: [
          numeric("chart", "lineWidth", "Line width", settings.chart.lineWidth),
          dropdown("chart", "lineStyle", "Line style", settings.chart.lineStyle, [item("Solid", "solid"), item("Dashed", "dashed"), item("Dotted", "dotted")]),
          toggle("chart", "lineSmoothing", "Line smoothing", settings.chart.lineSmoothing),
          toggle("chart", "showMarkers", "Show markers", settings.chart.showMarkers),
          numeric("chart", "markerSize", "Marker size", settings.chart.markerSize),
          dropdown("chart", "markerShape", "Marker shape", settings.chart.markerShape, shapeItems(false))
        ]
      },
      {
        displayName: "Bar chart",
        slices: [
          numeric("chart", "barPadding", "Bar padding", settings.chart.barPadding),
          numeric("chart", "barInnerPadding", "Bar inner padding", settings.chart.barInnerPadding),
          numeric("chart", "barCornerRadius", "Bar corner radius", settings.chart.barCornerRadius)
        ]
      },
      {
        displayName: "Data labels",
        slices: [
          toggle("chart", "showChartDataLabels", "Show data labels on chart", settings.chart.showChartDataLabels),
          numeric("chart", "chartLabelFontSize", "Chart label font size", settings.chart.chartLabelFontSize),
          color("chart", "chartLabelColor", "Chart label color", settings.chart.chartLabelColor),
          dropdown("chart", "chartLabelPosition", "Chart label position", settings.chart.chartLabelPosition, chartLabelPositionItems()),
          dropdown("chart", "chartLabelHorizontalAlignment", "Chart label horizontal alignment", settings.chart.chartLabelHorizontalAlignment, alignmentItems()),
          dropdown("chart", "chartLabelVerticalAlignment", "Chart label vertical alignment", settings.chart.chartLabelVerticalAlignment, verticalAlignmentItems()),
          toggle("chart", "chartLabelBackgroundShow", "Show chart label background", settings.chart.chartLabelBackgroundShow),
          color("chart", "chartLabelBackgroundColor", "Chart label background color", settings.chart.chartLabelBackgroundColor),
          numeric("chart", "chartLabelBackgroundTransparency", "Chart label background transparency", settings.chart.chartLabelBackgroundTransparency),
          numeric("chart", "labelOffsetX", "Data label offset X", settings.chart.labelOffsetX),
          numeric("chart", "labelOffsetY", "Data label offset Y", settings.chart.labelOffsetY),
          toggle("chart", "avoidLabelCollisions", "Avoid data label collisions", settings.chart.avoidLabelCollisions)
        ]
      },
      {
        displayName: "Chart padding",
        slices: [
          numeric("chart", "chartPaddingTop", "Chart padding top", settings.chart.chartPaddingTop),
          numeric("chart", "chartPaddingRight", "Chart padding right", settings.chart.chartPaddingRight),
          numeric("chart", "chartPaddingBottom", "Chart padding bottom", settings.chart.chartPaddingBottom),
          numeric("chart", "chartPaddingLeft", "Chart padding left", settings.chart.chartPaddingLeft)
        ]
      }
    ]),
    card("table", "Table", [
      toggle("table", "show", "Show table", settings.table.show),
      color("table", "backgroundColor", "Table background color", settings.table.backgroundColor),
      color("table", "columnCardBackgroundColor", "Column card background color", settings.table.columnCardBackgroundColor),
      color("table", "columnCardBorderColor", "Column card border color", settings.table.columnCardBorderColor),
      toggle("table", "showCellBorders", "Show table borders", settings.table.showCellBorders),
      numeric("table", "columnCardBorderWidth", "Column card border width", settings.table.columnCardBorderWidth),
      numeric("table", "columnCardCornerRadius", "Column card corner radius", settings.table.columnCardCornerRadius),
      numeric("table", "columnGap", "Column gap", settings.table.columnGap),
      numeric("table", "rowGap", "Row gap", settings.table.rowGap),
      numeric("table", "cellPadding", "Cell padding", settings.table.cellPadding),
      numeric("table", "tablePaddingTop", "Table padding top", settings.table.tablePaddingTop),
      numeric("table", "tablePaddingRight", "Table padding right", settings.table.tablePaddingRight),
      numeric("table", "tablePaddingBottom", "Table padding bottom", settings.table.tablePaddingBottom),
      numeric("table", "tablePaddingLeft", "Table padding left", settings.table.tablePaddingLeft),
      numeric("table", "rowLabelWidth", "Row label width", settings.table.rowLabelWidth),
      dropdown("table", "columnWidthMode", "Column width mode", settings.table.columnWidthMode, [item("Auto", "auto"), item("Fixed", "fixed"), item("Fit", "fit")]),
      numeric("table", "fixedColumnWidth", "Fixed column width", settings.table.fixedColumnWidth),
      toggle("table", "showRowLabels", "Show row labels", settings.table.showRowLabels),
      toggle("table", "showColumnLabels", "Show column labels", settings.table.showColumnLabels),
      toggle("table", "showCategoryShapes", "Show category shapes", settings.table.showCategoryShapes),
      toggle("table", "showDividers", "Show dividers", settings.table.showDividers),
      color("table", "dividerColor", "Divider color", settings.table.dividerColor),
      numeric("table", "dividerWidth", "Divider width", settings.table.dividerWidth)
    ]),
    card("values", "Values", [
      fontFamily("values", "fontFamily", "Font family", settings.values.fontFamily),
      numeric("values", "fontSize", "Font size", settings.values.fontSize),
      color("values", "fontColor", "Font color", settings.values.fontColor),
      toggle("values", "bold", "Bold", settings.values.bold),
      toggle("values", "italic", "Italic", settings.values.italic),
      toggle("values", "underline", "Underline", settings.values.underline),
      dropdown("values", "horizontalAlignment", "Horizontal alignment", settings.values.horizontalAlignment, alignmentItems()),
      dropdown("values", "displayUnits", "Display units", settings.values.displayUnits, [
        item("Auto", "auto"),
        item("None", "none"),
        item("Thousands", "thousands"),
        item("Millions", "millions"),
        item("Billions", "billions")
      ]),
      numeric("values", "decimalPlaces", "Decimal places", settings.values.decimalPlaces),
      toggle("values", "thousandSeparator", "Thousand separator", settings.values.thousandSeparator),
      text("values", "blankValueText", "Blank value display text", settings.values.blankValueText),
      dropdown("values", "negativeValueStyle", "Negative value style", settings.values.negativeValueStyle, [item("Minus sign", "minus"), item("Parentheses", "parentheses")])
    ]),
    card("rowLabels", "Row headers", [
      fontFamily("rowLabels", "fontFamily", "Font family", settings.rowLabels.fontFamily),
      numeric("rowLabels", "fontSize", "Font size", settings.rowLabels.fontSize),
      color("rowLabels", "fontColor", "Font color", settings.rowLabels.fontColor),
      toggle("rowLabels", "bold", "Bold", settings.rowLabels.bold),
      toggle("rowLabels", "italic", "Italic", settings.rowLabels.italic),
      dropdown("rowLabels", "alignment", "Text alignment", settings.rowLabels.alignment, alignmentItems()),
      toggle("rowLabels", "textWrap", "Text wrap", settings.rowLabels.textWrap),
      numeric("rowLabels", "maxLabelWidth", "Max label width", settings.rowLabels.maxLabelWidth)
    ]),
    card("columnLabels", "Column labels", [
      fontFamily("columnLabels", "fontFamily", "Font family", settings.columnLabels.fontFamily),
      numeric("columnLabels", "fontSize", "Font size", settings.columnLabels.fontSize),
      color("columnLabels", "fontColor", "Font color", settings.columnLabels.fontColor),
      toggle("columnLabels", "bold", "Bold", settings.columnLabels.bold),
      toggle("columnLabels", "italic", "Italic", settings.columnLabels.italic),
      dropdown("columnLabels", "alignment", "Alignment", settings.columnLabels.alignment, alignmentItems()),
      text("columnLabels", "categoryLabelFormat", "Date/category label formatting", settings.columnLabels.categoryLabelFormat),
      dropdown("columnLabels", "sortOrder", "Sort order", settings.columnLabels.sortOrder, [item("Data source order", "source"), item("Ascending", "ascending"), item("Descending", "descending")])
    ]),
    card("totalRow", "Total row", [
      toggle("totalRow", "show", "Show total row", settings.totalRow.show),
      toggle("totalRow", "showColumn", "Show total column", settings.totalRow.showColumn),
      text("totalRow", "labelText", "Total label text", settings.totalRow.labelText),
      text("totalRow", "columnLabelText", "Total column label text", settings.totalRow.columnLabelText),
      numeric("totalRow", "columnWidth", "Total column width", settings.totalRow.columnWidth),
      dropdown("totalRow", "calculation", "Total calculation", settings.totalRow.calculation, [item("Sum", "sum")]),
      numeric("totalRow", "fontSize", "Total font size", settings.totalRow.fontSize),
      color("totalRow", "fontColor", "Total font color", settings.totalRow.fontColor),
      toggle("totalRow", "bold", "Total bold", settings.totalRow.bold),
      toggle("totalRow", "backgroundShow", "Show total background", settings.totalRow.backgroundShow),
      color("totalRow", "backgroundColor", "Total background color", settings.totalRow.backgroundColor),
      color("totalRow", "cardBackgroundColor", "Total card background color", settings.totalRow.cardBackgroundColor),
      color("totalRow", "cardBorderColor", "Total card border color", settings.totalRow.cardBorderColor),
      numeric("totalRow", "cardBorderWidth", "Total card border width", settings.totalRow.cardBorderWidth),
      numeric("totalRow", "cardCornerRadius", "Total card corner radius", settings.totalRow.cardCornerRadius),
      toggle("totalRow", "showDivider", "Show divider above total", settings.totalRow.showDivider),
      color("totalRow", "dividerColor", "Divider color", settings.totalRow.dividerColor),
      numeric("totalRow", "dividerSpacing", "Divider-to-total spacing", settings.totalRow.dividerSpacing),
      toggle("totalRow", "includeHiddenBlankCategories", "Include hidden/blank categories", settings.totalRow.includeHiddenBlankCategories)
    ]),
    additionalRowsCard(settings, additionalRows),
    card("chartSelector", "Chart type selector", [
      toggle("chartSelector", "show", "Show chart type selector", settings.chartSelector.show),
      text("chartSelector", "labelText", "Selector name", settings.chartSelector.labelText),
      fontFamily("chartSelector", "fontFamily", "Font family", settings.chartSelector.fontFamily),
      numeric("chartSelector", "fontSize", "Font size", settings.chartSelector.fontSize),
      color("chartSelector", "labelColor", "Selector name color", settings.chartSelector.labelColor),
      color("chartSelector", "valueColor", "Selector value color", settings.chartSelector.valueColor),
      color("chartSelector", "backgroundColor", "Dropdown background color", settings.chartSelector.backgroundColor),
      color("chartSelector", "borderColor", "Dropdown border color", settings.chartSelector.borderColor),
      numeric("chartSelector", "borderWidth", "Dropdown border width", settings.chartSelector.borderWidth),
      numeric("chartSelector", "cornerRadius", "Dropdown corner radius", settings.chartSelector.cornerRadius)
    ]),
    topFiltersCard(settings),
    card("referenceLine", "Add Target Line", [
      toggle("referenceLine", "show", "Show reference line", settings.referenceLine.show),
      color("referenceLine", "lineColor", "Line color", settings.referenceLine.lineColor),
      numeric("referenceLine", "lineWidth", "Line width", settings.referenceLine.lineWidth),
      dropdown("referenceLine", "lineStyle", "Line style", settings.referenceLine.lineStyle, [item("Solid", "solid"), item("Dashed", "dashed"), item("Dotted", "dotted")]),
      toggle("referenceLine", "showMarkers", "Show target markers", settings.referenceLine.showMarkers),
      dropdown("referenceLine", "markerShape", "Target marker shape", settings.referenceLine.markerShape, shapeItems(false)),
      numeric("referenceLine", "markerSize", "Target marker size", settings.referenceLine.markerSize),
      color("referenceLine", "markerColor", "Target marker color", settings.referenceLine.markerColor),
      color("referenceLine", "markerBorderColor", "Target marker border color", settings.referenceLine.markerBorderColor),
      numeric("referenceLine", "markerBorderWidth", "Target marker border width", settings.referenceLine.markerBorderWidth),
      toggle("referenceLine", "showDataLabels", "Show target data labels", settings.referenceLine.showDataLabels),
      toggle("referenceLine", "showLabel", "Show label", settings.referenceLine.showLabel),
      text("referenceLine", "labelText", "Label text", settings.referenceLine.labelText),
      color("referenceLine", "labelColor", "Label color", settings.referenceLine.labelColor),
      numeric("referenceLine", "labelFontSize", "Label font size", settings.referenceLine.labelFontSize),
      toggle("referenceLine", "labelBackgroundShow", "Show label background", settings.referenceLine.labelBackgroundShow),
      color("referenceLine", "labelBackgroundColor", "Label background color", settings.referenceLine.labelBackgroundColor),
      numeric("referenceLine", "labelBackgroundTransparency", "Label background transparency", settings.referenceLine.labelBackgroundTransparency)
    ]),
    seriesColorCard(series),
    card("categoryShape", "Row header marker", [
      toggle("categoryShape", "show", "Show marker", settings.categoryShape.show),
      dropdown("categoryShape", "shapeType", "Marker shape", settings.categoryShape.shapeType, shapeItems(true)),
      numeric("categoryShape", "size", "Marker size", settings.categoryShape.size),
      color("categoryShape", "borderColor", "Marker border color", settings.categoryShape.borderColor),
      numeric("categoryShape", "borderWidth", "Marker border width", settings.categoryShape.borderWidth),
      numeric("categoryShape", "opacity", "Marker opacity", settings.categoryShape.opacity),
      dropdown("categoryShape", "position", "Marker position", settings.categoryShape.position, [item("Before label", "before"), item("After label", "after")]),
      dropdown("categoryShape", "layout", "Marker layout", settings.categoryShape.layout, [item("Inline", "inline"), item("Opposite edge", "edge")])
    ]),
    card("conditionalFormatting", "Conditional formatting", [
      toggle("conditionalFormatting", "enabled", "Enable conditional formatting", settings.conditionalFormatting.enabled),
      dropdown("conditionalFormatting", "applyTo", "Apply to", settings.conditionalFormatting.applyTo, [
        item("Table value font color", "tableFont"),
        item("Table cell background", "tableBackground"),
        item("Chart marker/bar color", "chart"),
        item("Category shape color", "shape"),
        item("Total row/column values", "total"),
        item("Both table and chart", "both")
      ]),
      dropdown("conditionalFormatting", "formatMode", "Format mode", settings.conditionalFormatting.formatMode, [item("Rules", "rules"), item("Gradient", "gradient")]),
      ...settings.conditionalFormatting.rules.flatMap((rule, index) => ruleSlices(index + 1, rule)),
      color("conditionalFormatting", "gradientLowColor", "Gradient low value color", settings.conditionalFormatting.gradientLowColor),
      color("conditionalFormatting", "gradientHighColor", "Gradient high value color", settings.conditionalFormatting.gradientHighColor),
      toggle("conditionalFormatting", "applyToTotalRow", "Apply to totals", settings.conditionalFormatting.applyToTotalRow),
      toggle("conditionalFormatting", "applyToBlanks", "Apply to blanks", settings.conditionalFormatting.applyToBlanks)
    ])
  ];

  return { cards } as powerbi.visuals.FormattingModel;
}

export function buildBasicFormattingModel(settings: VisualSettings): powerbi.visuals.FormattingModel {
  return {
    cards: [
      card("chart", "Chart", [
        toggle("chart", "show", "Show chart", settings.chart.show),
        dropdown("chart", "chartType", "Chart type", settings.chart.chartType, [
          item("Line", "line"),
          item("Clustered bar", "clusteredBar"),
          item("Stacked bar", "stackedBar"),
          item("Lollipop", "lollipop"),
          item("None", "none")
        ]),
        numeric("chart", "chartHeight", "Chart height", settings.chart.chartHeight),
        toggle("chart", "showMarkers", "Show markers", settings.chart.showMarkers),
        numeric("chart", "markerSize", "Marker size", settings.chart.markerSize),
        toggle("chart", "showChartDataLabels", "Show data labels on chart", settings.chart.showChartDataLabels)
      ]),
      card("table", "Table", [
        toggle("table", "show", "Show table", settings.table.show),
        toggle("table", "showCellBorders", "Show table borders", settings.table.showCellBorders),
        numeric("table", "rowLabelWidth", "Row label width", settings.table.rowLabelWidth),
        toggle("table", "showRowLabels", "Show row labels", settings.table.showRowLabels),
        toggle("table", "showColumnLabels", "Show column labels", settings.table.showColumnLabels),
        toggle("table", "showCategoryShapes", "Show category shapes", settings.table.showCategoryShapes)
      ]),
      card("values", "Values", [
        numeric("values", "fontSize", "Font size", settings.values.fontSize),
        color("values", "fontColor", "Font color", settings.values.fontColor),
        toggle("values", "bold", "Bold", settings.values.bold)
      ])
    ]
  } as powerbi.visuals.FormattingModel;
}

export function enumerateObjectInstances(options: powerbi.EnumerateVisualObjectInstancesOptions, settings: VisualSettings, series: Array<{ category: string; color: string; selectionId?: any }>): powerbi.VisualObjectInstanceEnumeration {
  if (options.objectName === "categoryColor") {
    const instanceKind = 3;
    const wildcardSelector = dataViewWildcard.createDataViewWildcardSelector(0);

    return {
      instances: series.map((item) => ({
        objectName: "categoryColor",
        displayName: item.category,
        selector: item.selectionId?.getSelector?.() || wildcardSelector,
        altConstantValueSelector: item.selectionId?.getSelector?.(),
        properties: {
          fill: { solid: { color: item.color } }
        },
        propertyInstanceKind: {
          fill: instanceKind
        }
      }))
    };
  }

  const properties = legacyPropertiesForObject(options.objectName, settings);
  if (properties) {
    const propertyInstanceKind = legacyPropertyInstanceKindsForObject(options.objectName);
    return {
      instances: [
        {
          objectName: options.objectName,
          selector: undefined,
          properties,
          ...(propertyInstanceKind ? { propertyInstanceKind } : {})
        }
      ]
    };
  }

  return { instances: [] };
}

function legacyPropertyInstanceKindsForObject(objectName: string): Record<string, number> | undefined {
  const colorProperties: Record<string, string[]> = {
    chart: ["xAxisLabelColor", "yAxisLabelColor", "gridlineColor", "chartLabelColor", "chartLabelBackgroundColor"],
    chartSelector: ["labelColor", "valueColor", "backgroundColor", "borderColor"],
    table: ["backgroundColor", "columnCardBackgroundColor", "columnCardBorderColor", "rowHeaderFontColor", "rowHeaderMarkerBorderColor", "dividerColor"],
    values: ["fontColor"],
    rowLabels: ["fontColor"],
    columnLabels: ["fontColor"],
    totalRow: ["fontColor", "backgroundColor", "cardBackgroundColor", "cardBorderColor", "dividerColor"],
    additionalRows: ["labelFontColor", "valueFontColor", "cellBackgroundColor", "cellBorderColor"],
    additionalRowHeaderMarker: ["fillColor", "borderColor"],
    additionalRowFormat: ["labelFontColor", "markerColor", "valueFontColor"],
    topFilters: ["labelColor", "valueColor", "checkboxBackgroundColor", "checkboxTickColor", "backgroundColor", "borderColor"],
    categoryShape: ["borderColor"],
    conditionalFormatting: ["rule1Color", "rule2Color", "rule3Color", "gradientLowColor", "gradientHighColor"],
    referenceLine: ["lineColor", "markerColor", "markerBorderColor", "labelColor", "labelBackgroundColor"]
  };
  const properties = colorProperties[objectName];
  if (!properties) {
    return undefined;
  }

  return Object.fromEntries(properties.map((property) => [property, COLOR_INSTANCE_KIND]));
}

function legacyPropertiesForObject(objectName: string, settings: VisualSettings): Record<string, unknown> | undefined {
  switch (objectName) {
    case "chart":
      return {
        show: settings.chart.show,
        chartType: settings.chart.chartType,
        chartHeight: settings.chart.chartHeight,
        yAxisStart: settings.chart.yAxisStart,
        yAxisEnd: settings.chart.yAxisEnd,
        autoScaleYAxis: settings.chart.autoScaleYAxis,
        showXAxisLabels: settings.chart.showXAxisLabels,
        xAxisLabelFontFamily: settings.chart.xAxisLabelFontFamily,
        xAxisLabelColor: fill(settings.chart.xAxisLabelColor),
        xAxisLabelFontSize: settings.chart.xAxisLabelFontSize,
        showYAxis: settings.chart.showYAxis,
        yAxisLabelFontFamily: settings.chart.yAxisLabelFontFamily,
        yAxisLabelColor: fill(settings.chart.yAxisLabelColor),
        yAxisLabelFontSize: settings.chart.yAxisLabelFontSize,
        showGridlines: settings.chart.showGridlines,
        gridlineColor: fill(settings.chart.gridlineColor),
        gridlineStyle: settings.chart.gridlineStyle,
        gridlineWidth: settings.chart.gridlineWidth,
        lineWidth: settings.chart.lineWidth,
        lineStyle: settings.chart.lineStyle,
        lineSmoothing: settings.chart.lineSmoothing,
        showMarkers: settings.chart.showMarkers,
        markerSize: settings.chart.markerSize,
        markerShape: settings.chart.markerShape,
        barPadding: settings.chart.barPadding,
        barInnerPadding: settings.chart.barInnerPadding,
        barCornerRadius: settings.chart.barCornerRadius,
        showChartDataLabels: settings.chart.showChartDataLabels,
        chartLabelFontSize: settings.chart.chartLabelFontSize,
        chartLabelColor: fill(settings.chart.chartLabelColor),
        chartLabelPosition: settings.chart.chartLabelPosition,
        chartLabelHorizontalAlignment: settings.chart.chartLabelHorizontalAlignment,
        chartLabelVerticalAlignment: settings.chart.chartLabelVerticalAlignment,
        chartLabelBackgroundShow: settings.chart.chartLabelBackgroundShow,
        chartLabelBackgroundColor: fill(settings.chart.chartLabelBackgroundColor),
        chartLabelBackgroundTransparency: settings.chart.chartLabelBackgroundTransparency,
        chartPaddingTop: settings.chart.chartPaddingTop,
        chartPaddingRight: settings.chart.chartPaddingRight,
        chartPaddingBottom: settings.chart.chartPaddingBottom,
        chartPaddingLeft: settings.chart.chartPaddingLeft,
        labelOffsetX: settings.chart.labelOffsetX,
        labelOffsetY: settings.chart.labelOffsetY,
        avoidLabelCollisions: settings.chart.avoidLabelCollisions
      };
    case "chartSelector":
      return {
        show: settings.chartSelector.show,
        labelText: settings.chartSelector.labelText,
        fontFamily: settings.chartSelector.fontFamily,
        fontSize: settings.chartSelector.fontSize,
        labelColor: fill(settings.chartSelector.labelColor),
        valueColor: fill(settings.chartSelector.valueColor),
        backgroundColor: fill(settings.chartSelector.backgroundColor),
        borderColor: fill(settings.chartSelector.borderColor),
        borderWidth: settings.chartSelector.borderWidth,
        cornerRadius: settings.chartSelector.cornerRadius
      };
    case "table":
      return {
        show: settings.table.show,
        backgroundColor: fill(settings.table.backgroundColor),
        columnCardBackgroundColor: fill(settings.table.columnCardBackgroundColor),
        columnCardBorderColor: fill(settings.table.columnCardBorderColor),
        columnCardBorderWidth: settings.table.columnCardBorderWidth,
        showCellBorders: settings.table.showCellBorders,
        columnCardCornerRadius: settings.table.columnCardCornerRadius,
        columnGap: settings.table.columnGap,
        rowGap: settings.table.rowGap,
        cellPadding: settings.table.cellPadding,
        tablePaddingTop: settings.table.tablePaddingTop,
        tablePaddingRight: settings.table.tablePaddingRight,
        tablePaddingBottom: settings.table.tablePaddingBottom,
        tablePaddingLeft: settings.table.tablePaddingLeft,
        rowLabelWidth: settings.table.rowLabelWidth,
        columnWidthMode: settings.table.columnWidthMode,
        fixedColumnWidth: settings.table.fixedColumnWidth,
        showRowLabels: settings.table.showRowLabels,
        showColumnLabels: settings.table.showColumnLabels,
        showCategoryShapes: settings.table.showCategoryShapes,
        rowHeaderFontFamily: settings.rowLabels.fontFamily,
        rowHeaderFontSize: settings.rowLabels.fontSize,
        rowHeaderFontColor: fill(settings.rowLabels.fontColor),
        rowHeaderBold: settings.rowLabels.bold,
        rowHeaderItalic: settings.rowLabels.italic,
        rowHeaderAlignment: settings.rowLabels.alignment,
        rowHeaderTextWrap: settings.rowLabels.textWrap,
        rowHeaderMaxLabelWidth: settings.rowLabels.maxLabelWidth,
        rowHeaderMarkerShow: settings.categoryShape.show,
        rowHeaderMarkerShape: settings.categoryShape.shapeType,
        rowHeaderMarkerSize: settings.categoryShape.size,
        rowHeaderMarkerBorderColor: fill(settings.categoryShape.borderColor),
        rowHeaderMarkerBorderWidth: settings.categoryShape.borderWidth,
        rowHeaderMarkerOpacity: settings.categoryShape.opacity,
        rowHeaderMarkerPosition: settings.categoryShape.position,
        rowHeaderMarkerLayout: settings.categoryShape.layout,
        showDividers: settings.table.showDividers,
        dividerColor: fill(settings.table.dividerColor),
        dividerWidth: settings.table.dividerWidth
      };
    case "values":
      return {
        fontFamily: settings.values.fontFamily,
        fontSize: settings.values.fontSize,
        fontColor: fill(settings.values.fontColor),
        bold: settings.values.bold,
        italic: settings.values.italic,
        underline: settings.values.underline,
        horizontalAlignment: settings.values.horizontalAlignment,
        displayUnits: settings.values.displayUnits,
        decimalPlaces: settings.values.decimalPlaces,
        thousandSeparator: settings.values.thousandSeparator,
        blankValueText: settings.values.blankValueText,
        negativeValueStyle: settings.values.negativeValueStyle
      };
    case "rowLabels":
      return {
        fontFamily: settings.rowLabels.fontFamily,
        fontSize: settings.rowLabels.fontSize,
        fontColor: fill(settings.rowLabels.fontColor),
        bold: settings.rowLabels.bold,
        italic: settings.rowLabels.italic,
        alignment: settings.rowLabels.alignment,
        textWrap: settings.rowLabels.textWrap,
        maxLabelWidth: settings.rowLabels.maxLabelWidth
      };
    case "columnLabels":
      return {
        fontFamily: settings.columnLabels.fontFamily,
        fontSize: settings.columnLabels.fontSize,
        fontColor: fill(settings.columnLabels.fontColor),
        bold: settings.columnLabels.bold,
        italic: settings.columnLabels.italic,
        alignment: settings.columnLabels.alignment,
        categoryLabelFormat: settings.columnLabels.categoryLabelFormat,
        sortOrder: settings.columnLabels.sortOrder
      };
    case "totalRow":
      return {
        show: settings.totalRow.show,
        showColumn: settings.totalRow.showColumn,
        labelText: settings.totalRow.labelText,
        columnLabelText: settings.totalRow.columnLabelText,
        columnWidth: settings.totalRow.columnWidth,
        calculation: settings.totalRow.calculation,
        fontSize: settings.totalRow.fontSize,
        fontColor: fill(settings.totalRow.fontColor),
        bold: settings.totalRow.bold,
        backgroundShow: settings.totalRow.backgroundShow,
        backgroundColor: fill(settings.totalRow.backgroundColor),
        cardBackgroundColor: fill(settings.totalRow.cardBackgroundColor),
        cardBorderColor: fill(settings.totalRow.cardBorderColor),
        cardBorderWidth: settings.totalRow.cardBorderWidth,
        cardCornerRadius: settings.totalRow.cardCornerRadius,
        showDivider: settings.totalRow.showDivider,
        dividerColor: fill(settings.totalRow.dividerColor),
        dividerSpacing: settings.totalRow.dividerSpacing,
        includeHiddenBlankCategories: settings.totalRow.includeHiddenBlankCategories
      };
    case "additionalRows":
      return {
        show: settings.additionalRows.show,
        showTotals: settings.additionalRows.showTotals,
        labelFontFamily: settings.additionalRows.labelFontFamily,
        labelFontSize: settings.additionalRows.labelFontSize,
        labelFontColor: fill(settings.additionalRows.labelFontColor),
        labelBold: settings.additionalRows.labelBold,
        labelItalic: settings.additionalRows.labelItalic,
        labelAlignment: settings.additionalRows.labelAlignment,
        labelPaddingLeft: settings.additionalRows.labelPaddingLeft,
        labelPaddingRight: settings.additionalRows.labelPaddingRight,
        valueFontFamily: settings.additionalRows.valueFontFamily,
        valueFontSize: settings.additionalRows.valueFontSize,
        valueFontColor: fill(settings.additionalRows.valueFontColor),
        valueBold: settings.additionalRows.valueBold,
        valueItalic: settings.additionalRows.valueItalic,
        cellBackgroundShow: settings.additionalRows.cellBackgroundShow,
        cellBackgroundColor: fill(settings.additionalRows.cellBackgroundColor),
        cellBorderColor: fill(settings.additionalRows.cellBorderColor),
        cellBorderWidth: settings.additionalRows.cellBorderWidth
      };
    case "additionalRowHeaderMarker":
      return {
        show: settings.additionalRows.markerShow,
        shapeType: settings.additionalRows.markerShape,
        size: settings.additionalRows.markerSize,
        fillColor: fill(settings.additionalRows.markerColor),
        borderColor: fill(settings.additionalRows.markerBorderColor),
        borderWidth: settings.additionalRows.markerBorderWidth,
        opacity: settings.additionalRows.markerOpacity,
        textGap: settings.additionalRows.markerTextGap,
        position: settings.additionalRows.markerPosition,
        layout: settings.additionalRows.markerLayout
      };
    case "topFilters":
      return {
        show: settings.topFilters.show,
        showFilterOne: settings.topFilters.showFilterOne,
        showFilterTwo: settings.topFilters.showFilterTwo,
        filterOneLabel: settings.topFilters.filterOneLabel,
        filterTwoLabel: settings.topFilters.filterTwoLabel,
        controlStyle: settings.topFilters.controlStyle,
        filterOneControlStyle: settings.topFilters.filterOneControlStyle,
        filterTwoControlStyle: settings.topFilters.filterTwoControlStyle,
        alignment: settings.topFilters.alignment,
        fontFamily: settings.topFilters.fontFamily,
        fontSize: settings.topFilters.fontSize,
        labelColor: fill(settings.topFilters.labelColor),
        valueColor: fill(settings.topFilters.valueColor),
        checkboxBackgroundColor: fill(settings.topFilters.checkboxBackgroundColor),
        checkboxTickColor: fill(settings.topFilters.checkboxTickColor),
        backgroundColor: fill(settings.topFilters.backgroundColor),
        borderColor: fill(settings.topFilters.borderColor),
        borderWidth: settings.topFilters.borderWidth,
        cornerRadius: settings.topFilters.cornerRadius,
        paddingTop: settings.topFilters.paddingTop,
        paddingRight: settings.topFilters.paddingRight,
        paddingBottom: settings.topFilters.paddingBottom,
        paddingLeft: settings.topFilters.paddingLeft,
        itemGap: settings.topFilters.itemGap
      };
    case "filterOneStyle":
      return topFilterStyleProperties(settings.topFilters.filterOneStyle);
    case "filterTwoStyle":
      return topFilterStyleProperties(settings.topFilters.filterTwoStyle);
    case "categoryShape":
      return {
        show: settings.categoryShape.show,
        shapeType: settings.categoryShape.shapeType,
        size: settings.categoryShape.size,
        borderColor: fill(settings.categoryShape.borderColor),
        borderWidth: settings.categoryShape.borderWidth,
        opacity: settings.categoryShape.opacity,
        position: settings.categoryShape.position,
        layout: settings.categoryShape.layout
      };
    case "conditionalFormatting":
      return {
        enabled: settings.conditionalFormatting.enabled,
        applyTo: settings.conditionalFormatting.applyTo,
        formatMode: settings.conditionalFormatting.formatMode,
        rule1Threshold: settings.conditionalFormatting.rules[0].threshold,
        rule1Operator: settings.conditionalFormatting.rules[0].operator,
        rule1Color: fill(settings.conditionalFormatting.rules[0].color),
        rule1Bold: settings.conditionalFormatting.rules[0].bold,
        rule1FontSize: settings.conditionalFormatting.rules[0].fontSize,
        rule2Threshold: settings.conditionalFormatting.rules[1].threshold,
        rule2Operator: settings.conditionalFormatting.rules[1].operator,
        rule2Color: fill(settings.conditionalFormatting.rules[1].color),
        rule2Bold: settings.conditionalFormatting.rules[1].bold,
        rule2FontSize: settings.conditionalFormatting.rules[1].fontSize,
        rule3Threshold: settings.conditionalFormatting.rules[2].threshold,
        rule3Operator: settings.conditionalFormatting.rules[2].operator,
        rule3Color: fill(settings.conditionalFormatting.rules[2].color),
        rule3Bold: settings.conditionalFormatting.rules[2].bold,
        rule3FontSize: settings.conditionalFormatting.rules[2].fontSize,
        gradientLowColor: fill(settings.conditionalFormatting.gradientLowColor),
        gradientHighColor: fill(settings.conditionalFormatting.gradientHighColor),
        applyToTotalRow: settings.conditionalFormatting.applyToTotalRow,
        applyToBlanks: settings.conditionalFormatting.applyToBlanks
      };
    case "referenceLine":
      return {
        show: settings.referenceLine.show,
        lineColor: fill(settings.referenceLine.lineColor),
        lineWidth: settings.referenceLine.lineWidth,
        lineStyle: settings.referenceLine.lineStyle,
        showMarkers: settings.referenceLine.showMarkers,
        markerShape: settings.referenceLine.markerShape,
        markerSize: settings.referenceLine.markerSize,
        markerColor: fill(settings.referenceLine.markerColor),
        markerBorderColor: fill(settings.referenceLine.markerBorderColor),
        markerBorderWidth: settings.referenceLine.markerBorderWidth,
        showDataLabels: settings.referenceLine.showDataLabels,
        showLabel: settings.referenceLine.showLabel,
        labelText: settings.referenceLine.labelText,
        labelColor: fill(settings.referenceLine.labelColor),
        labelFontSize: settings.referenceLine.labelFontSize,
        labelBackgroundShow: settings.referenceLine.labelBackgroundShow,
        labelBackgroundColor: fill(settings.referenceLine.labelBackgroundColor),
        labelBackgroundTransparency: settings.referenceLine.labelBackgroundTransparency
      };
    default:
      return undefined;
  }
}

function fill(colorValue: string): { solid: { color: string } } {
  return { solid: { color: colorValue } };
}

function topFilterStyleProperties(style: TopFilterStyleSettings): Record<string, unknown> {
  return {
    fontFamily: style.fontFamily,
    fontSize: style.fontSize,
    labelColor: fill(style.labelColor),
    valueColor: fill(style.valueColor),
    controlBackgroundColor: fill(style.controlBackgroundColor),
    checkboxBackgroundColor: fill(style.checkboxBackgroundColor),
    checkboxTickColor: fill(style.checkboxTickColor),
    borderColor: fill(style.borderColor),
    borderWidth: style.borderWidth,
    cornerRadius: style.cornerRadius,
    itemGap: style.itemGap
  };
}

function parseTopFilterStyle(objects: any, objectName: string, defaults: TopFilterStyleSettings): TopFilterStyleSettings {
  const legacyFontFamily = getObjectValue(objects, "topFilters", "fontFamily", defaults.fontFamily);
  const legacyFontSize = clamp(getObjectValue(objects, "topFilters", "fontSize", defaults.fontSize), 8, 24);
  const legacyLabelColor = getFillColor(objects, "topFilters", "labelColor", defaults.labelColor);
  const legacyValueColor = getFillColor(objects, "topFilters", "valueColor", defaults.valueColor);
  const legacyBackgroundColor = getFillColor(objects, "topFilters", "backgroundColor", defaults.controlBackgroundColor);
  const legacyCheckboxBackground = getFillColor(objects, "topFilters", "checkboxBackgroundColor", defaults.checkboxBackgroundColor);
  const legacyCheckboxTick = getFillColor(objects, "topFilters", "checkboxTickColor", defaults.checkboxTickColor);
  const legacyBorderColor = getFillColor(objects, "topFilters", "borderColor", defaults.borderColor);
  const legacyBorderWidth = clamp(getObjectValue(objects, "topFilters", "borderWidth", defaults.borderWidth), 0, 8);
  const legacyCornerRadius = clamp(getObjectValue(objects, "topFilters", "cornerRadius", defaults.cornerRadius), 0, 16);
  const legacyItemGap = clamp(getObjectValue(objects, "topFilters", "itemGap", defaults.itemGap), 0, 40);

  return {
    fontFamily: getObjectValue(objects, objectName, "fontFamily", legacyFontFamily),
    fontSize: clamp(getObjectValue(objects, objectName, "fontSize", legacyFontSize), 8, 24),
    labelColor: getFillColor(objects, objectName, "labelColor", legacyLabelColor),
    valueColor: getFillColor(objects, objectName, "valueColor", legacyValueColor),
    controlBackgroundColor: getFillColor(objects, objectName, "controlBackgroundColor", legacyBackgroundColor),
    checkboxBackgroundColor: getFillColor(objects, objectName, "checkboxBackgroundColor", legacyCheckboxBackground),
    checkboxTickColor: getFillColor(objects, objectName, "checkboxTickColor", legacyCheckboxTick),
    borderColor: getFillColor(objects, objectName, "borderColor", legacyBorderColor),
    borderWidth: clamp(getObjectValue(objects, objectName, "borderWidth", legacyBorderWidth), 0, 8),
    cornerRadius: clamp(getObjectValue(objects, objectName, "cornerRadius", legacyCornerRadius), 0, 16),
    itemGap: clamp(getObjectValue(objects, objectName, "itemGap", legacyItemGap), 0, 40)
  };
}

export function getObjectValue<T>(objects: any, objectName: string, propertyName: string, defaultValue: T): T {
  const object = objects?.[objectName];
  const value = object?.[propertyName];
  return value === undefined || value === null ? defaultValue : (value as T);
}

export function getFillColor(objects: any, objectName: string, propertyName: string, defaultColor: string): string {
  const value = objects?.[objectName]?.[propertyName];
  if (typeof value === "string") {
    return value;
  }

  const candidate = value?.solid?.color || value?.color || value?.value;
  return typeof candidate === "string" ? candidate : defaultColor;
}

export function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) {
    return min;
  }

  return Math.min(max, Math.max(min, value));
}

function card(objectName: string, displayName: string, slices: any[]): any {
  return {
    uid: `${objectName}Card`,
    displayName,
    visible: true,
    analyticsPane: false,
    groups: [
      {
        uid: `${objectName}Group`,
        displayName,
        visible: true,
        slices
      }
    ],
    revertToDefaultDescriptors: slices.map((slice) => slice.control.properties.descriptor)
  };
}

function groupedCard(objectName: string, displayName: string, groups: Array<{ displayName: string; slices: any[] }>): any {
  const allSlices = groups.flatMap((group) => group.slices);
  return {
    uid: `${objectName}Card`,
    displayName,
    visible: true,
    analyticsPane: false,
    groups: groups.map((group, index) => ({
      uid: `${objectName}Group${index}`,
      displayName: group.displayName,
      visible: true,
      slices: group.slices
    })),
    revertToDefaultDescriptors: allSlices.map((slice) => slice.control.properties.descriptor)
  };
}

function slice(objectName: string, propertyName: string, displayName: string, type: any, value: any, extra: Record<string, unknown> = {}): any {
  return {
    uid: `${objectName}_${propertyName}`,
    displayName,
    visible: true,
    control: {
      type,
      properties: {
        descriptor: { objectName, propertyName },
        value,
        ...extra
      }
    }
  };
}

function toggle(objectName: string, propertyName: string, displayName: string, value: boolean): any {
  return slice(objectName, propertyName, displayName, TOGGLE, value);
}

function numeric(objectName: string, propertyName: string, displayName: string, value: number): any {
  return slice(objectName, propertyName, displayName, NUMERIC, value);
}

function text(objectName: string, propertyName: string, displayName: string, value: string): any {
  return slice(objectName, propertyName, displayName, TEXT, value, { placeholder: "" });
}

function color(objectName: string, propertyName: string, displayName: string, value: string): any {
  return slice(objectName, propertyName, displayName, COLOR, { value }, {
    descriptor: { objectName, propertyName, instanceKind: COLOR_INSTANCE_KIND }
  });
}

function seriesColorCard(series: SeriesColorContext): any {
  const slices = series.map((item, index) => categoryColorSlice(item, index));
  return {
    uid: "seriesColorsCard",
    displayName: "Series colors",
    visible: slices.length > 0,
    analyticsPane: false,
    groups: [
      {
        uid: "seriesColorsGroup",
        displayName: "Series colors",
        visible: true,
        slices
      }
    ],
    revertToDefaultDescriptors: slices.map((slice) => slice.control.properties.descriptor)
  };
}

function topFiltersCard(settings: VisualSettings): any {
  return groupedCard("topFilters", "Top filters", [
    {
      displayName: "General",
      slices: [
        toggle("topFilters", "show", "Show top filters", settings.topFilters.show),
        toggle("topFilters", "showFilterOne", "Show Filter 1", settings.topFilters.showFilterOne),
        toggle("topFilters", "showFilterTwo", "Show Filter 2", settings.topFilters.showFilterTwo),
        dropdown("topFilters", "alignment", "Alignment", settings.topFilters.alignment, alignmentItems()),
        color("topFilters", "backgroundColor", "Filter strip background color", settings.topFilters.backgroundColor),
        color("topFilters", "borderColor", "Filter strip border color", settings.topFilters.borderColor),
        numeric("topFilters", "borderWidth", "Filter strip border width", settings.topFilters.borderWidth),
        numeric("topFilters", "cornerRadius", "Filter strip corner radius", settings.topFilters.cornerRadius),
        numeric("topFilters", "paddingTop", "Padding top", settings.topFilters.paddingTop),
        numeric("topFilters", "paddingRight", "Padding right", settings.topFilters.paddingRight),
        numeric("topFilters", "paddingBottom", "Padding bottom", settings.topFilters.paddingBottom),
        numeric("topFilters", "paddingLeft", "Padding left", settings.topFilters.paddingLeft),
        numeric("topFilters", "itemGap", "Space between filters", settings.topFilters.itemGap)
      ]
    },
    {
      displayName: "Filter 1",
      slices: [
        text("topFilters", "filterOneLabel", "Filter name", settings.topFilters.filterOneLabel),
        dropdown("topFilters", "filterOneControlStyle", "Control style", settings.topFilters.filterOneControlStyle, filterStyleItems()),
        ...topFilterStyleSlices("filterOneStyle", settings.topFilters.filterOneStyle)
      ]
    },
    {
      displayName: "Filter 2",
      slices: [
        text("topFilters", "filterTwoLabel", "Filter name", settings.topFilters.filterTwoLabel),
        dropdown("topFilters", "filterTwoControlStyle", "Control style", settings.topFilters.filterTwoControlStyle, filterStyleItems()),
        ...topFilterStyleSlices("filterTwoStyle", settings.topFilters.filterTwoStyle)
      ]
    }
  ]);
}

function topFilterStyleSlices(objectName: string, style: TopFilterStyleSettings): any[] {
  return [
    fontFamily(objectName, "fontFamily", "Font family", style.fontFamily),
    numeric(objectName, "fontSize", "Font size", style.fontSize),
    color(objectName, "labelColor", "Filter name color", style.labelColor),
    color(objectName, "valueColor", "Filter value color", style.valueColor),
    color(objectName, "controlBackgroundColor", "Control background color", style.controlBackgroundColor),
    color(objectName, "borderColor", "Control border color", style.borderColor),
    numeric(objectName, "borderWidth", "Control border width", style.borderWidth),
    numeric(objectName, "cornerRadius", "Control corner radius", style.cornerRadius),
    color(objectName, "checkboxBackgroundColor", "Tick box background color", style.checkboxBackgroundColor),
    color(objectName, "checkboxTickColor", "Tick color", style.checkboxTickColor),
    numeric(objectName, "itemGap", "Label-to-control spacing", style.itemGap)
  ];
}

function additionalRowsCard(settings: VisualSettings, rows: AdditionalRowFormatContext): any {
  const generalSlices = [
    toggle("additionalRows", "show", "Show additional rows", settings.additionalRows.show),
    toggle("additionalRows", "showTotals", "Show row totals", settings.additionalRows.showTotals)
  ];
  const labelSlices = [
    fontFamily("additionalRows", "labelFontFamily", "Font family", settings.additionalRows.labelFontFamily),
    numeric("additionalRows", "labelFontSize", "Label font size", settings.additionalRows.labelFontSize),
    color("additionalRows", "labelFontColor", "Label font color", settings.additionalRows.labelFontColor),
    toggle("additionalRows", "labelBold", "Label bold", settings.additionalRows.labelBold),
    toggle("additionalRows", "labelItalic", "Label italic", settings.additionalRows.labelItalic),
    dropdown("additionalRows", "labelAlignment", "Label alignment", settings.additionalRows.labelAlignment, alignmentItems()),
    numeric("additionalRows", "labelPaddingLeft", "Label padding left", settings.additionalRows.labelPaddingLeft),
    numeric("additionalRows", "labelPaddingRight", "Label padding right", settings.additionalRows.labelPaddingRight)
  ];
  const valueSlices = [
    fontFamily("additionalRows", "valueFontFamily", "Font family", settings.additionalRows.valueFontFamily),
    numeric("additionalRows", "valueFontSize", "Value font size", settings.additionalRows.valueFontSize),
    color("additionalRows", "valueFontColor", "Value font color", settings.additionalRows.valueFontColor),
    toggle("additionalRows", "valueBold", "Value bold", settings.additionalRows.valueBold),
    toggle("additionalRows", "valueItalic", "Value italic", settings.additionalRows.valueItalic),
    toggle("additionalRows", "cellBackgroundShow", "Show cell background", settings.additionalRows.cellBackgroundShow),
    color("additionalRows", "cellBackgroundColor", "Cell background color", settings.additionalRows.cellBackgroundColor),
    color("additionalRows", "cellBorderColor", "Cell border color", settings.additionalRows.cellBorderColor),
    numeric("additionalRows", "cellBorderWidth", "Cell border width", settings.additionalRows.cellBorderWidth)
  ];
  const markerSlices = [
    toggle("additionalRowHeaderMarker", "show", "Show marker", settings.additionalRows.markerShow),
    dropdown("additionalRowHeaderMarker", "shapeType", "Marker shape", settings.additionalRows.markerShape, shapeItems(true)),
    numeric("additionalRowHeaderMarker", "size", "Marker size", settings.additionalRows.markerSize),
    color("additionalRowHeaderMarker", "fillColor", "Marker color", settings.additionalRows.markerColor),
    color("additionalRowHeaderMarker", "borderColor", "Marker border color", settings.additionalRows.markerBorderColor),
    numeric("additionalRowHeaderMarker", "borderWidth", "Marker border width", settings.additionalRows.markerBorderWidth),
    numeric("additionalRowHeaderMarker", "opacity", "Marker opacity", settings.additionalRows.markerOpacity),
    numeric("additionalRowHeaderMarker", "textGap", "Marker-to-text spacing", settings.additionalRows.markerTextGap),
    dropdown("additionalRowHeaderMarker", "position", "Marker position", settings.additionalRows.markerPosition, [item("Before label", "before"), item("After label", "after")]),
    dropdown("additionalRowHeaderMarker", "layout", "Marker layout", settings.additionalRows.markerLayout, [item("Inline", "inline"), item("Opposite edge", "edge")])
  ];
  const perMeasureSlices = rows.flatMap((row) => additionalRowMeasureSlices(row));
  const groups = [
    {
      uid: "additionalRowsGeneralGroup",
      displayName: "General",
      visible: true,
      slices: generalSlices
    },
    {
      uid: "additionalRowsLabelsGroup",
      displayName: "Row labels",
      visible: true,
      slices: labelSlices
    },
    {
      uid: "additionalRowsHeaderMarkerGroup",
      displayName: "Header marker",
      visible: true,
      slices: markerSlices
    },
    {
      uid: "additionalRowsValuesGroup",
      displayName: "Values",
      visible: true,
      slices: valueSlices
    },
    {
      uid: "additionalRowsPerMeasureGroup",
      displayName: "Per-measure formatting",
      visible: perMeasureSlices.length > 0,
      slices: perMeasureSlices
    }
  ];
  const visibleGroups = groups.filter((group) => group.visible);
  const descriptors = visibleGroups.flatMap((group) => group.slices.map((slice) => slice.control.properties.descriptor));

  return {
    uid: "additionalRowsCard",
    displayName: "Additional rows",
    visible: true,
    analyticsPane: false,
    groups: visibleGroups,
    revertToDefaultDescriptors: descriptors
  };
}

function additionalRowMeasureSlices(row: AdditionalRowFormatContext[number]): any[] {
  const labelPrefix = row.label ? `${row.label} ` : "";
  return [
    additionalRowFormatSlice(row, "labelFontFamily", `${labelPrefix}label font family`, DROPDOWN, FONT_FAMILY_ITEMS.find((entry) => entry.value === (row.formatting.labelFontFamily ?? DEFAULT_SETTINGS.additionalRows.labelFontFamily)) || FONT_FAMILY_ITEMS[0], { items: FONT_FAMILY_ITEMS }),
    additionalRowFormatSlice(row, "labelFontSize", `${labelPrefix}label font size`, NUMERIC, row.formatting.labelFontSize ?? DEFAULT_SETTINGS.additionalRows.labelFontSize),
    additionalRowFormatSlice(row, "labelFontColor", `${labelPrefix}label font color`, COLOR, { value: row.formatting.labelFontColor ?? DEFAULT_SETTINGS.additionalRows.labelFontColor }, { instanceKind: COLOR_INSTANCE_KIND }),
    additionalRowFormatSlice(row, "labelBold", `${labelPrefix}label bold`, TOGGLE, row.formatting.labelBold ?? DEFAULT_SETTINGS.additionalRows.labelBold),
    additionalRowFormatSlice(row, "labelItalic", `${labelPrefix}label italic`, TOGGLE, row.formatting.labelItalic ?? DEFAULT_SETTINGS.additionalRows.labelItalic),
    additionalRowFormatSlice(row, "markerShape", `${labelPrefix}marker shape`, DROPDOWN, shapeItems(true).find((entry) => entry.value === (row.formatting.markerShape ?? DEFAULT_SETTINGS.additionalRows.markerShape)) || shapeItems(true)[0], { items: shapeItems(true) }),
    additionalRowFormatSlice(row, "markerSize", `${labelPrefix}marker size`, NUMERIC, row.formatting.markerSize ?? DEFAULT_SETTINGS.additionalRows.markerSize),
    additionalRowFormatSlice(row, "markerColor", `${labelPrefix}marker color`, COLOR, { value: row.formatting.markerColor ?? DEFAULT_SETTINGS.additionalRows.markerColor }, { instanceKind: COLOR_INSTANCE_KIND }),
    additionalRowFormatSlice(row, "valueFontFamily", `${labelPrefix}value font family`, DROPDOWN, FONT_FAMILY_ITEMS.find((entry) => entry.value === (row.formatting.valueFontFamily ?? DEFAULT_SETTINGS.additionalRows.valueFontFamily)) || FONT_FAMILY_ITEMS[0], { items: FONT_FAMILY_ITEMS }),
    additionalRowFormatSlice(row, "valueFontSize", `${labelPrefix}value font size`, NUMERIC, row.formatting.valueFontSize ?? DEFAULT_SETTINGS.additionalRows.valueFontSize),
    additionalRowFormatSlice(row, "valueFontColor", `${labelPrefix}value font color`, COLOR, { value: row.formatting.valueFontColor ?? DEFAULT_SETTINGS.additionalRows.valueFontColor }, { instanceKind: COLOR_INSTANCE_KIND }),
    additionalRowFormatSlice(row, "valueBold", `${labelPrefix}value bold`, TOGGLE, row.formatting.valueBold ?? DEFAULT_SETTINGS.additionalRows.valueBold),
    additionalRowFormatSlice(row, "valueItalic", `${labelPrefix}value italic`, TOGGLE, row.formatting.valueItalic ?? DEFAULT_SETTINGS.additionalRows.valueItalic)
  ];
}

function additionalRowFormatSlice(row: AdditionalRowFormatContext[number], propertyName: string, displayName: string, type: any, value: any, extra: { items?: any[]; instanceKind?: number } = {}): any {
  const descriptor: any = {
    objectName: "additionalRowFormat",
    propertyName,
    selector: metadataSelector(row.queryName)
  };

  if (extra.instanceKind !== undefined) {
    descriptor.instanceKind = extra.instanceKind;
  }

  const properties: Record<string, unknown> = {
    descriptor,
    value
  };

  if (extra.items) {
    properties.items = extra.items;
  }

  return {
    uid: `additionalRowFormat_${propertyName}_${sanitizeUid(row.queryName || row.label)}`,
    displayName,
    visible: true,
    control: {
      type,
      properties
    }
  };
}

function metadataSelector(queryName: string): any {
  return queryName ? { metadata: queryName } : dataViewWildcard.createDataViewWildcardSelector(0);
}

function categoryColorSlice(series: { category: string; color: string; selectionId?: any }, index: number): any {
  const selector = series.selectionId?.getSelector?.() || dataViewWildcard.createDataViewWildcardSelector(0);
  const descriptor: any = {
    objectName: "categoryColor",
    propertyName: "fill",
    selector,
    instanceKind: CATEGORY_COLOR_INSTANCE_KIND
  };
  const altConstantValueSelector = series.selectionId?.getSelector?.();
  if (altConstantValueSelector) {
    descriptor.altConstantValueSelector = altConstantValueSelector;
  }

  return {
    uid: `categoryColor_fill_${index}_${sanitizeUid(series.category)}`,
    displayName: series.category,
    visible: true,
    control: {
      type: COLOR,
      properties: {
        descriptor,
        value: { value: series.color }
      }
    }
  };
}

function dropdown(objectName: string, propertyName: string, displayName: string, value: string, items: any[]): any {
  return slice(objectName, propertyName, displayName, DROPDOWN, items.find((entry) => entry.value === value) || items[0], { items });
}

function fontFamily(objectName: string, propertyName: string, displayName: string, value: string): any {
  return dropdown(objectName, propertyName, displayName, value, FONT_FAMILY_ITEMS);
}

function item(displayName: string, value: string): any {
  return { displayName, value };
}

function alignmentItems(): any[] {
  return [item("Left", "left"), item("Center", "center"), item("Right", "right")];
}

function verticalAlignmentItems(): any[] {
  return [item("Top", "top"), item("Middle", "middle"), item("Bottom", "bottom")];
}

function chartLabelPositionItems(): any[] {
  return [
    item("Auto", "auto"),
    item("Inside marker", "insideMarker"),
    item("Above", "above"),
    item("Below", "below"),
    item("Left", "left"),
    item("Right", "right")
  ];
}

function filterStyleItems(): any[] {
  return [
    item("Auto", "auto"),
    item("Dropdown", "dropdown"),
    item("Checkbox", "checkbox"),
    item("Bullet", "bullet"),
    item("Timeline", "timeline")
  ];
}

function shapeItems(includeLineAndNone: boolean): any[] {
  const base = [
    item("Circle", "circle"),
    item("Square", "square"),
    item("Rectangle", "rectangle"),
    item("Line", "line"),
    item("Diamond", "diamond"),
    item("Triangle", "triangle"),
    item("Plus", "plus"),
    item("Cross", "cross"),
    item("Star", "star"),
    item("Pentagon", "pentagon"),
    item("Hexagon", "hexagon")
  ];
  return includeLineAndNone ? [...base, item("None", "none")] : base;
}

function sanitizeUid(value: string): string {
  return value.replace(/[^a-z0-9]/gi, "_").slice(0, 48) || "category";
}

function normalizeShape(value: unknown, fallback: ShapeType): ShapeType {
  const shape = typeof value === "string" ? value : fallback;
  if (shape === "icon") {
    return "square";
  }

  return shapeItems(true).some((entry) => entry.value === shape) ? shape as ShapeType : fallback;
}

function ruleSlices(index: number, rule: ConditionalRuleSettings): any[] {
  return [
    numeric("conditionalFormatting", `rule${index}Threshold`, `Rule ${index} threshold`, rule.threshold),
    dropdown("conditionalFormatting", `rule${index}Operator`, `Rule ${index} operator`, rule.operator, [item(">=", ">="), item(">", ">"), item("<=", "<="), item("<", "<"), item("=", "=")]),
    color("conditionalFormatting", `rule${index}Color`, `Rule ${index} color`, rule.color),
    toggle("conditionalFormatting", `rule${index}Bold`, `Rule ${index} bold`, rule.bold),
    numeric("conditionalFormatting", `rule${index}FontSize`, `Rule ${index} font size`, rule.fontSize)
  ];
}
