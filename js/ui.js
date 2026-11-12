// =========================================================
// DistriLink — Small UI helpers shared by every page
// =========================================================

const money = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });
const dateTime = new Intl.DateTimeFormat("es-CO", { dateStyle: "medium", timeStyle: "short" });

/** 23000 → "$ 23.000" */
export const formatMoney = value => money.format(Number(value) || 0);

/** "2026-11-12T10:30:00" → "12 nov 2026, 10:30 a. m." */
export const formatDate = iso => (iso ? dateTime.format(new Date(iso)) : "");

/** Order states: always color + icon + text. */
const STATES = {
  PENDING:    { cls: "badge--pending",    icon: "⏳", text: "Pendiente" },
  CONFIRMED:  { cls: "badge--confirmed",  icon: "✔",  text: "Aprobado" },
  REJECTED:   { cls: "badge--rejected",   icon: "✖",  text: "Rechazado" },
  DISPATCHED: { cls: "badge--dispatched", icon: "🚚", text: "Despachado" },
  CANCELLED:  { cls: "badge--cancelled",  icon: "⦸",  text: "Cancelado" },
};

/** Returns the HTML of a status badge: statusBadge("CONFIRMED") */
export function statusBadge(status) {
  const s = STATES[status] || { cls: "badge--cancelled", icon: "•", text: status };
  return `<span class="badge ${s.cls}"><span aria-hidden="true">${s.icon}</span>${s.text}</span>`;
}

/** Short message at the bottom right: toast("Producto guardado", "success") */
export function toast(message, type = "info") {
  let area = document.querySelector(".toast-area");
  if (!area) {
    area = document.createElement("div");
    area.className = "toast-area";
    area.setAttribute("role", "status");
    area.setAttribute("aria-live", "polite");
    document.body.appendChild(area);
  }
  const el = document.createElement("div");
  el.className = `toast toast--${type}`;
  el.textContent = message;
  area.appendChild(el);
  setTimeout(() => el.remove(), 4000);
}

/** Shows the validation errors of an ApiError under each field: <div class="field" data-field="name"> */
export function showFieldErrors(form, errors = {}) {
  form.querySelectorAll(".field").forEach(f => {
    f.classList.remove("has-error");
    f.querySelector(".error")?.remove();
  });
  Object.entries(errors).forEach(([name, message]) => {
    const field = form.querySelector(`.field[data-field="${name}"]`);
    if (!field) return;
    field.classList.add("has-error");
    const p = document.createElement("p");
    p.className = "error";
    p.textContent = message;
    field.appendChild(p);
  });
}
