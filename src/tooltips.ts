import type powerbi from "powerbi-visuals-api";
import { select } from "d3-selection";
import { createTooltipServiceWrapper, ITooltipServiceWrapper } from "powerbi-visuals-utils-tooltiputils";
import { TrendPoint, TrendTotalPoint, TooltipItem } from "./dataParser";

type IVisualHost = powerbi.extensibility.visual.IVisualHost;
type VisualTooltipDataItem = powerbi.extensibility.VisualTooltipDataItem;

interface TooltipDatum {
  tooltipInfo: VisualTooltipDataItem[];
  selectionId?: any;
}

export class TooltipController {
  private tooltipServiceWrapper?: ITooltipServiceWrapper;

  constructor(host: IVisualHost, rootElement: Element) {
    try {
      const tooltipService = (host as any).tooltipService;
      if (tooltipService) {
        this.tooltipServiceWrapper = createTooltipServiceWrapper(tooltipService, rootElement);
      }
    } catch {
      this.tooltipServiceWrapper = undefined;
    }
  }

  public addPointTooltip(element: Element, point: TrendPoint, measureName: string, formattedValue: string): void {
    this.addTooltip(
      element,
      () => [
        { displayName: "X-axis", value: point.x },
        { displayName: "Category", value: point.category },
        { displayName: measureName, value: formattedValue },
        ...point.tooltipItems
      ],
      point.selectionId
    );
  }

  public addTotalTooltip(element: Element, point: TrendTotalPoint, label: string, measureName: string, formattedValue: string): void {
    this.addTooltip(
      element,
      () => [
        { displayName: "X-axis", value: point.x },
        { displayName: "Category", value: label },
        { displayName: measureName, value: formattedValue }
      ],
      undefined
    );
  }

  public addCategoryTooltip(element: Element, category: string, extraItems: TooltipItem[] = [], selectionId?: any): void {
    this.addTooltip(
      element,
      () => [
        { displayName: "Category", value: category },
        ...extraItems
      ],
      selectionId
    );
  }

  private addTooltip(element: Element, getItems: () => VisualTooltipDataItem[], selectionId?: any): void {
    let selection: any;
    try {
      selection = select<Element, TooltipDatum>(element).datum({
        tooltipInfo: getItems(),
        selectionId
      });
    } catch {
      return;
    }

    if (!this.tooltipServiceWrapper) {
      return;
    }

    try {
      this.tooltipServiceWrapper.addTooltip<TooltipDatum>(
        selection,
        (datum: TooltipDatum) => datum.tooltipInfo,
        (datum: TooltipDatum) => datum.selectionId,
        true
      );
    } catch {
      this.tooltipServiceWrapper = undefined;
    }
  }
}
