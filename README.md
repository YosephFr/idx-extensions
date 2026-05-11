# IDX Extensions

Public extension contract repository for IDX. This repo owns documentation,
schemas, examples and snapshots for plugin and theme authors. Runtime
validation/enforcement lives in `idx-engine`, while rendering/runtime
consumption lives in `idx-store`, `idx-booking` and admin surfaces in
`idx-front`.

This repo is not a service and is not part of root Docker Compose.

## Structure

| Path | Purpose |
|---|---|
| `docs/plugin-development-guide.md` | plugin bundle/runtime contract |
| `docs/store-theme-guide.md` | store theme authoring guide |
| `docs/booking-theme-guide.md` | booking theme authoring guide |
| `docs/themes/` | schemas, contracts and example theme JSON |
| `plugins/whatsapp-button/` | complete plugin example |
| `themes/piombino*/` | theme snapshots/examples |

## Contract Surfaces

| Contract | Runtime consumer |
|---|---|
| Store theme | `idx-store` theme runtime and admin/developer surfaces |
| Booking theme | `idx-booking` theme runtime and admin/developer surfaces |
| Plugin manifest/bundle | `idx-engine` developer module and storefront runtime hosts |
| Storefront slots | `idx-store/src/components/runtime/` |
| Booking slots | `idx-booking/src/components/runtime/` |

## Docs

- [docs/00-overview.md](docs/00-overview.md)
- [docs/01-plugin-contract.md](docs/01-plugin-contract.md)
- [docs/02-theme-contract.md](docs/02-theme-contract.md)
- [docs/03-storefront-slots.md](docs/03-storefront-slots.md)
- [docs/04-booking-slots.md](docs/04-booking-slots.md)
- [docs/05-examples-index.md](docs/05-examples-index.md)
- [docs/06-publishing-guidelines.md](docs/06-publishing-guidelines.md)
- [docs/plugin-development-guide.md](docs/plugin-development-guide.md)
- [docs/store-theme-guide.md](docs/store-theme-guide.md)
- [docs/booking-theme-guide.md](docs/booking-theme-guide.md)

## Invariants

- Document public extension contracts only.
- Do not document private platform runtime details here unless an extension
  author must know them.
- Keep examples complete enough to run through the developer/theme runtime.
- Keep schema changes synchronized with `idx-engine`, `idx-store`,
  `idx-booking` and `idx-front` docs.
