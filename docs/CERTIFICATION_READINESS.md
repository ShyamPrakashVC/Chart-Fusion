# Certification Readiness

This document summarizes ChartFusion readiness for Power BI custom visual certification.

## Visual Metadata

- Display name: ChartFusion.
- Version: `1.0.22.0`.
- API version: `5.11.0`.
- Tooling: `powerbi-visuals-tools` `7.1.0`.
- Source language: TypeScript.

## Microsoft Certification Requirements Checked

Microsoft's certification documentation requires source review readiness, required repository files, clean command execution, no forbidden network or dynamic-code behavior, and a branch named exactly `certification`.

Current repository status:

- `capabilities.json`: present.
- `pbiviz.json`: present.
- `package.json`: present.
- `package-lock.json`: present.
- `tsconfig.json`: present.
- `.gitignore`: present and excludes `node_modules`, `.tmp`, and `dist`.
- `package.json` includes `typescript`, `eslint`, and `eslint-plugin-powerbi-visuals`.
- `package.json` includes the required lint command: `npx eslint . --ext .js,.jsx,.ts,.tsx`.
- `capabilities.json` has `privileges: []`.
- Rendering Events API calls are implemented.

## Last Local Verification

Version `1.0.22.0` should be verified with:

```bash
npm install
npm run eslint
npm audit --audit-level=moderate
pbiviz package --certification-audit
```

Results:

- Install passed.
- Lint passed.
- Audit passed with zero vulnerabilities.
- Certification audit package passed.
- No external requests were detected by the packaging audit.

## Manual Requirements Before Submission

- Create or update a repository branch named exactly `certification`.
- Ensure the source in `certification` matches the submitted `.pbiviz` package.
- Provide repository access to the Microsoft validation team if the repository is private.
- Provide Partner Center notes with repository link and required access instructions.
- Support contact: Shyam Prakash at `shyamsamsp@gmail.com`.
- Complete manual tests in [TEST_PLAN.md](TEST_PLAN.md).
