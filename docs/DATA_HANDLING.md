# Data Handling

## Data Source

ChartFusion receives data from Power BI through the visual DataView. The visual does not connect directly to databases, APIs, files, or external services.

## Data Used

The visual can display:

- X-axis categories.
- Category or series values.
- Filter 1 and Filter 2 values.
- Numeric values.
- Additional Row Values shown as table-only rows.
- Add Target Line values.
- Tooltip values.

## Aggregation

ChartFusion renders the grouped data supplied by Power BI. Totals are calculated inside the visual from visible values in the current DataView.

## Filtering

Power BI report/page/visual filters and RLS are applied before data reaches the visual. Internal top filters further reduce the rendered DataView rows inside the visual.

## Storage

ChartFusion does not store report data outside the visual runtime. It does not use:

- Cookies.
- Local storage.
- Session storage.
- IndexedDB.
- External storage services.

## Transmission

ChartFusion does not transmit report data outside Power BI.

## Export

ChartFusion does not implement custom data export.
