// =========================================================
// DistriLink — Breadcrumb (on every inner page)
//
// In the page:  <nav id="breadcrumb"></nav>
//   renderBreadcrumb([
//     ["Inicio", "/pages/cliente/inicio.html"],
//     ["Mis pedidos", "/pages/cliente/mis-pedidos.html"],
//     ["Pedido #120"],                       ← last item: current page, no link
//   ]);
// =========================================================

export function renderBreadcrumb(steps) {
  const host = document.getElementById("breadcrumb");
  if (!host) return;
  host.className = "breadcrumb";
  host.setAttribute("aria-label", "Ruta de navegación");
  const last = steps.length - 1;
  host.innerHTML = `<ol>${steps.map(([label, href], i) =>
    i === last || !href
      ? `<li><span aria-current="page">${escapeHtml(label)}</span></li>`
      : `<li><a href="${href}">${escapeHtml(label)}</a></li>`
  ).join("")}</ol>`;
}

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
