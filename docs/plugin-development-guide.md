# IDX Plugin Development Guide

This document is the authoritative specification for developing plugins on the IDX Developer platform. Plugins are managed extension artifacts that ship frontend assets alongside optional declared capabilities such as public pages, admin views, form definitions, entity schemas, and notification strategies. All plugins remain brand-scoped, tenant-safe, and subject to per-client activation controls.

## Table of Contents

- [Bundle Contract](#bundle-contract)
- [Manifest Schema](#manifest-schema)
- [Available Hooks](#available-hooks)
- [Plugin Runtime API](#plugin-runtime-api)
- [Configuration Fields](#configuration-fields)
- [Platform Rules](#platform-rules)
- [Review Pipeline](#review-pipeline)
- [Forbidden Patterns](#forbidden-patterns)
- [Reference Example](#reference-example)

## Bundle Contract

A plugin bundle is a ZIP archive containing the following required root files:

- `manifest.json` — The metadata and configuration entrypoint.
- Runtime assets referenced by the manifest (JavaScript entry, optional stylesheet).

Minimal manifest structure:

```json
{
  "kind": "plugin",
  "name": "Readable Name",
  "slug": "readable-name",
  "version": "1.0.0",
  "description": "A concise description of the plugin's purpose.",
  "hooks": ["store.layout.footer"],
  "entry": "src/plugin.js",
  "stylesheet": "src/plugin.css",
  "config": {}
}
```

## Manifest Schema

| Field | Required | Type | Description |
|---|---|---|---|
| `kind` | Yes | `"plugin"` | Must be the literal string `"plugin"`. |
| `name` | Yes | `string` | Human-readable plugin name. |
| `slug` | Yes | `string` | Unique identifier. Lowercase alphanumeric characters and hyphens only. |
| `version` | Yes | `string` | Semantic version string (e.g., `"1.0.0"`). |
| `description` | Yes | `string` | Brief description of the plugin's functionality. |
| `hooks` | Yes | `string[]` | Array of hook identifiers where the plugin attaches to the host application. |
| `entry` | Yes | `string` | Relative path to the main JavaScript file. Must be browser-ready. |
| `stylesheet` | No | `string` | Relative path to an optional CSS file. |
| `configFields` | No | `array` | Array of configuration field definitions rendered in the admin panel. |
| `config` | No | `object` | Default configuration values. |
| `surfaces` | No | `string[]` | Target surfaces: `["store"]`, `["booking"]`, or both. |
| `capabilities` | No | `array` | Declared capabilities the plugin requires from the platform. |
| `publicPage` | No | `object` | Public page definition for plugins that expose a tenant-facing page. |

## Available Hooks

Hooks determine where a plugin's entry script is loaded within the host application. Each hook corresponds to a specific mount point in the storefront or booking interface.

### Store Hooks

| Hook | Mount Point |
|---|---|
| `store.layout.head` | Document head (before closing `</head>`) |
| `store.layout.footer` | Page footer region |
| `store.home.hero.after` | Immediately after the homepage hero section |
| `store.product.card.after` | After each product card in grid/list views |
| `store.product.detail.after` | After the product detail content |
| `store.checkout.summary.after` | After the checkout order summary |

### Booking Hooks

| Hook | Mount Point |
|---|---|
| `booking.layout.head` | Document head (before closing `</head>`) |
| `booking.layout.footer` | Page footer region |
| `booking.home.hero.after` | Immediately after the booking hero section |
| `booking.services.after` | After the service selection step |
| `booking.professionals.after` | After the professional selection step |
| `booking.confirmation.after` | After the booking confirmation |

## Plugin Runtime API

Once your plugin script loads in the browser, the global `window.IDX_PLUGIN` object provides the runtime interface for interacting with the host application.

### Obtaining the Plugin Identifier

```javascript
var pluginId = document.currentScript.dataset.idxPlugin
    || document.currentScript.dataset.idxPluginId
```

### Accessing Configuration

```javascript
var config = window.IDX_PLUGIN.getPluginConfig(pluginId)
```

### Lifecycle Events

```javascript
window.IDX_PLUGIN.on("runtime.ready", function (detail) {
  // detail.tenant — Current tenant context
  // detail.theme  — Active theme configuration
  // detail.plugins — Active plugin list
  // detail.slots  — Available slot elements
})

window.IDX_PLUGIN.on("runtime.dispose", function () {
  // Perform cleanup: remove DOM elements, detach event listeners, clear intervals
})
```

### API Reference

| Method | Description |
|---|---|
| `getPluginConfig(id)` | Returns the configuration object for the specified plugin. |
| `getSlotElement(slot)` | Returns the DOM element for the specified slot mount point. |
| `emit(event, detail)` | Dispatches a custom event to the runtime event bus. |
| `on(event, handler)` | Registers a listener for a custom event. Returns an unsubscribe function. |
| `widgets.showModal(opts)` | Opens a platform-managed modal dialog. |
| `widgets.showDrawer(opts)` | Opens a platform-managed drawer panel. |
| `widgets.showToast(opts)` | Displays a platform-managed toast notification. |

## Configuration Fields

Plugins may declare `configFields` in the manifest to expose per-client configuration options in the admin panel. Each field definition is rendered as a form control when an administrator activates the plugin for a client.

### Supported Field Types

| Type | Control | Description |
|---|---|---|
| `text` | Text input | Single-line text value. |
| `textarea` | Textarea | Multi-line text value. |
| `number` | Number input | Numeric value. |
| `boolean` | Toggle | Boolean flag. |
| `select` | Dropdown | Single selection from predefined options. |
| `json` | Code editor | Structured JSON data. |

### Example Declaration

```json
{
  "configFields": [
    {
      "key": "message",
      "label": "Default message",
      "type": "text",
      "placeholder": "Hello!"
    },
    {
      "key": "position",
      "label": "Position",
      "type": "select",
      "options": [
        { "value": "bottom-right", "label": "Bottom right" },
        { "value": "bottom-left", "label": "Bottom left" }
      ]
    }
  ]
}
```

## Platform Rules

- The `entry` field must reference a browser-ready `.js` or `.mjs` file. No build step is performed by the platform.
- The `stylesheet` field is optional and must reference a `.css` file.
- Hidden files, path traversal sequences, and unsupported file extensions are rejected during upload validation.
- Plugins are brand-scoped assets. They may only be activated per client after achieving `approved` review status.
- All declared capabilities must remain within IDX runtime contracts.
- Hooks, public pages, admin pages, forms, entities, and notification strategies must be explicitly declared in the manifest.
- CSS class names must be namespaced to the plugin (e.g., `idx-{plugin-slug}-*`) to prevent style conflicts with the host application.
- Use `document.createElement` for DOM manipulation. Direct `innerHTML` assignment is prohibited.
- All DOM elements, event listeners, and timers must be cleaned up on `runtime.dispose`.

## Review Pipeline

Every plugin upload undergoes an automated review pipeline before becoming eligible for client activation:

1. **Secure extraction** — The ZIP archive is validated and extracted in a sandboxed environment.
2. **Manifest validation** — The manifest is parsed and validated against the plugin contract schema.
3. **Static code analysis** — Source files are scanned for forbidden patterns and unsafe coding practices.
4. **Automated review** — An AI-assisted review evaluates code quality, contract compliance, and security posture.

If the automated review service is temporarily unavailable, the upload is preserved with a `review_error` status and remains blocked from activation until a subsequent review pass succeeds.

## Forbidden Patterns

The following patterns are detected during static analysis and will cause the review to fail:

| Pattern | Reason |
|---|---|
| `eval()`, `new Function()` | Dynamic code execution |
| `child_process`, `node:*` imports | Server-side module access |
| `process.*`, `require('fs')` | Node.js runtime access |
| `dangerouslySetInnerHTML` | Unsafe HTML injection (React) |
| `innerHTML =` (direct assignment) | Unsafe DOM manipulation |
| `XMLHttpRequest`, `WebSocket` | Unmanaged network connections |
| `document.cookie` | Cookie access |
| `fetch()` to raw IP addresses | Uncontrolled network requests |

## Reference Example

The `whatsapp-button` plugin included in this repository is a complete, production-ready example. It demonstrates:

1. **Manifest structure** — Proper declaration of hooks, configuration fields, capabilities, and target surfaces.
2. **Runtime integration** — Reading configuration via `getPluginConfig()`, DOM creation, event handling, and lifecycle cleanup.
3. **Stylesheet conventions** — Namespaced CSS classes (`idx-wa-*`), entrance animations, and responsive design.
4. **Configuration-driven behavior** — All UI behavior controlled by client-provided configuration (branch list, colors, position).

Refer to `plugins/whatsapp-button/` in this repository for the complete source.
