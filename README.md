# ChartFusion

ChartFusion is a Power BI custom visual that combines a compact trend chart with an aligned matrix table. It is designed for reports that need chart movement, row-level values, totals, and compact filter controls in a single visual.

Current visual version: `1.1.1.0`

## Features

- Line, clustered bar, stacked bar, and lollipop chart types.
- Optional top-right chart type selector inside the visual.
- Matrix table aligned to chart x-axis categories.
- Optional Filter 1 and Filter 2 field wells rendered as dropdown, checkbox, bullet, or timeline controls.
- Dedicated formatting for Filter 1 and Filter 2 styles.
- Add Target Line measure bucket for target, average, or median-style reference lines.
- Automatic or manual Y-axis scaling, plus optional DAX-driven minimum and maximum bounds with an explicit format-pane control and guidance.
- Total row placement above or below the matrix and independent total-column controls.
- Optional hiding of primary Values rows while retaining their chart series.
- Independent display units for chart values, table values, and Additional Row values.
- Percentage formatting preserved across chart labels, axes, table cells, totals, and tooltips.
- Row header markers with configurable shapes.
- Data labels, gridline formatting, padding, colors, borders, and font controls.
- Manual conditional-formatting rules plus Power BI color formatting support where supported by the host.
- Host-side Top 100 X-axis and Top 60 series data reduction for large datasets.
- Adaptive dense-data rendering with readable ellipsized labels and full-text hover titles.
- Native Power BI right-click context menus for data points, table cells, row headers, and visual background.

## Data Roles

- `X-axis`: chart x-axis points and matrix columns.
- `Y-axis / Category`: chart series and matrix rows.
- `Filter 1`: optional top filter.
- `Filter 2`: optional top filter.
- `Values`: primary numeric measure used by the chart and matrix.
- `Y-axis minimum (fx measure)`: optional DAX measure that dynamically sets the chart minimum.
- `Y-axis maximum (fx measure)`: optional DAX measure that dynamically sets the chart maximum.
- `Additional Row Values`: optional numeric measures shown as table-only rows aligned to the X-axis.
- `Add Target Line`: optional numeric measure used as a chart reference line.
- `Tooltips`: optional fields shown in tooltips.

## Install

Install dependencies:

```bash
npm install
```

## Run Locally

```bash
pbiviz start
```

Then enable developer visuals in Power BI Desktop and add the running visual to a report page.

## Package

```bash
npm run package
```

Equivalent direct command:

```bash
pbiviz package
```

The generated `.pbiviz` file is written to `dist`.

## Certification Checks

Run these before submitting:

```bash
npm install
npm run eslint
npm audit --audit-level=moderate
pbiviz package --certification-audit
```

The repository must include a branch named exactly `certification` for Microsoft review. The source in that branch must match the submitted package.

## Certification Notes

- `capabilities.json` uses `privileges: []`.
- The visual does not use `fetch`, `XMLHttpRequest`, WebSocket calls, telemetry, local storage caching, or external service calls.
- The visual renders only the data supplied by the Power BI host DataView.
- Rendering events are implemented through the Power BI host event service.
- User-provided data is assigned through text-safe DOM APIs such as `textContent`.

## Documentation

- [Privacy Policy](docs/PRIVACY_POLICY.md)
- [Terms of Use](docs/TERMS_OF_USE.md)
- [Support](docs/SUPPORT.md)
- [User Guide](docs/USER_GUIDE.md)
- [FAQ](docs/FAQ.md)
- [Known Issues](docs/KNOWN_ISSUES.md)
- [Release Notes](docs/RELEASE_NOTES.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Security](docs/SECURITY.md)
- [Data Handling](docs/DATA_HANDLING.md)
- [Test Plan](docs/TEST_PLAN.md)
- [Certification Readiness](docs/CERTIFICATION_READINESS.md)
- [Submission Checklist](docs/SUBMISSION_CHECKLIST.md)

## Support

For support or bug reports, use [GitHub Issues](https://github.com/ShyamPrakashVC/Chart-Fusion/issues) or contact Shyam Prakash at `shyamsamsp@gmail.com`.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE).
