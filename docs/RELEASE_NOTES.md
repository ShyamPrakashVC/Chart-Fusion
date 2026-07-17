# Release Notes

## Version 1.0.22.0

Release date: 2026-07-17

### Added

- Dedicated Filter 1 and Filter 2 formatting groups with independent font, text color, control background, border, checkbox, and spacing controls.
- Additional Row marker-to-text spacing.
- Additional Row label and value font-family, bold, italic, size, and color controls, including per-measure formatting.
- Divider-to-total spacing control for the Total row.

### Changed

- Filter settings are organized into General, Filter 1, and Filter 2 groups.
- Additional Row settings are organized into General, Row labels, Header marker, Values, and Per-measure formatting groups.
- Updated the visual icon and 300 x 300 AppSource logo to the ChartFusion shield artwork supplied on 2026-07-16.

### Certification Checks

- To be verified for this build before submission: `npm run eslint`, `npm audit --audit-level=moderate`, and `pbiviz package --certification-audit`.

## Version 1.0.21.0

Release date: 2026-07-15

### Fixed

- Add Target Line now reads target values across every legend/category group, preventing missing points in stacked and multi-series charts.
- Repeated target values are averaged per x-axis category so the target remains stable when Power BI emits it in multiple groups.

### Certification Checks

- To be verified for this build before submission: `npm run eslint`, `npm audit --audit-level=moderate`, and `pbiviz package --certification-audit`.

## Version 1.0.20.0

Release date: 2026-07-10

### Changed

- Additional Row formatting now appears under one `Additional rows` card.
- The card is organized into `Values`, `Header marker`, and `Per-measure formatting` groups.

### Certification Checks

- To be verified for this build before submission: `npm run eslint`, `npm audit --audit-level=moderate`, and `pbiviz package --certification-audit`.

## Version 1.0.19.0

Release date: 2026-07-10

### Fixed

- Additional Row percentage values now sum correctly across grouped categories.
- Additional Row percentage totals now use summed percentages, so `% of grand total` measures can total to `100%`.

### Certification Checks

- To be verified for this build before submission: `npm run eslint`, `npm audit --audit-level=moderate`, and `pbiviz package --certification-audit`.

## Version 1.0.18.0

Release date: 2026-07-10

### Added

- Dedicated `Additional row header marker` format section.
- Additional row header marker controls for show/hide, shape, size, color, border color, border width, opacity, position, and layout.

### Changed

- Global Additional Row marker settings were moved out of `Additional row values` into the new marker section to keep the format pane cleaner.

### Certification Checks

- To be verified for this build before submission: `npm run eslint`, `npm audit --audit-level=moderate`, and `pbiviz package --certification-audit`.

## Version 1.0.17.0

Release date: 2026-07-09

### Added

- Axis label font-family controls for X-axis and Y-axis labels.
- Per-measure formatting card for `Additional Row Values`.
- Additional Row label alignment and left/right padding controls.
- Total card background, border, width, and radius controls.
- Target marker border color and border width controls.

### Changed

- Chart settings are grouped into clearer sections in the format pane.
- Additional row values now respect source measure formats such as percentages where available.
- Support contact updated to Shyam Prakash at `shyamsamsp@gmail.com`.

### Removed

- Removed unused root sample CSV from the source package.

### Certification Checks

- To be verified for this build before submission: `npm run eslint`, `npm audit --audit-level=moderate`, and `pbiviz package --certification-audit`.

## Version 1.0.16.0

Release date: 2026-07-08

### Added

- `Additional Row Values` field bucket for table-only measures aligned to the shared X-axis.
- Formatting controls for additional row markers, labels, values, cell background, borders, and row totals.
- X-axis and Y-axis label color and size controls.
- Target-line marker, data-label, and label-background controls.
- Total-row background toggle.

### Fixed

- Stacked bar chart data labels now render when chart data labels are enabled.
- Total row labels now use the same boxed table styling as value and total cells.

### Certification Checks

- To be verified for this build before submission: `npm install`, `npm run eslint`, `npm audit --audit-level=moderate`, and `pbiviz package --certification-audit`.

## Version 1.0.14.0

Release date: 2026-07-07

### Changed

- Updated the ChartFusion logo used by the visual package and marketplace assets.
- Updated the configured support email to `shyamsamsp@gmail.com`.

### Certification Checks

- `npm install`: passed.
- `npm run eslint`: passed.
- `npm audit --audit-level=moderate`: passed with zero vulnerabilities.
- `pbiviz package --certification-audit`: passed and package created.

## Version 1.0.13.0

Release date: 2026-07-06

### Added

- Data label position control with `Inside marker`.
- Data label horizontal alignment and vertical alignment controls.
- Data label background toggle, color, and transparency controls.
- Submission package copy named `ChartFusion.pbiviz`.

### Changed

- Removed the white text halo from chart data labels when background is disabled.
- Kept gridline color with Power BI color formatting support and gridline styles for solid, dashed, and dotted lines.

### Certification Checks

- `npm install`: passed.
- `npm run eslint`: passed.
- `npm audit --audit-level=moderate`: passed with zero vulnerabilities.
- `pbiviz package --certification-audit`: passed and package created.

## Version 1.0.12.0

Release date: 2026-07-02

### Added

- Dedicated `Filter 1 style` and `Filter 2 style` controls.
- Optional top-right chart type selector.
- Chart selector formatting for selector name, value, dropdown background, border, and corner radius.
- Gridline color, style, and width formatting.
- Tick box background color and tick color formatting for checkbox filters.

### Changed

- Renamed the reference-line user-facing label to `Add Target Line`.

### Certification Checks

- `npm install`: passed.
- `npm run eslint`: passed.
- `npm audit --audit-level=moderate`: passed with zero vulnerabilities.
- `pbiviz package --certification-audit`: passed and package created.

## Version 1.0.11.0

- Added richer top filter formatting.
- Added lollipop chart type.
- Added reference-line measure bucket.
- Added Power BI color formatting instance hints.

## Version 1.0.10.0

- Stabilized package and format pane.
- Added ChartFusion visual icon.
