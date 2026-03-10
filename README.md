# IDX Extensions

Official repository of extension resources for the [IDX Platform](https://indexa.ar) — a multi-tenant, whitelabel SaaS platform for commerce, booking, and customer engagement.

This repository provides production-ready examples and development guides for building **plugins** and **themes** on IDX. All resources follow the platform's extension contracts and are designed to serve as authoritative references for developers integrating with the IDX Developer module.

## Repository Structure

```
idx-extensions/
├── docs/
│   ├── plugin-development-guide.md      # Plugin authoring specification
│   ├── store-theme-guide.md             # Store theme host contract
│   └── booking-theme-guide.md           # Booking theme host contract
├── plugins/
│   └── whatsapp-button/                 # Floating WhatsApp button plugin
│       ├── manifest.json
│       └── src/
│           ├── plugin.js
│           └── plugin.css
└── themes/
    └── piombino/                        # Piombino restaurant storefront theme
        ├── manifest.json
        ├── theme.json
        ├── README.md
        └── assets/
            ├── logo.png
            ├── hero-1.jpg
            └── hero-2.jpg
```

## Guides

| Document | Description |
|---|---|
| [Plugin Development Guide](docs/plugin-development-guide.md) | Full specification for authoring IDX plugins — manifest schema, runtime API, hook system, configuration fields, and review pipeline. |
| [Store Theme Guide](docs/store-theme-guide.md) | Host contract for store themes — bundle structure, design tokens, content overrides, asset mapping, and deployment rules. |
| [Booking Theme Guide](docs/booking-theme-guide.md) | Host contract for booking themes — bundle structure, design tokens, content overrides, and assignment rules. |

## Examples

### Plugins

**WhatsApp Button** (`plugins/whatsapp-button/`) — A production-ready plugin that renders a floating WhatsApp contact button on storefronts. Demonstrates configuration-driven UI, multi-branch support, responsive design, and proper lifecycle management via the `IDX_PLUGIN` runtime API.

### Themes

**Piombino** (`themes/piombino/`) — A premium restaurant-oriented store theme featuring warm editorial aesthetics, custom typography (Arvo + Montserrat), full content overrides for every storefront section, and bundled brand assets. Serves as a comprehensive reference for the store theme contract.

## Getting Started

1. Review the relevant guide in `docs/` for the extension type you intend to build.
2. Study the corresponding example to understand manifest structure, runtime integration, and best practices.
3. Package your extension as a ZIP bundle conforming to the documented contract.
4. Upload the bundle through the IDX Developer section in the admin panel. The platform will validate, analyze, and review the artifact before it becomes available for client activation.

## Extension Lifecycle

All extensions follow a managed lifecycle within the IDX Developer module:

1. **Upload** — Submit a ZIP bundle through the admin panel.
2. **Validation** — Automated manifest and contract validation.
3. **Security Analysis** — Static code analysis for forbidden patterns and unsafe behaviors.
4. **Review** — Automated review process evaluating code quality, contract compliance, and security posture.
5. **Approval** — Once approved, the extension becomes available for per-client activation.
6. **Activation** — Brand administrators assign approved extensions to individual clients.

## Platform Constraints

- Plugins execute exclusively in the browser. Server-side code, Node.js imports, and raw network requests are not permitted.
- Themes operate within the host rendering contract. They cannot introduce unmanaged backend behavior.
- All extensions are brand-scoped and tenant-isolated. Activation is controlled per client.
- CSS class names must be namespaced to prevent style conflicts (e.g., `idx-{plugin-slug}-*`).
- Extensions must clean up all DOM elements and event listeners on `runtime.dispose`.

## License

Proprietary. These resources are provided for development purposes within the IDX Platform ecosystem.
