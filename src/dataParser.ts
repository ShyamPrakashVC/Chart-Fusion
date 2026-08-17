import type powerbi from "powerbi-visuals-api";
import { getFillColor, getObjectValue, ShapeType, VisualSettings } from "./settings";

type DataView = powerbi.DataView;

export interface TooltipItem {
  displayName: string;
  value: string;
}

export interface TrendPoint {
  x: string;
  xRaw: powerbi.PrimitiveValue;
  xIndex: number;
  sourceXIndex: number;
  category: string;
  categoryRaw: powerbi.PrimitiveValue;
  categoryIndex: number;
  value: number | null;
  highlight: number | null;
  tooltipItems: TooltipItem[];
  selectionId?: any;
}

export interface TrendSeries {
  category: string;
  categoryRaw: powerbi.PrimitiveValue;
  categoryIndex: number;
  color: string;
  values: TrendPoint[];
  selectionId?: any;
}

export interface TrendTotalPoint {
  x: string;
  xRaw: powerbi.PrimitiveValue;
  xIndex: number;
  value: number | null;
}

export interface ReferenceLinePoint {
  x: string;
  xRaw: powerbi.PrimitiveValue;
  xIndex: number;
  value: number | null;
}

export interface ReferenceLineModel {
  displayName: string;
  format?: string;
  values: ReferenceLinePoint[];
}

export interface AdditionalRowPoint {
  x: string;
  xRaw: powerbi.PrimitiveValue;
  xIndex: number;
  value: number | null;
}

export interface AdditionalRowSeries {
  label: string;
  queryName: string;
  format?: string;
  formatting: AdditionalRowMeasureFormatting;
  values: AdditionalRowPoint[];
}

