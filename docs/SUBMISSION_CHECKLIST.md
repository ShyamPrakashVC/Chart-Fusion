# Submission Checklist

Use this checklist before submitting ChartFusion to Partner Center or requesting Power BI certification.

## Repository

- [ ] Repository contains only this Power BI visual and related documentation.
- [ ] Branch named exactly `certification` exists.
- [ ] Source code in `certification` matches the submitted `.pbiviz` package.
- [ ] Private repository access is prepared for Microsoft review, if applicable.
- [ ] `.gitignore` excludes `node_modules`, `.tmp`, and `dist`.

## Required Files

- [ ] `capabilities.json`.
- [ ] `pbiviz.json`.
- [ ] `package.json`.
- [ ] `package-lock.json`.
- [ ] `tsconfig.json`.
- [ ] `.gitignore`.
- [ ] `README.md`.
- [ ] `LICENSE`.
- [ ] `CHANGELOG.md`.
- [ ] `docs/PRIVACY_POLICY.md`.
- [ ] `docs/TERMS_OF_USE.md`.
- [ ] `docs/SUPPORT.md`.
- [ ] `docs/USER_GUIDE.md`.
- [ ] `docs/SECURITY.md`.

## Commands

- [ ] `npm install`.
- [ ] `npm run eslint`.
- [ ] `npm audit --audit-level=moderate`.
- [ ] `pbiviz package`.
- [ ] `pbiviz package --certification-audit`.

## Security and Privacy

- [ ] `capabilities.json` has `privileges: []`.
- [ ] No `fetch`.
- [ ] No `XMLHttpRequest`.
- [ ] No WebSocket.
- [ ] No `innerHTML`.
- [ ] No `eval`.
- [ ] No `Function` constructor.
- [ ] No telemetry.
- [ ] No external data services.
- [ ] No local report-data storage.

## AppSource and Partner Center

- [ ] AppSource listing text is complete.
- [ ] Icon and screenshots are final.
- [ ] Support URL is final.
- [ ] Support email is final.
- [ ] Privacy policy URL or document is final.
- [ ] Terms of use URL or document is final.
- [ ] Certification request checkbox is selected in Partner Center.
- [ ] Notes for certification include repository link and access details.
