// =========================================================
// DistriLink — Session (JWT in the browser)
// =========================================================
import { ROUTES, DEV_MODE, loginPage } from "./config.js";

const KEY = "distrilink.session";

function readRaw() {
  try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; }
}

/** Decodes the payload of a JWT (it does NOT verify the signature; the backend does). */
export function decodeToken(token) {
  try {
    const part = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(part).split("").map(c => "%" + c.charCodeAt(0).toString(16).padStart(2, "0")).join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/** Saves the token returned by POST /api/auth/login. */
export function saveSession(accessToken) {
  const claims = decodeToken(accessToken);
  if (!claims) throw new Error("Token inválido");
  localStorage.setItem(KEY, JSON.stringify({ accessToken, demo: false }));
  return getUser();
}

/** Current user: { id, email, name, role, exp } or null if there is no valid session. */
export function getUser() {
  const raw = readRaw();
  if (!raw) return null;
  const claims = raw.demo ? raw.claims : decodeToken(raw.accessToken);
  if (!claims) return null;
  if (claims.exp && claims.exp * 1000 < Date.now()) { clearSession(); return null; }
  return { id: claims.sub, email: claims.email, name: claims.name, role: claims.role, exp: claims.exp };
}

export function getToken() {
  const raw = readRaw();
  return raw && !raw.demo ? raw.accessToken : null;
}

export function clearSession() {
  localStorage.removeItem(KEY);
}

export function logout() {
  clearSession();
  window.location.href = loginPage();
}

/**
 * Call it at the top of every private page.
 *   requireRole("CUSTOMER")   → only customers
 *   requireRole()             → any logged-in user
 * Redirects to the login page when there is no session or the role does not match.
 */
export function requireRole(role) {
  const user = getUser();
  if (!user) { window.location.href = loginPage(); return null; }
  if (role && user.role !== role) { window.location.href = ROUTES.home[user.role] || loginPage(); return null; }
  return user;
}

/** Development only: simulates a session so pages can be built before the real login exists. */
export function startDemoSession(role) {
  if (!DEV_MODE) throw new Error("DEV_MODE está apagado");
  const claims = {
    sub: role === "DISTRIBUTOR" ? "7" : "15",
    email: role === "DISTRIBUTOR" ? "bodega@elsol.com" : "tienda@donpepe.com",
    name: role === "DISTRIBUTOR" ? "Distribuidora El Sol" : "Tienda Don Pepe",
    role,
    exp: Math.floor(Date.now() / 1000) + 8 * 3600,
  };
  localStorage.setItem(KEY, JSON.stringify({ demo: true, claims }));
  return getUser();
}
