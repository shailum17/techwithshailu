# Self-hosted fonts

Loaded by `app/layout.tsx` with `next/font/local`, so builds never fetch from
Google Fonts at build time.

| File | Font | Weights |
|---|---|---|
| `poppins-{400,500,600,700,800}-latin.woff2` | Poppins (Indian Type Foundry) | 400–800 |
| `outfit-variable-latin.woff2` | Outfit (variable) | 300–600 used |

Both are licensed under the [SIL Open Font License 1.1](https://openfontlicense.org),
which permits bundling and self-hosting. Files are the Latin subset served by
Google Fonts. To add a weight, download its Latin `.woff2` and add it to the
`src` list in `app/layout.tsx`.
