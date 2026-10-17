**External links: `rel="noopener noreferrer"`**
**Decision:** All external links that open in a new tab (such as the GitHub repo link on the login page) use `target="_blank"` together with `rel="noopener noreferrer"`.

**Why:**
- **Security (`noopener`):** Without it, the opened page can access our app through `window.opener` and redirect the original tab to a malicious page (reverse tabnabbing). `noopener` removes that access.
- **Privacy (`noreferrer`):** It stops the browser from sending the app's URL to the external site in the `Referer` header.
- **Compatibility:** Modern browsers apply `noopener` by default for `target="_blank"`, but setting it explicitly protects older browsers and keeps the behavior consistent. It also satisfies common lint rules (e.g. `react/jsx-no-target-blank`).