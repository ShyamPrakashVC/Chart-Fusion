# Changelog

All notable changes to ChartFusion are documented in this file.

## 1.0.22.0 - 2026-07-17

- Added independent, organized formatting sections for Filter 1 and Filter 2, including dropdown/control background colors.
- Added Additional Row label and value font-family, size, color, bold, and italic controls, including per-measure overrides.
- Added adjustable spacing between Additional Row markers and their labels.
- Added adjustable spacing between the total-row divider and total cards.
- Replaced the visual icon and 300 x 300 AppSource logo with the new ChartFusion shield artwork.

## 1.0.21.0 - 2026-07-15

- Fixed Add Target Line gaps in grouped and stacked charts by reading target values from every category series.
- Target values repeated across series are averaged per x-axis category, while sparse target values now render for every category where data exists.

## 1.0.20.0 - 2026-07-10

- Reorganized Additional Row formatting into one `Additional rows` format-pane card.
- Grouped Additional Row controls into `Values`, `Header marker`, and `Per-measure formatting` sections.

## 1.0.19.0 - 2026-07-10

- Fixed Additional Row percentage aggregation so `% of grand total` style values sum correctly across categories and columns.
- Fixed Additional Row percentage totals so a full visible set can show `100%` instead of an averaged percentage.

## 1.0.18.0 - 2026-07-10

- Added a dedicated `Additional row header marker` format section.
- Added show marker, marker shape, size, color, border color, border width, opacity, position, and layout controls for additional row headers.
- Moved global additional-row marker controls out of `Additional row values` to reduce duplicate/confusing format-pane controls.

## 1.0.17.0 - 2026-07-09

- Added axis label font-family controls and fixed axis label color/size rendering.
- Added per-measure formatting for `Additional Row Values` labels, marker shape, marker size, marker color, value size, and value color.
- Added Additional Row label alignment plus left/right padding controls.
- Preserved source measure formatting for additional rows, including percentage-style values.
- Added total card background, border color, border width, and corner radius controls.
- Added target marker border color and border width controls.
- Reorganized the Chart format pane into clearer named groups.
- Updated support contact to Shyam Prakash at `shyamsamsp@gmail.com`.
- Removed the unused root sample CSV.

## 1.0.16.0 - 2026-07-08

- Added `Additional Row Values` for table-only measures aligned to the X-axis.
- Added formatting for additional row labels, markers, value text, cell background, borders, and row totals.
- Added X-axis and Y-axis label color and font-size controls.
- Added target-line markers, target-line data labels, and configurable target-label background.
- Added total-row background toggle and boxed styling for total row labels.
- Restored chart data labels for stacked bar segments.
- Updated publisher metadata and support contact.

## 1.0.14.0 - 2026-07-07

- Updated the ChartFusion visual icon and AppSource logo assets.
- Updated the configured support email to `shyamsamsp@gmail.com`.
- Prepared a fresh certification and marketplace submission folder.

## 1.0.13.0 - 2026-07-06

- Added chart data label position control, including `Inside marker`.
- Added chart data label horizontal and vertical alignment controls for marker-centered labels.
- Added optional chart data label background toggle, color, and transparency.
- Removed the previous white text halo when data label background is disabled.
- Confirmed gridline color uses Power BI color formatting support and gridline style supports solid, dashed, and dotted lines.
- Created a submission package copy named `ChartFusion.pbiviz`.

## 1.0.12.0 - 2026-07-02

- Added dedicated `Filter 1 style` and `Filter 2 style` controls.
- Added optional top-right chart type selector.
- Added chart selector formatting for label, value, background, border, and corner radius.
- Renamed the reference-line user-facing label to `Add Target Line`.
- Added gridline color, style, and width formatting.
- Added checkbox tick box background color and tick color formatting.

## 1.0.11.0 - 2026-07-01

- Added Filter 1 and Filter 2 formatting for custom names, style override, font, color, border, background, padding, and spacing.
- Added checkbox, bullet, dropdown, and timeline filter display styles.
- Added lollipop chart type.
- Added `Reference line` measure bucket and formatting card for average or median-style values.
- Added Power BI conditional-formatting instance hints for color pickers where supported.

## 1.0.10.0 - 2026-07-01

- Stabilized the visual package and formatting pane.
- Added the ChartFusion icon asset.
- Confirmed lint, audit, and certification package checks.

## Earlier Development Builds

- Added chart and matrix rendering.
- Added totals, row header markers, label formatting, and conditional-formatting rules.
- Added optional top filters and table border controls.
