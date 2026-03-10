# IDX Booking Theme Host Guide

This document defines the host contract for booking themes on the IDX Platform. Booking themes are managed UI artifacts rendered by the IDX booking host application. A theme may redefine the booking interface presentation and supporting content while continuing to operate within the platform's booking flows, provider data, and tenant-scoped runtime contracts.

## Table of Contents

- [Bundle Contract](#bundle-contract)
- [Manifest Schema](#manifest-schema)
- [Theme Configuration](#theme-configuration)
- [Content Overrides](#content-overrides)
- [Asset Mapping](#asset-mapping)
- [Platform Rules](#platform-rules)

## Bundle Contract

A booking theme bundle is a ZIP archive containing the following files:

- `manifest.json` — The metadata and versioning entrypoint.
- `theme.json` — The runtime configuration payload (referenced via `portableThemeFile`).
- `assets/` — Optional directory containing brand assets (logos, icons, etc.).

### Minimal Manifest Structure

```json
{
  "kind": "theme",
  "target": "booking",
  "name": "Booking Theme",
  "slug": "booking-theme",
  "version": "1.0.0",
  "description": "A concise description of the theme's purpose and aesthetic direction.",
  "portableThemeFile": "theme.json",
  "settings": {
    "colors": {
      "primary": "#166534",
      "secondary": "#14532d",
      "accent": "#f59e0b",
      "background": "#ecfdf5"
    },
    "typography": {
      "headingFont": "Plus Jakarta Sans",
      "bodyFont": "Plus Jakarta Sans"
    }
  },
  "content": {
    "bookingHeadline": "Reserve your appointment",
    "bookingSubtitle": "Select service, professional, and time slot"
  },
  "assets": {
    "logoUrl": "assets/logo.svg"
  }
}
```

## Manifest Schema

| Field | Required | Type | Description |
|---|---|---|---|
| `kind` | Yes | `"theme"` | Must be the literal string `"theme"`. |
| `target` | Yes | `"booking"` | Must be the literal string `"booking"`. |
| `name` | Yes | `string` | Human-readable theme name. |
| `slug` | Yes | `string` | Unique identifier. Lowercase alphanumeric characters and hyphens only. |
| `version` | Yes | `string` | Semantic version string (e.g., `"1.0.0"`). |
| `description` | Yes | `string` | Brief description of the theme's design direction. |
| `portableThemeFile` | Yes | `string` | Relative path to the runtime theme payload (typically `"theme.json"`). |
| `settings` | Yes | `object` | Design token definitions (colors, typography). |
| `content` | No | `object` | Content overrides for booking interface copy. |
| `assets` | No | `object` | Mapping of asset keys to bundled file paths. |

## Theme Configuration

### Color Tokens

The `settings.colors` object defines the booking interface color palette. All values must be valid CSS color strings.

| Token | Description |
|---|---|
| `primary` | Primary brand color. Used for buttons, progress indicators, and key interactive elements. |
| `secondary` | Secondary color. Used for supporting UI elements and secondary actions. |
| `accent` | Accent color. Used for highlights, badges, and attention-drawing elements. |
| `background` | Base background color for the booking interface. |

The booking host also supports extended color tokens for fine-grained control:

| Token | Description |
|---|---|
| `elevated` | Background for elevated surfaces (cards, modals). |
| `card` | Background for card components. |
| `muted` | Background for muted/subdued sections. |
| `textPrimary` | Primary text color. |
| `textSecondary` | Secondary text color. |
| `textMuted` | Muted/subtle text color. |
| `border` | Default border color. |
| `borderHover` | Border color on hover states. |
| `footerBg` | Footer section background color. |
| `footerText` | Footer section text color. |

### Typography

The `settings.typography` object defines font families used across the booking interface.

| Token | Description |
|---|---|
| `headingFont` | Font family for headings and display text. |
| `bodyFont` | Font family for body text, labels, and general content. |

Fonts must be available via Google Fonts or bundled as assets within the theme.

## Content Overrides

The `content` object in both the manifest and `theme.json` allows themes to override user-facing copy throughout the booking interface. Content overrides are organized by section:

- **Page-level** — Title, description, meta information.
- **Header** — Title, subtitle, branch selector placeholder, reset messaging.
- **Sidebar** — Branch context, address, phone, business hours, powered-by attribution.
- **Hero** — Badge text, title, description, primary and secondary call-to-action labels.
- **Booking flow** — Badge text, title, description, summary label, continue action label.
- **Footer** — Badge text, title, description, call-to-action, powered-by attribution.
- **Success** — Confirmation badge, title, subtitle, calendar label, new booking label.
- **Claims** — Badge, title, description, submit label, success message, read-only state.
- **Plugin slots** — Contextual content for before-header, after-hero, footer, after-success, and after-claims slots.

Refer to the booking starter theme in the IDX Developer assets for a comprehensive content override structure.

## Asset Mapping

The `assets` object maps logical asset keys to bundled file paths. During upload, bundled assets are extracted to platform-managed storage and served via runtime-safe URLs.

| Key Pattern | Description |
|---|---|
| `logoUrl` | Brand logo displayed in the booking header and sidebar. |
| `poweredByLogoUrl` | Logo for the "powered by" attribution section. |

Asset paths must be relative to the bundle root. Supported formats include SVG, PNG, JPG, and WebP.

## Platform Rules

- `manifest.json` serves as the metadata and versioning entrypoint. It may reference a portable runtime payload via `portableThemeFile`.
- `theme.json` is the runtime source of truth when included in the bundle. The host application reads design tokens, content overrides, and asset references from this file.
- Themes cannot introduce unmanaged backend features or new booking endpoints.
- The bundle may provide compatible design tokens, content overrides, layout surface definitions, and asset references supported by the booking host.
- Assignment is per client and per target. A client may have one active `store` theme and one active `booking` theme simultaneously.
- Themes may only be assigned to clients after achieving `approved` review status through the platform's review pipeline.
- Theme files are brand assets and require approval before becoming eligible for client assignment.
