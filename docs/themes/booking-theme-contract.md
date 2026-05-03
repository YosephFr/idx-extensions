# Default Booking Theme Contract

This document defines the current default booking theme contract for `idx-booking`.
It describes the host surfaces that already exist in the runtime, the supported JSON shape, and the restrictions that keep the booking flow safe and predictable.

## Scope

The current booking host exposes:

- A desktop shell with fixed sidebar branding and branch context
- A mobile shell with sticky header and slide-in menu
- A booking hero tied to the active booking state
- The booking flow footer and CTA area
- The success state after reservation confirmation
- A public claims page rendered at `/[publicPage]` when an approved claims-capable plugin is active
- Theme slot content that can decorate supported plugin slots without shipping arbitrary code

The host contract is resolved in [`src/lib/theme-utils.ts`](../../../idx-booking/src/lib/theme-utils.ts) and consumed from:

- [`src/components/layout/layout.tsx`](../../../idx-booking/src/components/layout/layout.tsx)
- [`src/components/layout/header.tsx`](../../../idx-booking/src/components/layout/header.tsx)
- [`src/components/layout/sidebar.tsx`](../../../idx-booking/src/components/layout/sidebar.tsx)
- [`src/components/layout/mobile-menu.tsx`](../../../idx-booking/src/components/layout/mobile-menu.tsx)
- [`src/components/layout/site-footer.tsx`](../../../idx-booking/src/components/layout/site-footer.tsx)
- [`src/components/runtime/booking-hero.tsx`](../../../idx-booking/src/components/runtime/booking-hero.tsx)
- [`src/components/booking/booking-footer.tsx`](../../../idx-booking/src/components/booking/booking-footer.tsx)
- [`src/components/booking/success-screen.tsx`](../../../idx-booking/src/components/booking/success-screen.tsx)
- [`src/components/runtime/claims-page.tsx`](../../../idx-booking/src/components/runtime/claims-page.tsx)

## Resolution Order

The runtime merges theme data in this order:

1. `overrides`
2. Root-level bundle fields
3. `theme`
4. Legacy starter aliases (`settings`, `content`, `assets.logoUrl`, `logoUrl`)
5. `tenant.client.settings.theme`
6. `tenant.brand.settings.theme`
7. Runtime defaults from [`src/lib/theme-utils.ts`](../../../idx-booking/src/lib/theme-utils.ts)

This means a production-ready bundle should keep its reusable default data under `theme` and use `overrides` only for narrow tenant-specific patches.
The legacy starter aliases exist only for compatibility with the current developer kit and should not be treated as the long-term primary contract.

## Supported Sections

| Section | Purpose | Fields actively used by the current host |
| --- | --- | --- |
| `layout` | Global booking shell copy and emphasis | `eyebrow`, `title`, `description`, `highlight` |
| `header` | Mobile sticky header and reset modal | `title`, `subtitle`, `branchPlaceholder`, `resetTitle`, `resetDescription` |
| `sidebar` | Desktop sidebar branding and branch context | `title`, `subtitle`, `branchLabel`, `addressLabel`, `phoneLabel`, `hoursLabel`, `poweredByLabel`, `poweredByHref`, `poweredByCtaLabel` |
| `mobileMenu` | Mobile drawer content | `title`, `subtitle`, `closeLabel`, `addressLabel`, `phoneLabel`, `hoursLabel`, `poweredByLabel`, `poweredByHref`, `poweredByCtaLabel` |
| `hero` | Booking landing hero | `badge`, `title`, `description`, `primaryCta`, `secondaryCta` |
| `booking` | Booking flow summary copy | `badge`, `description`, `summaryLabel`, `continueLabel` |
| `footer` | Footer card, powered-by row and CTA | `badge`, `title`, `description`, `cta`, `poweredByLabel`, `poweredByHref`, `poweredByCtaLabel` |
| `success` | Reservation success state | `badge`, `title`, `subtitle`, `calendarLabel`, `newBookingLabel`, `summaryLabel` |
| `claims` | Claims public page branding and copy | `badge`, `title`, `description`, `submitLabel`, `successTitle`, `successDescription`, `readOnlyTitle`, `readOnlyDescription` |

### Accepted But Not Fully Mounted Yet

These keys are currently accepted by the runtime types but are not visibly rendered by the host today:

- `header.branchLabel`
- `mobileMenu.branchLabel`
- `booking.title`

Do not rely on those keys for a production theme until the host starts rendering them explicitly.

## Assets, Colors, Typography, Copy

### Assets

Supported asset keys:

- `assets.logo`
- `assets.poweredByLogo`

The host does not read arbitrary asset groups from the theme bundle.
For compatibility with the current starter bundle, `assets.logoUrl` and `assets.poweredByLogoUrl` are also accepted as aliases, but the canonical contract remains `assets.logo` and `assets.poweredByLogo`.

### Colors

Supported color tokens:

- `primary`
- `secondary`
- `accent`
- `background`
- `elevated`
- `card`
- `muted`
- `textPrimary`
- `textSecondary`
- `textMuted`
- `border`
- `borderHover`
- `footerBackground`
- `footerText`

Notes:

- If `footerBackground` is omitted, the runtime can fall back to the theme `secondary` color before using its hardcoded default.
- Unknown color keys are ignored by the host.

### Typography

Supported typography keys:

- `headingFont`
- `bodyFont`

Google Fonts are preloaded automatically unless the family matches a system font fallback.

### Copy Overrides

Supported copy override keys:

