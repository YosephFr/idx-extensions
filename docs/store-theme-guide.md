# IDX Store Theme Host Guide

This document defines the host contract for store themes on the IDX Platform. Store themes are managed UI artifacts rendered by the IDX store host application. A theme may redefine substantial portions of the storefront presentation — including color palettes, typography, layout preferences, and all user-facing copy — while continuing to operate within the platform's data, routing, checkout, and tenant resolution contracts.

## Table of Contents

- [Bundle Contract](#bundle-contract)
- [Manifest Schema](#manifest-schema)
- [Theme Configuration](#theme-configuration)
- [Content Overrides](#content-overrides)
- [Asset Mapping](#asset-mapping)
- [Platform Rules](#platform-rules)

## Bundle Contract

A store theme bundle is a ZIP archive containing the following files:

- `manifest.json` — The metadata and versioning entrypoint.
- `theme.json` — The runtime configuration payload (referenced via `portableThemeFile`).
- `assets/` — Optional directory containing brand assets (logos, hero images, etc.).

### Minimal Manifest Structure

```json
{
  "kind": "theme",
  "target": "store",
  "name": "Store Theme",
  "slug": "store-theme",
  "version": "1.0.0",
  "description": "A concise description of the theme's purpose and aesthetic direction.",
  "portableThemeFile": "theme.json",
  "settings": {
    "colors": {
      "primary": "#0f172a",
      "secondary": "#334155",
      "accent": "#f97316",
      "background": "#fff7ed",
      "surface": "#ffffff",
      "surfaceAlt": "#f8fafc",
      "line": "#e2e8f0",
      "text": "#0f172a",
      "muted": "#64748b"
    },
    "typography": {
      "headingFont": "Manrope",
      "bodyFont": "Manrope"
    },
    "layout": "grid",
    "presentation": {
      "mode": "immersive",
      "categoryMenu": "grid",
      "mobileDock": "sheet",
      "productCards": "editorial"
    }
  },
  "content": {
    "heroTitle": "Headline override",
    "heroSubtitle": "Supporting text override"
  },
  "assets": {
    "logoUrl": "assets/logo.svg",
    "footerLogoUrl": "assets/logo-footer.svg",
    "heroImages.0": "assets/hero-1.jpg"
  }
}
```

## Manifest Schema

| Field | Required | Type | Description |
|---|---|---|---|
| `kind` | Yes | `"theme"` | Must be the literal string `"theme"`. |
| `target` | Yes | `"store"` | Must be the literal string `"store"`. |
| `name` | Yes | `string` | Human-readable theme name. |
| `slug` | Yes | `string` | Unique identifier. Lowercase alphanumeric characters and hyphens only. |
| `version` | Yes | `string` | Semantic version string (e.g., `"1.0.0"`). |
| `description` | Yes | `string` | Brief description of the theme's design direction. |
| `portableThemeFile` | Yes | `string` | Relative path to the runtime theme payload (typically `"theme.json"`). |
| `settings` | Yes | `object` | Design token definitions (colors, typography, layout). |
| `content` | No | `object` | Content overrides for storefront copy. |
| `assets` | No | `object` | Mapping of asset keys to bundled file paths. |

## Theme Configuration

### Color Tokens

The `settings.colors` object defines the storefront color palette. All values must be valid CSS color strings.

| Token | Description |
|---|---|
| `primary` | Primary brand color. Used for buttons, links, and key interactive elements. |
| `secondary` | Secondary color. Used for supporting UI elements and secondary actions. |
| `accent` | Accent color. Used for highlights, badges, and attention-drawing elements. |
| `background` | Base background color for the storefront. |
| `surface` | Elevated theme surface for cards and framed panels. |
| `surfaceAlt` | Alternate surface used for softer cards, drawers, or mobile sheets. |
| `line` | Border and separator color. |
| `text` | Main text color. |
| `muted` | Secondary and helper text color. |

### Typography

The `settings.typography` object defines font families used across the storefront.

| Token | Description |
|---|---|
| `headingFont` | Font family for headings (h1–h6) and display text. |
| `bodyFont` | Font family for body text, labels, and general content. |

Fonts must be available via Google Fonts or bundled as assets within the theme.

### Layout

The `settings.layout` field controls the default product display mode.

| Value | Description |
|---|---|
| `"grid"` | Products displayed in a responsive grid layout. |
| `"list"` | Products displayed in a vertical list layout. |

### Presentation

The optional `settings.presentation` object lets a store theme request deeper host-rendered presentation changes without breaking storefront compatibility.

| Field | Values | Description |
|---|---|---|
| `mode` | `"default"` \| `"immersive"` | Enables a richer host shell for themes that want stronger visual continuity across pages. |
| `categoryMenu` | `"chips"` \| `"grid"` | Controls whether categories render as chips or a visual grid. |
| `mobileDock` | `"default"` \| `"sheet"` | Controls the mobile navigation style. |
| `productCards` | `"default"` \| `"editorial"` | Switches product cards between standard and editorial layouts. |

## Content Overrides

The `content` object in both the manifest and `theme.json` allows themes to override user-facing copy throughout the storefront. Content overrides are organized by page and section:

- **Header** — Badge text, tagline, announcement text, navigation labels, and action labels.
- **Navigation** — Menu item labels and link targets.
- **Footer** — Title, description, contact information, social links, policy links, and credit/footer metadata.
- **Home** — Eyebrow text, hero title, hero description, call-to-action labels, and featured section headings.
- **Catalog** — Page title, search placeholder, category labels, category intro copy, and empty state messages.
- **Product Detail** — Back navigation label, quantity label, add-to-cart label, and related products heading.
- **Cart** — Summary labels, shipping information, and supplementary content blocks.
- **Checkout** — Contact section labels, payment section labels, and order summary copy.

Refer to the Piombino theme example (`themes/piombino/theme.json`) for a comprehensive content override structure.

## Asset Mapping

The `assets` object maps logical asset keys to bundled file paths. During the upload process, bundled assets are extracted to platform-managed storage and served via runtime-safe URLs.

| Key Pattern | Description |
|---|---|
| `logoUrl` | Brand logo displayed in the storefront header and footer. |
| `footerLogoUrl` | Optional alternate footer logo, useful for vertical brand marks. |
| `heroImages.0`, `heroImages.1` | Hero banner images for the homepage carousel. |

Asset paths must be relative to the bundle root. Supported formats include SVG, PNG, JPG, and WebP.

## Platform Rules

- `manifest.json` serves as the metadata and versioning entrypoint. It may reference a portable runtime payload via `portableThemeFile`.
- `theme.json` is the runtime source of truth when included in the bundle. The host application reads design tokens, content overrides, and asset references from this file.
- The `settings` object must remain compatible with the store host contract. Unsupported tokens are ignored.
- The `content` object may override storefront copy including layout framing, navigation, footer, and page-level presentation elements supported by the host runtime.
- The `assets` object maps bundled files to runtime-safe URLs extracted under the platform's upload directory.
- Themes may be assigned per client for the `store` target only after achieving `approved` review status.
- Themes may not introduce unmanaged backend behavior outside existing IDX Platform capabilities.
- Theme files are brand assets and require approval through the review pipeline before becoming eligible for client assignment.
