# Known Issues

## Current Known Issues

No release-blocking known issues are recorded for version `1.0.22.0`.

## Known Limitations

- Native Power BI conditional formatting support is limited to color properties exposed by the host.
- Manual conditional-formatting rules are evaluated inside the visual.
- The total row and total column are calculated from the visible DataView supplied to the visual.
- Very large categorical datasets can require visual-level data reduction or report-level filtering.
- Custom date label formatting is basic and should be validated with the report's locale and model formatting.
- The local package command may print a non-failing certificate warning when `pwsh` is not installed in the local environment.

## Reporting Issues

See [SUPPORT.md](SUPPORT.md).
