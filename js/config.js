// =========================================================
// DistriLink — Configuration
// The only place where the backend URLs are written.
// =========================================================

export const API = {
  auth:         "http://localhost:8081", // access-control-service (Sebastián)
  catalog:      "http://localhost:8082", // catalog-service (Alfredo)
  orders:       "http://localhost:8083", // order-service (Jhojan)
  notifications:"http://localhost:8084", // notification-service (Juan)
};

export const ROLES = {
  CUSTOMER: "CUSTOMER",
  DISTRIBUTOR: "DISTRIBUTOR",
};

// Pages every role lands on after login, and the login page itself.
export const ROUTES = {
  login: "/pages/auth/login.html",
  home: {
    CUSTOMER: "/pages/cliente/inicio.html",
    DISTRIBUTOR: "/pages/distribuidor/inicio.html",
  },
};

// true while developing: enables /pages/dev/sesion-demo.html
// to simulate a logged-in user before the real login exists.
// Set to false before the final delivery.
export const DEV_MODE = true;
