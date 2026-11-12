// =========================================================
// DistriLink — API client
// Every call to a microservice goes through here.
//
//   import { api } from "/js/api.js";
//   const products = await api.get("catalog", "/api/products");
//   const order    = await api.post("orders", "/api/orders", { items });
// =========================================================
import { API } from "./config.js";
import { getToken, logout } from "./session.js";

/** Error thrown for every non-2xx answer. Reads the ProblemDetail format of the backend. */
export class ApiError extends Error {
  constructor(status, title, detail, errors) {
    super(detail || title || `Error ${status}`);
    this.status = status;
    this.title = title;
    this.errors = errors || {};   // { campo: "mensaje" } for 400 validation errors
  }
}

async function request(service, path, { method = "GET", body, auth = true } = {}) {
  const base = API[service];
  if (!base) throw new Error(`Servicio desconocido: ${service}`);

  const headers = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  const token = getToken();
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(base + path, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, "Sin conexión",
      `No se pudo conectar con ${service}. Revisa que el servicio esté encendido en ${base}.`);
  }

  if (response.status === 401 && auth && token) {
    logout();   // expired or invalid token
    throw new ApiError(401, "Sesión vencida", "Tu sesión terminó. Vuelve a iniciar sesión.");
  }

  if (response.status === 204) return null;

  const isJson = (response.headers.get("Content-Type") || "").includes("json");
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const p = isJson ? data : {};
    throw new ApiError(response.status, p.title, p.detail || (typeof data === "string" ? data : ""), p.errors);
  }
  return data;
}

export const api = {
  get:    (service, path, opts)       => request(service, path, { ...opts, method: "GET" }),
  post:   (service, path, body, opts) => request(service, path, { ...opts, method: "POST", body }),
  put:    (service, path, body, opts) => request(service, path, { ...opts, method: "PUT", body }),
  patch:  (service, path, body, opts) => request(service, path, { ...opts, method: "PATCH", body }),
  delete: (service, path, opts)       => request(service, path, { ...opts, method: "DELETE" }),
};