- `pageTitle`
- `pageDescription`
- `headerTitle`
- `headerSubtitle`
- `footerBadge`
- `footerTitle`
- `footerDescription`
- `footerCtaLabel`
- `footerCtaHref`
- `poweredByLabel`
- `poweredByHref`
- `poweredByCtaLabel`
- `successTitle`
- `successSubtitle`
- `newBookingLabel`

These overrides are fallback-oriented. They do not replace the structured section data model; they fill gaps when a section field is omitted.

## Plugin Slots

The booking host currently exposes these slot identifiers:

- `layout.beforeHeader`
- `layout.afterHeader`
- `layout.hero.before`
- `layout.hero.after`
- `layout.beforeContent`
- `layout.afterContent`
- `layout.footer.before`
- `layout.footer`
- `layout.footer.after`
- `booking.hero.before`
- `booking.hero.after`
- `booking.footer.before`
- `booking.footer.after`
- `booking.success.before`
- `booking.success.after`
- `booking.claims.before`
- `booking.claims.after`

`slots` in a theme bundle can provide lightweight content for those placements, using:

- `badge`
- `title`
- `description`
- `ctaLabel`
- `ctaHref`

Unsupported slot names are normalized by the runtime and may collapse into the default fallback slot instead of rendering where the theme author intended. Only use the canonical slot names listed above.

## Routes And Host States

The current default booking theme can influence two route families:

- `/`
  State transitions inside the page: booking flow -> success state
- `/[publicPage]`
  Used by the public claims page only when an approved claims-capable plugin exposes a public page path

Important constraints:

- The theme does not create or register routes.
- The theme does not define claims submission transport.
- The theme does not own the claims form schema, booking validation, availability resolution, or reservation APIs.

## Restrictions

The default booking theme contract is intentionally data-only.

- No arbitrary React, TypeScript, or JavaScript from the theme bundle is executed by `idx-booking`.
- No backend handlers, cron jobs, queue workers, or server actions can be declared from the theme contract.
- No custom API base URLs, booking logic, or availability algorithms can be changed by the theme.
- No additional public pages can be created from the theme alone.
- The claims page can only be branded if the runtime already resolved an approved claims-capable plugin.
- Unknown keys are tolerated but ignored; they should not be treated as extension points.
- The theme can skin plugin slots, but it cannot replace the plugin runtime bridge.

## Valid Examples

Canonical reference files shipped with this repo:

- `default-booking-theme.manifest.json`
- `default-booking-theme.example.json`

Minimal valid shape:

```json
{
  "name": "Booking Theme",
  "slug": "booking-theme",
  "theme": {
    "colors": {
      "primary": "#ec7623"
    },
    "hero": {
      "title": "Book your next visit"
    },
    "claims": {
      "title": "Claims and requests"
    }
  }
}
```

Starter-compatible legacy shape currently accepted by the host:

```json
{
  "name": "Booking Theme",
  "slug": "booking-theme",
  "settings": {
    "colors": {
      "primary": "#14532d"
    },
    "typography": {
      "headingFont": "Plus Jakarta Sans",
      "bodyFont": "Plus Jakarta Sans"
    }
  },
  "content": {
    "bookingHeadline": "Reserva online con el host actual de IDX",
    "bookingSubtitle": "Este starter necesita expandirse antes de pasar una review completa."
  },
  "assets": {
    "logoUrl": "assets/logo.svg"
  }
}
```

Compatibility notes for that starter shape:

- `settings.colors` maps into the same color tokens used by `theme.colors`
- `settings.typography` maps into `theme.typography`
- `content.bookingHeadline` and `content.bookingSubtitle` feed the booking shell as fallback copy
- `content.claimsHeadline` and `content.claimsDescription` are also accepted if the starter is enriched later
- `assets.logoUrl` is accepted as an alias for `assets.logo`

Review guidance:

- The legacy starter shape is useful for bootstrapping, but it is not enough for a production-grade booking theme review.
- To match the current host, expand the bundle into the full `theme` structure from `default-booking-theme.example.json`.
- In practice, that means filling at least `header`, `sidebar`, `mobileMenu`, `hero`, `booking`, `footer`, `success`, `claims`, and any supported `slots` you want to style.
- If the brand uses the claims plugin, include explicit `claims` copy instead of relying on generic defaults.

Production-grade recommendation for parity with the current host:

- Provide all sections from the example bundle, not just colors and a hero title.
- Provide both logos if the footer and sidebar should feel branded.
- Provide `claims` copy whenever the booking brand activates the claims plugin.
- Provide slot content only for canonical slot names.

## Invalid Patterns

These examples are outside the contract even if the JSON itself is syntactically valid:

```json
{
  "theme": {
    "components": {
      "Hero": "./hero.tsx"
    }
  }
}
```

Why invalid:

- The booking host does not load component code from the theme bundle.

```json
{
  "theme": {
    "claims": {
      "submitUrl": "https://external.example/claims"
    }
  }
}
```

Why invalid:

- Claims submission transport is owned by the approved plugin runtime, not by the theme contract.

```json
{
  "theme": {
    "routes": [
      "/express-checkout"
    ]
  }
}
```

Why invalid:

- Themes cannot register new routes in `idx-booking`.

## Recommended Bundle Layout

Use this structure for serious bundles:

1. Root metadata: `name`, `slug`, `status`, `active`, `assets`, optional `manifest`
2. Base theme data inside `theme`
3. Narrow tenant-specific patches inside `overrides`
4. Avoid mixing repeated values across root, `theme`, and `overrides` unless you are intentionally using the resolution order

This keeps the bundle aligned with the current runtime without pretending that the host already supports full React-level theme replacement.