export interface AdditionalRowMeasureFormatting {
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

export type TopFilterRole = "filterOne" | "filterTwo";
export type TopFilterControlKind = "buttons" | "dropdown" | "timeline";

export interface TopFilterOption {
  key: string;
  label: string;
  raw: powerbi.PrimitiveValue;
  sourceIndex: number;
  sortValue?: number;
}

export interface TopFilterDefinition {
  role: TopFilterRole;
  displayName: string;
  controlKind: TopFilterControlKind;
  options: TopFilterOption[];
}

export interface TopFilterSelection {
  selectedKeys?: string[];
}

export type TopFilterState = Partial<Record<TopFilterRole, TopFilterSelection>>;

export interface TrendDataModel {
  xValues: string[];
  xRawValues: powerbi.PrimitiveValue[];
  series: TrendSeries[];
  totals: TrendTotalPoint[];
  additionalRows: AdditionalRowSeries[];
  filters: TopFilterDefinition[];
  referenceLine: ReferenceLineModel | null;
  measureName: string;
  measureFormat?: string;
  dynamicYAxisStart: number | null;
  dynamicYAxisEnd: number | null;
  xAxisName: string;
  categoryName: string;
  hasHighlights: boolean;
  minValue: number;
  maxValue: number;
  warnings: string[];
  notices: string[];
}

const BLANK_LABEL = "(Blank)";
export const MAX_X_CATEGORIES = 100;
export const MAX_SERIES = 60;
const MAX_RUNTIME_ROWS = 5000;
const MAX_FILTER_OPTIONS = 100;

const PALETTES: Record<string, string[]> = {
  powerbi: ["#118dff", "#12239e", "#e66c37", "#6b007b", "#e044a7", "#744ec2", "#d9b300", "#d64550", "#197278", "#1aab40"],
  accessible: ["#005a9e", "#a4262c", "#107c10", "#5c2d91", "#986f0b", "#004b50", "#8e562e", "#323130", "#c239b3", "#69797e"],
  vivid: ["#0078d4", "#ffb900", "#bad80a", "#e3008c", "#00b7c3", "#8e8cd8", "#ff8c00", "#498205", "#b146c2", "#038387"]
};

interface CategoryEntry {
  key: string;
  label: string;
  raw: powerbi.PrimitiveValue;
  sourceIndex: number;
  sortValue?: number;
}

interface FilterColumnInfo {
  role: TopFilterRole;
  column: powerbi.DataViewCategoryColumn;
  definition: TopFilterDefinition;
}

interface AggregatedPoint {
  value: number | null;
  highlight: number | null;
  sourceXIndex: number;
  tooltipItems: TooltipItem[];
}

interface AggregatedReferencePoint {
  sum: number;
  count: number;
}

interface AdditionalRowAggregation {
  sum: number;
  count: number;
}

export function parseDataView(
  dataView: DataView | undefined,
  settings: VisualSettings,
  getThemeColor?: (category: string, index: number) => string | undefined,
  filterState: TopFilterState = {}
): TrendDataModel {
  const categorical = dataView?.categorical;
  const xColumn = findCategoryColumn(categorical, "xAxis") || categorical?.categories?.[0];
  const allGroupedValues = categorical?.values?.grouped?.() || [];
  const groupedValues = allGroupedValues.slice(0, MAX_SERIES);
  const warnings: string[] = [];
  const notices: string[] = [];

  if (!categorical || !xColumn || !categorical.values) {
    warnings.push("Add fields to X-axis, Y-axis / Category, and Values.");
    return emptyModel(warnings, notices);
  }

  const sourceRowCount = xColumn.values?.length || 0;
  const runtimeRowIndices = rowIndices(xColumn.values || [], MAX_RUNTIME_ROWS);
  const filterColumns = topFilterColumns(categorical, MAX_RUNTIME_ROWS);
  const filters = filterColumns.map((filter) => filter.definition);
  const selectedFilterKeys = filterSelectionSets(filterState);
  const filteredRowIndices = runtimeRowIndices.filter((index) => rowPassesFilters(filterColumns, selectedFilterKeys, index));
  const availableXEntries = sortedXEntries(uniqueXEntries(xColumn, filteredRowIndices), settings.columnLabels.sortOrder);
  const xEntries = availableXEntries.slice(0, MAX_X_CATEGORIES);
  const selectedXKeys = new Set(xEntries.map((entry) => entry.key));
  const allowedRowIndices = filteredRowIndices.filter((index) => selectedXKeys.has(valueKey(xColumn.values?.[index])));
  const xValues = xEntries.map((entry) => entry.label);
  const xRawValues = xEntries.map((entry) => entry.raw);
  const xIndexByKey = new Map(xEntries.map((entry, index) => [entry.key, index]));
  const measureName = firstMeasureName(groupedValues, "values") || "Values";
  const xAxisName = xColumn.source?.displayName || "X-axis";
  const categoryName = dataView.metadata?.columns?.find((column) => column.roles?.category)?.displayName || "Category";
  const palette = PALETTES[settings.dataColors.defaultPalette] || PALETTES.powerbi;
  const series: TrendSeries[] = [];
  let hasHighlights = false;
  let measureFormat: string | undefined;

  const hostReducedData = Boolean(dataView.metadata?.segment);
  const runtimeReducedData = sourceRowCount > MAX_RUNTIME_ROWS
    || availableXEntries.length > MAX_X_CATEGORIES
    || allGroupedValues.length > MAX_SERIES;
  const reachedReductionLimit = sourceRowCount >= MAX_X_CATEGORIES || allGroupedValues.length >= MAX_SERIES;
  if (hostReducedData || runtimeReducedData || reachedReductionLimit) {
    notices.push(`Large dataset detected. Showing up to the Top ${MAX_X_CATEGORIES} X-axis categories and Top ${MAX_SERIES} series. Apply filters to focus the view.`);
  }

  groupedValues.forEach((group: any, categoryIndex: number) => {
    const measureColumn = findMeasureColumn(group.values);
    if (!measureColumn) {
      return;
    }

    measureFormat ??= measureColumn.source?.format;

    const categoryLabel = formatCategoryValue(group.name);
    const objects = group.objects;
    const persistedColor = settings.dataColors.resetColors ? undefined : getFillColor(objects, "categoryColor", "fill", "");
    const color = persistedColor || getThemeColor?.(categoryLabel, categoryIndex) || palette[categoryIndex % palette.length];
    const tooltipColumns = group.values.filter((column: any) => column !== measureColumn && column?.source?.roles?.tooltips);

    const aggregated = new Map<string, AggregatedPoint>();

    allowedRowIndices.forEach((rowIndex) => {
      const xKey = valueKey(xColumn.values?.[rowIndex]);
      if (!xIndexByKey.has(xKey)) {
        return;
      }

      const value = toNumber(measureColumn.values?.[rowIndex]);
      const highlight = toNumber(measureColumn.highlights?.[rowIndex]);
      const existing = aggregated.get(xKey) || {
        value: null,
        highlight: null,
        sourceXIndex: rowIndex,
        tooltipItems: tooltipColumns.map((column: any) => ({
          displayName: column.source?.displayName || "Tooltip",
          value: formatCategoryValue(column.values?.[rowIndex])
        }))
      };

      if (value !== null) {
        existing.value = (existing.value ?? 0) + value;
      }

      if (highlight !== null) {
        hasHighlights = true;
        existing.highlight = (existing.highlight ?? 0) + highlight;
      }

      aggregated.set(xKey, existing);
    });

    const points = xEntries.map((entry, xIndex): TrendPoint => {
      const aggregatedPoint = aggregated.get(entry.key);

      return {
        x: entry.label,
        xRaw: entry.raw,
        xIndex,
        sourceXIndex: aggregatedPoint?.sourceXIndex ?? entry.sourceIndex,
        category: categoryLabel,
        categoryRaw: group.name,
        categoryIndex,
        value: aggregatedPoint?.value ?? null,
        highlight: aggregatedPoint?.highlight ?? null,
        tooltipItems: aggregatedPoint?.tooltipItems ?? []
      };
    });

    series.push({
      category: categoryLabel,
      categoryRaw: group.name,
      categoryIndex,
      color,
      values: points
    });
  });

  if (series.length === 0) {
    warnings.push("The Values field must contain one numeric measure.");
  }

  const totals = xValues.map((x, xIndex) => {
    const value = series.reduce((sum, item) => {
      if (!settings.totalRow.includeHiddenBlankCategories && item.category === BLANK_LABEL) {
        return sum;
      }

      return sum + (item.values[xIndex]?.value ?? 0);
    }, 0);

    return {
      x,
      xRaw: xRawValues[xIndex],
      xIndex,
      value
    };
  });
  const additionalRows = parseAdditionalRows(groupedValues, xColumn, allowedRowIndices, xEntries, settings);
  const referenceLine = parseReferenceLine(groupedValues, xColumn, allowedRowIndices, xEntries);
  const dynamicYAxisStart = dynamicAxisBound(groupedValues, "yAxisMinimum", allowedRowIndices, "minimum");
  const dynamicYAxisEnd = dynamicAxisBound(groupedValues, "yAxisMaximum", allowedRowIndices, "maximum");

  let minValue = 0;
  let maxValue = 0;
  let hasNumericValue = false;
  const includeExtentValue = (value: number | null): void => {
    if (value === null) {
      return;
    }

    hasNumericValue = true;
    minValue = Math.min(minValue, value);
    maxValue = Math.max(maxValue, value);
  };

  series.forEach((item) => item.values.forEach((point) => includeExtentValue(point.highlight ?? point.value)));
  if (settings.referenceLine.show && referenceLine) {
    referenceLine.values.forEach((point) => includeExtentValue(point.value));
  }
  if (!hasNumericValue) {
    maxValue = 1;
  }

  return {
    xValues,
    xRawValues,
    series,
    totals,
    additionalRows,
    filters,
    referenceLine,
    measureName,
    measureFormat,
    dynamicYAxisStart,
    dynamicYAxisEnd,
    xAxisName,
    categoryName,
    hasHighlights,
    minValue,
    maxValue,
    warnings,
    notices
  };
}

function parseAdditionalRows(
  groups: any[],
  xColumn: powerbi.DataViewCategoryColumn,
  allowedRowIndices: number[],
  xEntries: CategoryEntry[],
  settings: VisualSettings
): AdditionalRowSeries[] {
  const additionalColumns = uniqueAdditionalRowColumns(groups);
  if (additionalColumns.length === 0) {
    return [];
  }

  const xKeys = new Set(xEntries.map((entry) => entry.key));
  return additionalColumns.map((column) => {
    const aggregated = new Map<string, AdditionalRowAggregation>();

    groups.forEach((group) => {
      const groupColumn = findMatchingRoleMeasureColumn(group.values, "additionalRowValues", column);
      if (!groupColumn) {
        return;
      }

      allowedRowIndices.forEach((rowIndex) => {
        const xKey = valueKey(xColumn.values?.[rowIndex]);
        if (!xKeys.has(xKey)) {
          return;
        }

        const value = toNumber(groupColumn.values?.[rowIndex]);
        if (value === null) {
          return;
        }

        const existing = aggregated.get(xKey) || { sum: 0, count: 0 };
        existing.sum += value;
        existing.count += 1;
        aggregated.set(xKey, existing);
      });
    });

    return {
      label: column.source?.displayName || "Additional row",
      queryName: measureIdentity(column),
      format: column.source?.format,
      formatting: parseAdditionalRowMeasureFormatting(column, settings),
      values: xEntries.map((entry, xIndex) => ({
        x: entry.label,
        xRaw: entry.raw,
        xIndex,
        value: additionalRowAggregatedValue(aggregated.get(entry.key))
      }))
    };
  });
}

function additionalRowAggregatedValue(point: AdditionalRowAggregation | undefined): number | null {
  if (!point || point.count === 0) {
    return null;
  }

  return point.sum;
}

function parseAdditionalRowMeasureFormatting(column: any, settings: VisualSettings): AdditionalRowMeasureFormatting {
  const objects = column?.source?.objects;
  return {
    labelFontFamily: getObjectValue(objects, "additionalRowFormat", "labelFontFamily", settings.additionalRows.labelFontFamily),
    labelFontSize: getObjectValue(objects, "additionalRowFormat", "labelFontSize", settings.additionalRows.labelFontSize),
    labelFontColor: getFillColor(objects, "additionalRowFormat", "labelFontColor", settings.additionalRows.labelFontColor),
    labelBold: getObjectValue(objects, "additionalRowFormat", "labelBold", settings.additionalRows.labelBold),
    labelItalic: getObjectValue(objects, "additionalRowFormat", "labelItalic", settings.additionalRows.labelItalic),
    markerShape: getObjectValue(objects, "additionalRowFormat", "markerShape", settings.additionalRows.markerShape),
    markerSize: getObjectValue(objects, "additionalRowFormat", "markerSize", settings.additionalRows.markerSize),
    markerColor: getFillColor(objects, "additionalRowFormat", "markerColor", settings.additionalRows.markerColor),
    valueFontFamily: getObjectValue(objects, "additionalRowFormat", "valueFontFamily", settings.additionalRows.valueFontFamily),
    valueFontSize: getObjectValue(objects, "additionalRowFormat", "valueFontSize", settings.additionalRows.valueFontSize),
    valueFontColor: getFillColor(objects, "additionalRowFormat", "valueFontColor", settings.additionalRows.valueFontColor),
    valueBold: getObjectValue(objects, "additionalRowFormat", "valueBold", settings.additionalRows.valueBold),
    valueItalic: getObjectValue(objects, "additionalRowFormat", "valueItalic", settings.additionalRows.valueItalic)
  };
}

function parseReferenceLine(
  groups: any[],
  xColumn: powerbi.DataViewCategoryColumn,
  allowedRowIndices: number[],
  xEntries: CategoryEntry[]
): ReferenceLineModel | null {
  const referenceColumn = firstReferenceLineColumn(groups);
  if (!referenceColumn) {
    return null;
  }

  const xKeys = new Set(xEntries.map((entry) => entry.key));
  const aggregated = new Map<string, AggregatedReferencePoint>();

  // Power BI emits the target measure once per legend group. Reading only the
  // first group creates gaps whenever that series is blank for an x category.
  groups.forEach((group) => {
    const groupReferenceColumn = findMatchingRoleMeasureColumn(group.values, "referenceLine", referenceColumn);
    if (!groupReferenceColumn) {
      return;
    }

    allowedRowIndices.forEach((rowIndex) => {
      const xKey = valueKey(xColumn.values?.[rowIndex]);
      if (!xKeys.has(xKey)) {
        return;
      }

      const value = toNumber(groupReferenceColumn.values?.[rowIndex]);
      if (value === null) {
        return;
      }

      const existing = aggregated.get(xKey) || { sum: 0, count: 0 };
      existing.sum += value;
      existing.count += 1;
      aggregated.set(xKey, existing);
    });
  });

  return {
    displayName: referenceColumn.source?.displayName || "Reference line",
    format: referenceColumn.source?.format,
    values: xEntries.map((entry, xIndex) => {
      const point = aggregated.get(entry.key);
      return {
        x: entry.label,
        xRaw: entry.raw,
        xIndex,
        value: point && point.count > 0 ? point.sum / point.count : null
      };
    })
  };
}

function dynamicAxisBound(groups: any[], roleName: "yAxisMinimum" | "yAxisMaximum", rowIndicesToUse: number[], bound: "minimum" | "maximum"): number | null {
  let result: number | null = null;

  groups.forEach((group) => {
    const column = findRoleMeasureColumn(group.values, roleName);
    if (!column) {
      return;
    }

    rowIndicesToUse.forEach((rowIndex) => {
      const value = toNumber(column.values?.[rowIndex]);
      if (value === null) {
        return;
      }

      result = result === null
        ? value
        : bound === "minimum"
          ? Math.min(result, value)
          : Math.max(result, value);
    });
  });

  return result;
}

function firstReferenceLineColumn(groups: any[]): any {
  for (const group of groups) {
    const referenceColumn = findRoleMeasureColumn(group.values, "referenceLine");
    if (referenceColumn) {
      return referenceColumn;
    }
  }

  return undefined;
}

function uniqueAdditionalRowColumns(groups: any[]): any[] {
  const byName = new Map<string, any>();
  groups.forEach((group) => {
    (group.values || [])
      .filter((column: any) => column?.source?.roles?.additionalRowValues)
      .forEach((column: any) => {
        const key = measureIdentity(column);
        if (!byName.has(key)) {
          byName.set(key, column);
        }
      });
  });

  return Array.from(byName.values());
}

function emptyModel(warnings: string[], notices: string[] = []): TrendDataModel {
  return {
    xValues: [],
    xRawValues: [],
    series: [],
    totals: [],
    additionalRows: [],
    filters: [],
    referenceLine: null,
    measureName: "Values",
    measureFormat: undefined,
    dynamicYAxisStart: null,
    dynamicYAxisEnd: null,
    xAxisName: "X-axis",
    categoryName: "Category",
    hasHighlights: false,
    minValue: 0,
    maxValue: 1,
    warnings,
    notices
  };
}

function findCategoryColumn(categorical: powerbi.DataViewCategorical | undefined, roleName: string): powerbi.DataViewCategoryColumn | undefined {
  return categorical?.categories?.find((column) => Boolean(column.source?.roles?.[roleName]));
}

function topFilterColumns(categorical: powerbi.DataViewCategorical, rowLimit: number): FilterColumnInfo[] {
  return (["filterOne", "filterTwo"] as TopFilterRole[])
    .map((role) => {
      const column = findCategoryColumn(categorical, role);
      if (!column) {
        return undefined;
      }

      const options = uniqueFilterOptions(column, rowLimit);
      return {
        role,
        column,
        definition: {
          role,
          displayName: column.source?.displayName || (role === "filterOne" ? "Filter 1" : "Filter 2"),
          controlKind: inferFilterControl(column.source?.displayName || "", options),
          options
        }
      };
    })
    .filter((item): item is FilterColumnInfo => Boolean(item));
}

function uniqueFilterOptions(column: powerbi.DataViewCategoryColumn, rowLimit: number): TopFilterOption[] {
  const options = new Map<string, TopFilterOption>();
  const values = column.values || [];
  const limit = Math.min(values.length, rowLimit);
  for (let sourceIndex = 0; sourceIndex < limit && options.size < MAX_FILTER_OPTIONS; sourceIndex += 1) {
    const raw = values[sourceIndex];
    const key = valueKey(raw);
    if (!options.has(key)) {
      options.set(key, {
        key,
        label: formatCategoryValue(raw),
        raw,
        sourceIndex,
        sortValue: sortableValue(raw)
      });
    }
  }

  return Array.from(options.values()).sort(compareOptions);
}

function inferFilterControl(displayName: string, options: TopFilterOption[]): TopFilterControlKind {
  const name = displayName.toLowerCase();
  const quarterLike = /quarter|qtr/.test(name) || options.every((option) => /^q[1-4]$/i.test(option.label.trim()));
  const yearLike = /year|fiscal/.test(name);
  const timelineLike = options.length > 8 && options.every((option) => option.sortValue !== undefined);

  if (quarterLike || (!yearLike && options.length > 0 && options.length <= 6)) {
    return "buttons";
  }

  if (timelineLike) {
    return "timeline";
  }

  return "dropdown";
}

function rowIndices(values: powerbi.PrimitiveValue[], limit = values.length): number[] {
  return Array.from({ length: Math.min(values.length, limit) }, (_value, index) => index);
}

type TopFilterSelectionSets = Partial<Record<TopFilterRole, Set<string>>>;

function filterSelectionSets(state: TopFilterState): TopFilterSelectionSets {
  const result: TopFilterSelectionSets = {};
  (["filterOne", "filterTwo"] as TopFilterRole[]).forEach((role) => {
    const selectedKeys = state[role]?.selectedKeys;
    if (selectedKeys) {
      result[role] = new Set(selectedKeys);
    }
  });
  return result;
}

function rowPassesFilters(filters: FilterColumnInfo[], selectedKeysByRole: TopFilterSelectionSets, rowIndex: number): boolean {
  return filters.every((filter) => {
    const selectedKeys = selectedKeysByRole[filter.role];
    if (!selectedKeys) {
      return true;
    }

    if (selectedKeys.size === 0) {
      return false;
    }

    return selectedKeys.has(valueKey(filter.column.values?.[rowIndex]));
  });
}

function uniqueXEntries(column: powerbi.DataViewCategoryColumn, rowIndicesToUse: number[]): CategoryEntry[] {
  const entries = new Map<string, CategoryEntry>();
  rowIndicesToUse.forEach((sourceIndex) => {
    const raw = column.values?.[sourceIndex];
    const key = valueKey(raw);
    if (!entries.has(key)) {
      entries.set(key, {
        key,
        label: formatCategoryValue(raw),
        raw,
        sourceIndex,
        sortValue: sortableValue(raw)
      });
    }
  });

  return Array.from(entries.values());
}

function sortedXEntries(entries: CategoryEntry[], sortOrder: string): CategoryEntry[] {
  if (sortOrder !== "ascending" && sortOrder !== "descending") {
    return entries;
  }

  return [...entries].sort((left, right) => {
    const comparison = compareOptions(left, right);
    return sortOrder === "ascending" ? comparison : -comparison;
  });
}

function firstMeasureName(groups: any[], roleName: string): string | undefined {
  for (const group of groups) {
    const measureColumn = findRoleMeasureColumn(group.values, roleName);
    if (measureColumn?.source?.displayName) {
      return measureColumn.source.displayName;
    }
  }

  return undefined;
}

function findMeasureColumn(values: any[] = []): any {
  return findRoleMeasureColumn(values, "values") || values.find((column) => isNumericColumn(column)
    && !column?.source?.roles?.additionalRowValues
    && !column?.source?.roles?.referenceLine
    && !column?.source?.roles?.yAxisMinimum
    && !column?.source?.roles?.yAxisMaximum
    && !column?.source?.roles?.tooltips);
}

function findRoleMeasureColumn(values: any[] = [], roleName: string): any {
  return values.find((column) => column?.source?.roles?.[roleName]);
}

function findMatchingRoleMeasureColumn(values: any[] = [], roleName: string, referenceColumn: any): any {
  const referenceIdentity = measureIdentity(referenceColumn);
  return values.find((column) => column?.source?.roles?.[roleName] && measureIdentity(column) === referenceIdentity);
}

function measureIdentity(column: any): string {
  return column?.source?.queryName || column?.source?.displayName || "";
}

function isNumericColumn(column: any): boolean {
  return (column?.values || []).some((value: powerbi.PrimitiveValue) => typeof value === "number");
}

function toNumber(value: powerbi.PrimitiveValue | undefined): number | null {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return null;
  }

