# Test Plan

Use this test plan before certification submission and before releasing updates.

## Command Checks

```bash
npm install
npm run eslint
npm audit --audit-level=moderate
pbiviz package
pbiviz package --certification-audit
```

## Field Well Tests

- No fields: visual shows a helpful message.
- X-axis only: visual shows a helpful message.
- X-axis and category without values: visual shows a helpful message.
- Valid X-axis, category, and numeric values: visual renders.
- Non-numeric Values field: visual rejects or does not render misleading values.
- Tooltips field: tooltips show additional values.
- Filter 1 field: top filter renders.
- Filter 2 field: top filter renders.
- Add Target Line field: target line renders.

## Chart Tests

- Line chart.
- Clustered bar chart.
- Stacked bar chart.
- Lollipop chart.
- Chart type selector enabled and disabled.
- Chart type selector changes chart type.
- Gridline color, style, and width.
- Markers on and off.
- Data labels on and off.
- Label collision avoidance.

## Table Tests

- Table on and off.
- Row labels on and off.
- Column labels on and off.
- Cell borders on and off.
- Total row on and off.
- Total column on and off.
- Total divider-to-row spacing from 0 through the supported maximum.
- Additional Row label and value font family, size, color, bold, and italic.
- Additional Row marker-to-text spacing.
- Row header marker shapes.
- Series colors.

## Filter Tests

- Filter 1 style set to Auto, Dropdown, Checkbox, Bullet, and Timeline.
- Filter 2 style set to Auto, Dropdown, Checkbox, Bullet, and Timeline.
- Filter 1 and Filter 2 use different fonts, text colors, backgrounds, borders, and spacing without affecting each other.
- Dropdown field and option-list background follows the selected control background color.
- Checkbox tick box background and tick color.
- Filter name overrides.
- Filter value colors.
- Filter background, border, padding, and spacing.

## Selection Tests

- Select a chart mark.
- Select a table cell.
- Select a row header.
- Ctrl-click or Cmd-click multi-select.
- Clear selection by clicking background.
- Cross-filter from another visual into ChartFusion.
- Cross-select from ChartFusion into another visual.

## Data Tests

- Blank categories.
- Blank values.
- Zero values.
- Negative values.
- Very large values.
- Many x-axis categories.
- Many series.
- Report/page/visual filters.
- RLS-filtered user.

## Accessibility Tests

- Keyboard focus appears.
- Enter and Space trigger selection.
- Tooltips are available.
- Visual remains usable at small sizes.

## Browser Console

Confirm no JavaScript errors are present for supported scenarios.
