# Default Storefront Theme Contract

## Objetivo

Este documento describe el contrato real del default theme de `idx-store`. No documenta `idx-booking`.

La meta de este bundle no es exponer solo colores y tipografias. Debe representar el storefront actual de forma fiel: shell, rutas core, framing editable y coexistencia con plugins publicos, sin prometer backend nuevo ni reemplazo del host.

## Fuente de verdad runtime

El host de `idx-store` consume dos fuentes:

1. `client.settings.theme` como base persistida del storefront.
2. `activeDeveloperTheme` como overlay opcional del modulo developer.

Ambas pueden llegar en cualquiera de estas formas:

- payload plano con `colors`, `typography`, `logoUrl`, `heroImages`, `layout` y `content`
- bundle `{ theme, content }`

Los assets visuales publicados del theme pueden resolverse como:

- URL `https://...`
- ruta interna publicada como `/uploads/...` o cualquier otro path controlado del host

El merge real ocurre en [src/lib/store-runtime.ts](/home/ubuntu/idx/idx-store/src/lib/store-runtime.ts):

- `resolveStoreTheme()` unifica colores, tipografias, logo, hero images y layout.
- `resolveStoreRuntime()` unifica `theme`, `content`, plugins, slots y public pages.
- `buildThemeVars()` en [src/lib/theme-utils.ts](/home/ubuntu/idx/idx-store/src/lib/theme-utils.ts) deriva CSS vars desde el theme merged.

Consecuencia operativa: `theme.json` ya no representa solo overrides basicos. Puede describir el storefront actual completo dentro de los limites del host.

## Bundle de referencia

El bundle descargable recomendado sigue siendo estatico:

```text
default-theme/
  README.md
  manifest.json
  theme.json
  preview.png
```

Reglas:

- `manifest.json` documenta cobertura, rutas y compatibilidad; no es runtime payload.
- `theme.json` puede persistirse plano en `client.settings.theme` o viajar dentro de un bundle `{ theme, content }`.
- `preview.png` es solo un asset de referencia.

## Superficies reales del host

| Superficie | Archivo host | Lo que controla el theme | Lo que sigue fijo en el host |
| --- | --- | --- | --- |
| `header` | [src/components/layout/store-header.tsx](/home/ubuntu/idx/idx-store/src/components/layout/store-header.tsx) | `badge`, `tagline`, `announcement`, `items`, `secondaryLinks`, `primaryAction`, `logoUrl` | boton menu mobile, buscador, icono de carrito, comportamiento sticky |
| `navigation` | [src/components/layout/store-header.tsx](/home/ubuntu/idx/idx-store/src/components/layout/store-header.tsx), [src/components/layout/store-footer.tsx](/home/ubuntu/idx/idx-store/src/components/layout/store-footer.tsx), [src/components/layout/store-mobile-dock.tsx](/home/ubuntu/idx/idx-store/src/components/layout/store-mobile-dock.tsx) | lista compartida de links del storefront y rotulado base del dock movil | semantica de nav, fallbacks, seleccion final de items fijos mobile |
| `footer` | [src/components/layout/store-footer.tsx](/home/ubuntu/idx/idx-store/src/components/layout/store-footer.tsx) | `title`, `description`, `navigationTitle`, `contactTitle`, `contactText`, `links`, `columns`, `legalNote`, `copyrightText` | estructura general, plugin slots, year fallback |
| `home` | [src/app/page.tsx](/home/ubuntu/idx/idx-store/src/app/page.tsx) | hero, CTA, `heroActions`, intros, textos vacios, bloques, hero background via `heroImages[0]` | fetch de productos/categorias, featured fallback, product grid |
| `catalog` | [src/app/products/page.tsx](/home/ubuntu/idx/idx-store/src/app/products/page.tsx), [src/app/products/catalog-client.tsx](/home/ubuntu/idx/idx-store/src/app/products/catalog-client.tsx) | titulos, descripciones, search placeholder, labels, empty state, bloques, `layout` grid/list | query params, filtros reales, paginacion, category tree, cards |
| `product` | [src/app/products/[slug]/product-detail.tsx](/home/ubuntu/idx/idx-store/src/app/products/[slug]/product-detail.tsx) | back label, descripcion, quantity label, add-to-cart labels, related title, bloques | precio, stock, imagenes, categorias, add-to-cart logic |
| `cart` | [src/app/cart/cart-client.tsx](/home/ubuntu/idx/idx-store/src/app/cart/cart-client.tsx), [src/components/cart/cart-summary.tsx](/home/ubuntu/idx/idx-store/src/components/cart/cart-summary.tsx) | titulos, descripcion, empty state, CTA, labels de resumen, nota y bloques | items, total, mutaciones del carrito |
| `checkout` | [src/app/checkout/checkout-client.tsx](/home/ubuntu/idx/idx-store/src/app/checkout/checkout-client.tsx) | titulos, descripcion, empty state, textos del submit, nombres de secciones y bloques | validaciones, metodo de pago actual, creacion de orden |
| `plugin public page` | [src/app/plugins/[pluginSlug]/page.tsx](/home/ubuntu/idx/idx-store/src/app/plugins/[pluginSlug]/page.tsx), [src/app/plugins/[pluginSlug]/claims-book-client.tsx](/home/ubuntu/idx/idx-store/src/app/plugins/[pluginSlug]/claims-book-client.tsx) | shell global, tokens visuales y cualquier framing heredado del host | payload del formulario, textos propios del plugin y submit endpoint |