  return value;
}

function formatCategoryValue(value: powerbi.PrimitiveValue | undefined): string {
  if (value === null || value === undefined || value === "") {
    return BLANK_LABEL;
  }

  if (value instanceof Date) {
    return value.toLocaleDateString();
  }

  return String(value);
}

function valueKey(value: powerbi.PrimitiveValue | undefined): string {
  if (value instanceof Date) {
    return `date:${value.toISOString()}`;
  }

  return `${typeof value}:${String(value ?? "")}`;
}

function sortableValue(value: powerbi.PrimitiveValue | undefined): number | undefined {
  if (value instanceof Date) {
    return value.getTime();
  }

  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    const parsedDate = Date.parse(value);
    if (!Number.isNaN(parsedDate)) {
      return parsedDate;
    }

    const numeric = Number(value.replace(/[^0-9.-]/g, ""));
    if (Number.isFinite(numeric)) {
      return numeric;
    }
  }

  return undefined;
}

function compareOptions(left: { label: string; sortValue?: number }, right: { label: string; sortValue?: number }): number {
  if (left.sortValue !== undefined && right.sortValue !== undefined && left.sortValue !== right.sortValue) {
    return left.sortValue - right.sortValue;
  }

  return left.label.localeCompare(right.label, undefined, { numeric: true, sensitivity: "base" });
}
