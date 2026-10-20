# Minik Studio wholesale website

A React, TypeScript and Vite website for international children's clothing wholesale buyers. The site includes a searchable product catalog, an English/Arabic/Russian five-step inquiry form, WhatsApp inquiry links, and centrally configured social profiles.

## Visual system and catalog photography

The shared design tokens, responsive layouts, multilingual typography, and reduced-motion treatment are in `src/editorial.css`.

- English and Russian use **Cormorant Garamond** selectively for editorial headings and **Manrope** for body copy and interface text. Both include Cyrillic coverage.
- Arabic uses **IBM Plex Sans Arabic** for both headings and interface text, with RTL direction and no letter spacing.
- These Google Fonts are distributed under the SIL Open Font License. Google Fonts is preconnected in `index.html`; fonts are loaded from its CDN.
- Main color tokens are `--color-background: #F7F5F0`, `--color-surface: #FFFFFF`, `--color-text: #282720`, `--color-text-secondary: #706B62`, `--color-border: #E5E0D7`, `--color-accent: #8A765E`, and `--color-button-primary: #292820`.
- Semantic display/page/section/product/body/metadata/label/button/validation type tokens, line heights, spacing, content width, product image ratio, corners, shadows, and motion tokens are defined alongside the colors in `src/editorial.css`.

The responsive header changes to compact menu navigation at tablet widths, catalog columns adapt to available space, the inquiry progress labels simplify on narrow screens, and the product gallery respects mobile safe areas. The project was browser-checked at the specified viewport widths (320, 360, 375, 390, 430, 600, 768, 820, 1024, 1280, 1366, 1440, 1600, and 1920 px) in English, Arabic, and Russian for horizontal document overflow on the home and cart pages.

Catalog data lives in `src/data/products.ts`. Existing `sizes` and `colors` values are shown as supplied. `fabric` and `ageRange` are optional product properties and are omitted until actual manufacturer data is provided. A product's `views` property can provide authentic angle images:

```ts
views: {
  front: '/catalog/MK-2418-front.webp',
  back: '/catalog/MK-2418-back.webp',
  side: '/catalog/MK-2418-side.webp',
  detail: '/catalog/MK-2418-detail.webp',
}
```

The gallery supports zoom, keyboard navigation, Escape-to-close, and touch-sized controls. Missing images are marked unavailable; the catalog preview is never presented as a fabricated front, back, side, or detail shot.

## Wholesale cart

The cart is available at `/cart`, persists product selections (not customer contact details) in browser `localStorage`, and sends a multilingual quotation request through the configured WhatsApp number. It does not take payment or calculate unconfigured prices.

Product order rules are optional and configured per product in `src/data/products.ts`:

```ts
availableSizes: ['2 years', '3 years', '4 years'],
orderRule: {
  minimumQuantity: 12,
  requireCompleteSizeSeries: true,
},
```

`availableSizes` is the source of selectable sizes; an empty or omitted list does not imply selectable sizes. Set a minimum only when the manufacturer's actual minimum is known. A complete-series rule requires a positive quantity in every configured size. Minimum quantities apply across all color variants of the model.

The cart's **Continue in the smart inquiry form** action transfers models, color variants, size-specific quantities, notes, and the total quantity without persisting customer details or asking the buyer to choose those models again.

## Run locally

```sh
npm install
npm run dev
```

Run `npm run build` to type-check and create a production build, or `npm run lint` to run ESLint.

## Business contact and social configuration

Update `src/config/business.ts`:

- `whatsappNumber`: the business WhatsApp number in international format using digits only (country code included, no `+`, spaces, or punctuation). This number is used by the website's WhatsApp buttons and inquiry form.
- `facebookUrl` and `instagramUrl`: the full public profile URLs. They are empty by default; add the actual business URLs to show those links in the header, social/contact sections, and footer. Empty URLs are intentionally hidden. Do not use the generic platform homepages as profile links.

The configuration also contains the displayed business name, email, phone, location, and working hours.

## Inquiry submission backend

The inquiry form does not claim to save or send an inquiry unless it receives a successful response from a configured backend. To enable website submission, set the Vite environment variable `VITE_INQUIRY_ENDPOINT` to an HTTPS endpoint that accepts a JSON `POST` request. For local development, put it in an untracked `.env.local` file in the project root:

```dotenv
VITE_INQUIRY_ENDPOINT=https://your-domain.example/api/wholesale-inquiries
```

Restart the Vite server after changing environment variables. The request body has this shape:

```json
{
  "language": "en",
  "answers": {},
  "summary": "Customer and inquiry summary"
}
```

`language` is `en`, `ar`, or `ru`. `answers` contains the submitted customer, inquiry, product, and order requirement fields; `summary` is generated from the same answers for convenient review. Return a `2xx` HTTP response only after the inquiry has genuinely been accepted/saved. A non-`2xx` response or network failure is shown as an error. The browser sends `Content-Type: application/json` and `Accept: application/json`; configure the endpoint's CORS policy to allow the deployed website origin. Validate and sanitize all fields again on the server, apply appropriate abuse/rate limits, and protect stored personal data.

Without this setting, **Submit inquiry** clearly explains that online submission is not configured. **Continue on WhatsApp** remains a separate action and opens a prefilled message; the visitor must send it in WhatsApp to contact the business.

Reference-image upload is not offered because this project has no secure file-upload backend. Add it only with a backend that authenticates/validates uploads and enforces file type, size, and malware scanning policies.
