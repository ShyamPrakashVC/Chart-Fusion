# Contributing

Thank you for helping improve ChartFusion.

## Development Setup

```bash
npm install
pbiviz start
```

Use Power BI Desktop developer visual mode to test local changes.

## Branching

- Use feature branches for normal development.
- Keep the `certification` branch reserved for certification submission source.
- The `certification` branch must match the submitted `.pbiviz` package.

## Before Submitting Changes

Run:

```bash
npm install
npm run eslint
npm audit --audit-level=moderate
pbiviz package --certification-audit
```

## Coding Guidelines

- Keep the visual focused on ChartFusion only.
- Do not add external network calls, telemetry, tracking, or data export behavior.
- Do not use `innerHTML`, `eval`, `Function`, `fetch`, `XMLHttpRequest`, or WebSocket APIs.
- Use safe DOM APIs such as `textContent` for user data.
- Keep dependencies public, reviewable, and necessary.
- Update documentation when user-facing behavior changes.

## Manual Testing

Use [docs/TEST_PLAN.md](docs/TEST_PLAN.md) before release or certification submission.
