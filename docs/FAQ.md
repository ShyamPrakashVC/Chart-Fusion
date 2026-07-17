# FAQ

## Does ChartFusion send data outside Power BI?

No. ChartFusion does not make external network requests and does not send report data to external services.

## Does ChartFusion store data locally?

No. ChartFusion does not use browser local storage, session storage, cookies, or IndexedDB to store report data.

## Can I use ChartFusion with RLS?

Yes. Row-level security is handled by Power BI. ChartFusion renders only the filtered DataView supplied by Power BI.

## Why is the visual blank?

The visual needs valid fields in `X-axis`, `Y-axis / Category`, and `Values`. The `Values` field must be numeric.

## What is Additional Row Values?

`Additional Row Values` accepts optional numeric measures that appear only in the matrix table. They are aligned to the X-axis columns and do not affect chart values or chart scaling.

## What is Add Target Line?

`Add Target Line` is an optional measure bucket for a target, average, median, or benchmark line on the chart.

## Can Filter 1 and Filter 2 use different styles?

Yes. Use the `Filter 1 style` and `Filter 2 style` settings in the `Top filters` format card.

## Can users change the chart type inside the visual?

Yes. Enable `Show chart type selector` in the `Chart type selector` format card.

## Does the visual support conditional formatting?

Yes. The visual includes manual rule and gradient formatting. Color properties also expose Power BI formatting support where supported by the host.

## Does the visual support external images or maps?

No. ChartFusion does not load external images, maps, scripts, or service resources.
