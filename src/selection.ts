import type powerbi from "powerbi-visuals-api";
import { TrendDataModel } from "./dataParser";

type DataView = powerbi.DataView;
type IVisualHost = powerbi.extensibility.visual.IVisualHost;

export function attachSelectionIds(host: IVisualHost, dataView: DataView | undefined, model: TrendDataModel): TrendDataModel {
  const categorical = dataView?.categorical;
  const xColumn = categorical?.categories?.[0];
  const groups = categorical?.values?.grouped?.() || [];

  model.series.forEach((series, seriesIndex) => {
    const group = groups[seriesIndex];
    try {
      const categoryBuilder = host.createSelectionIdBuilder();

      if (categorical?.values && group) {
        categoryBuilder.withSeries(categorical.values, group);
      }

      series.selectionId = categoryBuilder.createSelectionId();
    } catch {
      series.selectionId = undefined;
    }

    series.values.forEach((point) => {
      try {
        const pointBuilder = host.createSelectionIdBuilder();

        if (xColumn) {
          pointBuilder.withCategory(xColumn, point.sourceXIndex);
        }

        if (categorical?.values && group) {
          pointBuilder.withSeries(categorical.values, group);
        }

        point.selectionId = pointBuilder.createSelectionId();
      } catch {
        point.selectionId = undefined;
      }
    });
  });

  return model;
}

export function selectionContains(selectedIds: any[], id?: any): boolean {
  if (!id || selectedIds.length === 0) {
    return false;
  }

  return selectedIds.some((selectedId) => {
    if (typeof selectedId?.includes === "function" && selectedId.includes(id)) {
      return true;
    }

    if (typeof id?.includes === "function" && id.includes(selectedId)) {
      return true;
    }

    if (typeof selectedId?.equals === "function" && selectedId.equals(id)) {
      return true;
    }

    return false;
  });
}
