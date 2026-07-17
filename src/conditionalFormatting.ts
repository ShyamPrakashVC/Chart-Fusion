import { ConditionalFormattingSettings, ConditionalApplyTo } from "./settings";

export interface ConditionalFormatResult {
  color?: string;
  backgroundColor?: string;
  chartColor?: string;
  shapeColor?: string;
  bold?: boolean;
  fontSize?: number;
}

export function evaluateConditionalFormatting(value: number | null, settings: ConditionalFormattingSettings, minValue: number, maxValue: number, isTotal: boolean): ConditionalFormatResult {
  if (!settings.enabled) {
    return {};
  }

  if (isTotal && !settings.applyToTotalRow) {
    return {};
  }

  if ((value === null || value === undefined || Number.isNaN(value)) && !settings.applyToBlanks) {
    return {};
  }

  const numericValue = value ?? 0;
  const color = settings.formatMode === "gradient"
    ? interpolateColor(settings.gradientLowColor, settings.gradientHighColor, gradientRatio(numericValue, minValue, maxValue))
    : firstMatchingRule(numericValue, settings)?.color;

  const matchedRule = settings.formatMode === "rules" ? firstMatchingRule(numericValue, settings) : undefined;
  const result: ConditionalFormatResult = {
    bold: matchedRule?.bold,
    fontSize: matchedRule?.fontSize
  };

  if (!color) {
    return result;
  }

  if (appliesTo(settings.applyTo, "tableFont", isTotal)) {
    result.color = color;
  }

  if (appliesTo(settings.applyTo, "tableBackground", isTotal)) {
    result.backgroundColor = color;
  }

  if (appliesTo(settings.applyTo, "chart", isTotal)) {
    result.chartColor = color;
  }

  if (appliesTo(settings.applyTo, "shape", isTotal)) {
    result.shapeColor = color;
  }

  return result;
}

function appliesTo(setting: ConditionalApplyTo, target: ConditionalApplyTo, isTotal: boolean): boolean {
  if (isTotal) {
    return setting === "total" || setting === "both" || setting === target;
  }

  return setting === target || setting === "both";
}

function firstMatchingRule(value: number, settings: ConditionalFormattingSettings) {
  return settings.rules.find((rule) => {
    switch (rule.operator) {
      case ">=":
        return value >= rule.threshold;
      case ">":
        return value > rule.threshold;
      case "<=":
        return value <= rule.threshold;
      case "<":
        return value < rule.threshold;
      case "=":
        return value === rule.threshold;
      default:
        return false;
    }
  });
}

function gradientRatio(value: number, minValue: number, maxValue: number): number {
  if (maxValue <= minValue) {
    return 1;
  }

  return Math.max(0, Math.min(1, (value - minValue) / (maxValue - minValue)));
}

function interpolateColor(lowColor: string, highColor: string, ratio: number): string {
  const low = hexToRgb(lowColor);
  const high = hexToRgb(highColor);

  if (!low || !high) {
    return ratio >= 0.5 ? highColor : lowColor;
  }

  const channel = (from: number, to: number) => Math.round(from + (to - from) * ratio);
  return rgbToHex(channel(low.r, high.r), channel(low.g, high.g), channel(low.b, high.b));
}

function hexToRgb(color: string): { r: number; g: number; b: number } | null {
  const normalized = color.replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) {
    return null;
  }

  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16)
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((value) => value.toString(16).padStart(2, "0")).join("")}`;
}
