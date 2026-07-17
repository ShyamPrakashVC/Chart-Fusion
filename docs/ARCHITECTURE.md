# Architecture

## Overview

ChartFusion is a TypeScript Power BI custom visual. It reads the Power BI categorical DataView, builds a normalized internal model, and renders a chart plus an aligned matrix table using SVG and DOM elements.

## Main Files

- `src/visual.ts`: visual lifecycle, rendering, top filters, chart selector, chart rendering, table rendering, selections, and formatting model entry points.
- `src/dataParser.ts`: converts the Power BI DataView into x-axis values, category series, totals, filters, and Add Target Line values.
- `src/settings.ts`: default settings, format pane model, object enumeration, and formatting property parsing.
- `src/conditionalFormatting.ts`: manual conditional-formatting rule and gradient evaluation.
- `src/selection.ts`: Power BI selection ID creation and selection helpers.
- `src/tooltips.ts`: tooltip integration.
- `src/valueFormatter.ts`: value display formatting.
- `style/visual.less`: visual styles.
- `capabilities.json`: data roles, dataView mappings, formatting objects, privileges, and feature flags.
- `pbiviz.json`: visual metadata and package configuration.

## Data Flow

1. Power BI calls `update` with a DataView.
2. `parseVisualSettings` reads persisted formatting settings.
3. `parseDataView` reads categories, grouped values, filters, tooltips, totals, and Add Target Line values.
4. `attachSelectionIds` adds Power BI selection identifiers.
5. `render` draws the top controls, chart, optional divider, and table.
6. Selection and tooltip handlers are attached to interactive elements.

## Rendering

- Charts are rendered with SVG.
- The aligned matrix table is rendered with DOM elements.
- User data is assigned through safe text APIs.
- The visual does not use `innerHTML`.

## Formatting

The visual uses the modern Power BI `getFormattingModel` API. Legacy object enumeration is also implemented for compatibility.

## Security Boundaries

ChartFusion does not authenticate users, call external services, or bypass Power BI security. It relies on Power BI to provide the filtered DataView according to report, page, visual, model, and RLS filters.
