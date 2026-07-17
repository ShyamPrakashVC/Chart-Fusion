import { ValuesSettings } from "./settings";

export function formatValue(value: number | null | undefined, settings: ValuesSettings, sourceFormat?: string): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return settings.blankValueText;
  }

  const formattedWithSource = formatWithSourceFormat(value, settings, sourceFormat);
  if (formattedWithSource !== undefined) {
    return formattedWithSource;
  }

  const { divisor, suffix } = displayUnit(value, settings.displayUnits);
  const scaled = value / divisor;
  const absolute = Math.abs(scaled);
  const fixed = absolute.toFixed(settings.decimalPlaces);
  const withSeparators = settings.thousandSeparator ? addThousands(fixed) : fixed;
  const signed = scaled < 0
    ? settings.negativeValueStyle === "parentheses"
      ? `(${withSeparators})`
      : `-${withSeparators}`
    : withSeparators;

  return `${signed}${suffix}`;
}

export function isPercentageFormat(sourceFormat?: string): boolean {
  return Boolean(sourceFormat && sourceFormat.includes("%"));
}

function formatWithSourceFormat(value: number, settings: ValuesSettings, sourceFormat?: string): string | undefined {
  const format = sourceFormat?.trim();
  if (!format) {
    return undefined;
  }

  if (isPercentageFormat(format)) {
    const decimals = decimalsFromFormat(format);
    return `${formatNumber(value * 100, decimals, settings)}%`;
  }

  const currencySymbol = currencySymbolFromFormat(format);
  if (currencySymbol) {
    return `${currencySymbol}${formatNumber(value, decimalsFromFormat(format), settings)}`;
  }

  if (/[#,]?0(?:\.0+)?/.test(format)) {
    return formatNumber(value, decimalsFromFormat(format), settings);
  }

  return undefined;
}

function formatNumber(value: number, decimalPlaces: number, settings: ValuesSettings): string {
  const absolute = Math.abs(value);
  const fixed = absolute.toFixed(decimalPlaces);
  const withSeparators = settings.thousandSeparator ? addThousands(fixed) : fixed;

  if (value < 0) {
    return settings.negativeValueStyle === "parentheses" ? `(${withSeparators})` : `-${withSeparators}`;
  }

  return withSeparators;
}

function decimalsFromFormat(format: string): number {
  const match = format.match(/\.([0#]+)/);
  if (!match) {
    return 0;
  }

  return Math.min(6, match[1].length);
}

function currencySymbolFromFormat(format: string): string | undefined {
  if (format.includes("$")) {
    return "$";
  }

  if (format.includes("\u20ac")) {
    return "\u20ac";
  }

  if (format.includes("\u00a3")) {
    return "\u00a3";
  }

  if (format.includes("\u20b9")) {
    return "\u20b9";
  }

  return undefined;
}

function displayUnit(value: number, setting: string): { divisor: number; suffix: string } {
  const absolute = Math.abs(value);

  if (setting === "auto") {
    if (absolute >= 1000000000) {
      return { divisor: 1000000000, suffix: "B" };
    }

    if (absolute >= 1000000) {
      return { divisor: 1000000, suffix: "M" };
    }

    if (absolute >= 1000) {
      return { divisor: 1000, suffix: "K" };
    }

    return { divisor: 1, suffix: "" };
  }

  if (setting === "billions") {
    return { divisor: 1000000000, suffix: "B" };
  }

  if (setting === "millions") {
    return { divisor: 1000000, suffix: "M" };
  }

  if (setting === "thousands") {
    return { divisor: 1000, suffix: "K" };
  }

  return { divisor: 1, suffix: "" };
}

function addThousands(value: string): string {
  const [integer, decimal] = value.split(".");
  const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return decimal === undefined ? formattedInteger : `${formattedInteger}.${decimal}`;
}
