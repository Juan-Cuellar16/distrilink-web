// =========================================================
// DistriLink — Navbar (the same on every page of a role)
//
// In the page:  <header id="navbar"></header>
//               renderNavbar("catalogo");   ← key of the active link
// =========================================================
import { getUser, logout } from "./session.js";
import { cartCount } from "./cart.js";

const MENUS = {
  CUSTOMER: [
    { key: "inicio",         label: "Inicio",         href: "/pages/cliente/inicio.html" },
    { key: "catalogo",       label: "Catálogo",       href: "/pages/cliente/catalogo.html" },
    { key: "mis-pedidos",    label: "Mis pedidos",    href: "/pages/cliente/mis-pedidos.html" },
    { key: "carrito",        label: "🛒 Carrito",      href: "/pages/cliente/carrito.html", count: () => cartCount() },
    { key: "notificaciones", label: "🔔 Notificaciones", href: "/pages/cliente/notificaciones.html", count: () => notificationCount },
  ],
  DISTRIBUTOR: [
    { key: "inicio",         label: "Inicio",         href: "/pages/distribuidor/inicio.html" },
    { key: "inventario",     label: "Inventario",     href: "/pages/distribuidor/inventario.html" },
    { key: "pedidos",        label: "Pedidos",        href: "/pages/distribuidor/bandeja.html" },
    { key: "notificaciones", label: "🔔 Notificaciones", href: "/pages/distribuidor/notificaciones.html", count: () => notificationCount },
  ],
};

let notificationCount = 0;
let currentKey = null;

/** Updates the bell counter (notification-service calls it). */
export function setNotificationCount(n) {
  notificationCount = n;
  if (currentKey) renderNavbar(currentKey);
}

export function renderNavbar(activeKey) {
  currentKey = activeKey;
  const host = document.getElementById("navbar");
  const user = getUser();
  if (!host || !user) return;

  const items = (MENUS[user.role] || []).map(item => {
    const n = item.count ? item.count() : 0;
    const current = item.key === activeKey ? ' aria-current="page"' : "";
    const badge = n > 0 ? `<span class="navbar__count" aria-label="${n} pendientes">${n}</span>` : "";
    return `<li><a class="navbar__link" href="${item.href}"${current}>${item.label}${badge}</a></li>`;
  }).join("");

  const roleLabel = user.role === "DISTRIBUTOR" ? "Distribuidor" : "Cliente";
  host.innerHTML = `
    <nav class="navbar" aria-label="Menú principal">
      <div class="navbar__inner">
        <a class="navbar__brand" href="${MENUS[user.role]?.[0]?.href || "/"}">DistriLink <span>${roleLabel}</span></a>
        <button class="navbar__toggle" type="button" aria-expanded="false" aria-controls="navbar-menu">☰<span class="visually-hidden">Abrir menú</span></button>
        <ul class="navbar__menu" id="navbar-menu">
          ${items}
          <li><a class="navbar__link" href="/pages/auth/cuenta.html"${activeKey === "cuenta" ? ' aria-current="page"' : ""}>👤 ${escapeHtml(user.name || "Mi cuenta")}</a></li>
          <li><button class="navbar__link" type="button" data-logout>Salir</button></li>
        </ul>
      </div>
    </nav>`;

  const nav = host.querySelector(".navbar");
  const toggle = host.querySelector(".navbar__toggle");
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  host.querySelector("[data-logout]").addEventListener("click", logout);
}

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

// Keep the cart counter in sync when another tab changes the cart.
window.addEventListener("storage", e => {
  if (e.key === "distrilink.cart" && currentKey) renderNavbar(currentKey);
});
window.addEventListener("cart:changed", () => { if (currentKey) renderNavbar(currentKey); });
