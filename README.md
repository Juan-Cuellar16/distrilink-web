# distrilink-web

Web client of **DistriLink**, the B2B ordering platform between neighborhood shops (Customers) and wholesale distributors. Plain **HTML, CSS and JavaScript** (ES modules), responsive, no framework.

## Run it locally

1. Open this folder in VS Code.
2. Install the **Live Server** extension.
3. Right click `index.html` → **Open with Live Server**. It opens on `http://127.0.0.1:5500`.

> Paths start with `/` (for example `/css/tokens.css`), so Live Server must be opened at the **root of this repository**.

Until the real login exists, open `/pages/dev/sesion-demo.html` and choose Customer or Distributor to see the pages with a simulated session (`DEV_MODE` in `js/config.js`).

## Structure

| Path | What it is | Owner |
|------|------------|-------|
| `css/tokens.css` | Colors, fonts, spacing. **The only place with hex colors.** | Juan |
| `css/base.css`, `css/components.css` | Reset, layout and shared components | Juan |
| `js/config.js` | URL of each microservice (8081–8084) | Juan |
| `js/api.js` | `api.get/post/put/patch/delete(service, path, body)`, adds the JWT and reads ProblemDetail errors | Juan |
| `js/session.js` | Token, current user, `requireRole()`, `logout()` | Juan |
| `js/navbar.js`, `js/breadcrumb.js` | Navbar (same on every page of a role) and breadcrumb | Juan |
| `js/cart.js` | Cart in `localStorage` (`distrilink.cart`), one distributor per order | Juan · used by Alfredo and Jhojan |
| `js/ui.js` | `formatMoney`, `formatDate`, `statusBadge`, `toast`, `showFieldErrors` | Juan |
| `pages/auth/` | Login, register, password recovery, account | Sebastián |
| `pages/cliente/` | Catalog (Alfredo), cart and my orders (Jhojan), home and notifications (Juan) | — |
| `pages/distribuidor/` | Inventory (Alfredo), order inbox (Jhojan), home and notifications (Juan) | — |
| `pages/plantilla.html` | Template to copy for every new page | — |
| `pages/guia-estilos.html` | Every shared component, ready to copy | — |

## Rules

1. Every new page starts as a copy of `pages/plantilla.html`.
2. No loose colors or fonts: only `var(--...)` from `tokens.css`.
3. Every private page calls `requireRole()`, `renderNavbar()` and `renderBreadcrumb()`.
4. Every call to the backend goes through `js/api.js`.
5. Order states always show color + icon + text (`statusBadge()`).
6. Works from 360 px wide.
7. Branches `feat/...` from `dev`, Conventional Commits, Pull Request with review, squash and merge.

## Backend

| Service | URL | Swagger |
|---------|-----|---------|
| access-control-service | http://localhost:8081 | `/swagger-ui.html` |
| catalog-service | http://localhost:8082 | `/swagger-ui.html` |
| order-service | http://localhost:8083 | `/swagger-ui.html` |
| notification-service | http://localhost:8084 | `/swagger-ui.html` |

Each service must allow CORS for `http://127.0.0.1:5500` and `http://localhost:5500`.
