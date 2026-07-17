# User Guide

## Overview

ChartFusion combines a chart and aligned matrix table in one Power BI custom visual.

## Add the Visual

1. Import the `.pbiviz` file into Power BI Desktop.
2. Add ChartFusion to the report canvas.
3. Resize the visual to provide enough room for the chart and matrix table.

## Field Mapping

Use these field wells:

- `X-axis`: fiscal year, quarter, month, category, or another column used for chart positions and table columns.
- `Y-axis / Category`: series and table row category.
- `Values`: numeric measure shown in chart and table cells.
- `Additional Row Values`: optional numeric measures shown only as additional table rows aligned to the X-axis.
- `Filter 1`: optional top filter.
- `Filter 2`: optional top filter.
- `Add Target Line`: optional target, average, or median measure rendered over the chart.
- `Tooltips`: optional fields shown in tooltips.

## Chart Types

The visual supports:

- Line.
- Clustered bar.
- Stacked bar.
- Lollipop.
- None.

The optional chart type selector can be enabled from the `Chart type selector` format card. When enabled, users can change chart type from the top-right corner of the visual.

## Top Filters

Filter 1 and Filter 2 can be rendered as:

- Auto.
- Dropdown.
- Checkbox.
- Bullet.
- Timeline.

Filter 1 and Filter 2 have independent format groups. Each filter can use its own name, control style, font, text colors, dropdown/control background, border, checkbox colors, corner radius, and label-to-control spacing. General settings control the shared strip background, alignment, padding, and spacing between filters.

## Add Target Line

Drag a numeric measure into `Add Target Line` to show a reference line on the chart. This is useful for targets, averages, medians, thresholds, or benchmarks.

Formatting options include:

- Line color.
- Line width.
- Solid, dashed, or dotted style.
- Label text.
- Label color.
- Label font size.
- Target markers, target data labels, and optional label background.

## Matrix Table

The table shares the same X-axis values as the chart. Each series/category becomes a row. The visual can show:

- Row labels.
- Column labels.
- Value cells.
- Total row.
- Total column.
- Additional row values.
- Row header markers.

## Formatting

Use the Power BI format pane to control:

- Chart height, gridlines, data labels, markers, and padding.
- Table background, borders, row/column spacing, and cell padding.
- Values font, size, color, bold, italic, underline, alignment, display units, and decimal places.
- Row headers and column labels.
- Total row and total column, including divider-to-total spacing.
- Additional row label and value font family, size, color, bold, italic, alignment, padding, cell background, borders, and row totals.
- Additional row header marker shape, color, border, opacity, position, layout, and marker-to-text spacing.
- Series colors.
- Row header marker shape and styling.
- Conditional formatting rules.

## Accessibility

ChartFusion supports keyboard focus for selectable marks and cells. Use `Enter` or `Space` to select focused items where supported by Power BI.

## Troubleshooting

If the visual is blank:

1. Confirm `X-axis`, `Y-axis / Category`, and `Values` are populated.
2. Confirm the `Values` field is numeric.
3. Check active report/page/visual filters.
4. Resize the visual.
5. Confirm the visual package version is the expected version.