## Slots y paginas publicas de plugins

El host actual soporta estos slots documentados en [src/lib/types.ts](/home/ubuntu/idx/idx-store/src/lib/types.ts) y normalizados en [src/lib/store-runtime.ts](/home/ubuntu/idx/idx-store/src/lib/store-runtime.ts):

- `footer-links`
- `footer-before`
- `footer-after`
- `product-after-description`
- `cart-after-summary`
- `checkout-before-submit`

Ademas existe soporte para una pagina publica de plugin bajo `/plugins/[pluginSlug]`.

Estado actual:

- tipo soportado hoy: `claims-book`
- el theme no define el contenido funcional de esa pagina
- el plugin define `title`, `description`, `notice`, `legalText`, labels y `endpoint`
- el theme solo aporta shell, tokens y coherencia visual del host

## Reglas de merge

El merge runtime no es todo-o-nada:

- objetos se mezclan por clave
- arrays reemplazan el array completo del nivel correspondiente
- `header.items` tiene prioridad en header
- si `header.items` no existe, header usa `navigation.items`
- footer siempre usa `navigation.items` como mapa principal del storefront
- el dock movil toma `navigation.items` como base y puede sumar la primera public page activa del runtime
- `heroImages[0]` se usa como imagen principal del hero home

Eso permite que un bundle base describa el storefront completo y que un overlay cambie solo una parte del framing.

## Shape soportado por `theme.json`

El archivo `default-theme.schema.json` en este mismo directorio es la referencia valida para terceros.

En terminos funcionales, el shape soportado es:

```json
{
  "colors": {},
  "typography": {},
  "logoUrl": "https://... o /uploads/...",
  "heroImages": ["https://... o /uploads/..."],
  "layout": "grid",
  "content": {
    "header": {},
    "navigation": {},
    "footer": {},
    "home": {},
    "catalog": {},
    "product": {},
    "cart": {},
    "checkout": {}
  }
}
```

## Que si puede hacer un theme

- redefinir shell visual del storefront actual
- cambiar copy y framing de header, footer y paginas core
- definir CTA principal del header y acciones del hero
- cambiar layout inicial de catalogo entre `grid` y `list`
- cambiar hero y bloques editoriales de home
- convivir con plugin slots y con la ruta publica de plugins soportados

## Que no puede hacer un theme

- crear nuevas APIs, colas, cron jobs o tablas
- redefinir la logica del checkout, ordenes o pagos
- cambiar la fuente de datos de productos, categorias o stock
- crear una nueva pagina publica arbitraria fuera de las rutas del host
- controlar el payload funcional de `claims-book` ni de otro plugin publico
- inyectar HTML arbitrario, JS inline o secretos

Si un cambio requiere nueva data, nuevo endpoint o una ruta fuera del host actual, ya no es un theme: es trabajo de plugin o de producto/backend.

## Validacion minima

El schema y el sanitizado runtime imponen estas reglas:

- hex de 6 digitos para colores
- URLs `https` o rutas internas publicadas para `logoUrl` y `heroImages`
- links limitados a rutas internas, anchors, `https`, `mailto` o `tel`
- `additionalProperties: false` en superficies documentadas
- limite de items y de longitud por campo
- sin HTML arbitrario ni JS en el contrato del theme

## Bundle default esperado

El bundle default debe servir como radiografia del host real de `idx-store`, no como demo reducida. Por eso el manifest de ejemplo cubre:

- `header`, `navigation`, `footer`
- `home`, `catalog`, `product`, `cart`, `checkout`
- los plugin slots soportados
- la compatibilidad del host con `/plugins/[pluginSlug]`

Si el bundle no describe esas superficies, deja de ser una referencia fiel del storefront actual.
