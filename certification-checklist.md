# Certification Checklist

## Project

- [x] Uses TypeScript.
- [x] Uses current stable Power BI visual tooling checked on 2026-06-18.
- [x] Uses modern `getFormattingModel`.
- [x] Keeps dependencies minimal.
- [x] Does not use React.
- [x] Uses SVG/DOM rendering without `innerHTML`.

## Capabilities

- [x] X-axis grouping role.
- [x] Y-axis / Category grouping role.
- [x] Exactly one numeric Values measure for the chart, with optional table-only Additional Row Values.
- [x] Optional Tooltips role.
- [x] Categorical dataViewMapping.
- [x] `supportsHighlight` enabled.
- [x] `supportsMultiVisualSelection` enabled.
- [x] `privileges` is an empty array.

## Certification-Sensitive Checks

- [x] No WebAccess privilege.
- [x] No `fetch`.
- [x] No `XMLHttpRequest`.
- [x] No `WebSocket`.
- [x] No telemetry.
- [x] No `eval`.
- [x] No `Function` constructor.
- [x] No external services.
- [x] No local storage caching.
- [x] No data export.
- [x] No minified checked-in JavaScript.

## Manual Test Matrix

- [ ] Empty visual with no fields.
- [ ] X-axis only missing other fields.
- [ ] Valid sample data.
- [ ] Blank categories and blank values.
- [ ] Visual/page/report filters.
- [ ] RLS-filtered user.
- [ ] Cross-selection from this visual to other visuals.
- [ ] Cross-filtering from other visuals into this visual.
- [ ] Ctrl-click multi-select.
- [ ] Highlight values from another visual.
- [ ] Resize to small dimensions.
- [ ] Many categories.
- [ ] Many x-axis values.
- [ ] Line chart.
- [ ] Clustered bar chart.
- [ ] Stacked bar chart.
- [ ] Chart type None.
- [ ] Total row on/off.
- [ ] Manual rule conditional formatting.
- [ ] Manual gradient conditional formatting.
- [ ] Native color conditional formatting.
- [ ] Keyboard focus and Enter/Space selection.
- [ ] Tooltips with optional tooltip fields.

## Commands

```bash
npm install
pbiviz start
npm run eslint
npm audit
pbiviz package
pbiviz package --certification-audit
```
