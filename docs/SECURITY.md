# Security

## Supported Version

Security review applies to ChartFusion version `1.0.22.0`.

## Data Security

ChartFusion renders only the data supplied by Power BI. It does not independently request, retrieve, export, or transmit report data.

## Network Behavior

The visual does not use:

- `fetch`.
- `XMLHttpRequest`.
- WebSocket.
- External script loading.
- External image loading.
- Telemetry endpoints.

`capabilities.json` uses `privileges: []`.

## DOM Safety

The visual avoids `innerHTML`. User and report data are assigned through safe DOM APIs such as `textContent` and SVG attributes.

## Code Execution

The visual does not use:

- `eval`.
- `Function` constructor.
- Dynamic execution of user-provided functions.
- Minified checked-in JavaScript source files.

## Dependencies

Dependencies are public npm packages and are listed in `package.json` and `package-lock.json`.

Before release, run:

```bash
npm audit --audit-level=moderate
```

## Reporting Security Issues

Report suspected security issues through the support channel in [SUPPORT.md](SUPPORT.md). Do not publish exploit details publicly before maintainers have had time to review and respond.
