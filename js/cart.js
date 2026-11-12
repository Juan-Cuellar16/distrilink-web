// =========================================================
// DistriLink — Cart in the browser (contract agreed by the team)
//
// localStorage "distrilink.cart":
// { "distributorId": 7,
//   "items": [ { "productId": 31, "name": "Arroz 500 g", "unitPrice": 2300, "quantity": 12 } ] }
//
// One order goes to ONE distributor. The final price is confirmed by
// order-service with catalog-service when the order is sent.
// =========================================================

const KEY = "distrilink.cart";

export function getCart() {
  try {
    const cart = JSON.parse(localStorage.getItem(KEY));
    if (cart && Array.isArray(cart.items)) return cart;
  } catch { /* empty or broken: start again */ }
  return { distributorId: null, items: [] };
}

function save(cart) {
  localStorage.setItem(KEY, JSON.stringify(cart));
  window.dispatchEvent(new CustomEvent("cart:changed", { detail: cart }));
}

/**
 * Adds a product. If the cart has products of ANOTHER distributor it throws an error,
 * so the page can ask the customer to empty the cart first.
 */
export function addToCart({ productId, name, unitPrice, distributorId }, quantity = 1) {
  const cart = getCart();
  if (cart.distributorId && cart.distributorId !== distributorId && cart.items.length) {
    const err = new Error("El carrito tiene productos de otro distribuidor. Vacíalo para empezar un pedido nuevo.");
    err.code = "OTHER_DISTRIBUTOR";
    throw err;
  }
  cart.distributorId = distributorId;
  const line = cart.items.find(i => i.productId === productId);
  if (line) line.quantity += quantity;
  else cart.items.push({ productId, name, unitPrice, quantity });
  save(cart);
  return cart;
}

export function setQuantity(productId, quantity) {
  const cart = getCart();
  cart.items = cart.items
    .map(i => (i.productId === productId ? { ...i, quantity } : i))
    .filter(i => i.quantity > 0);
  if (!cart.items.length) cart.distributorId = null;
  save(cart);
  return cart;
}

export function removeFromCart(productId) {
  return setQuantity(productId, 0);
}

export function clearCart() {
  save({ distributorId: null, items: [] });
}

export function cartCount() {
  return getCart().items.reduce((sum, i) => sum + i.quantity, 0);
}

export function cartTotal() {
  return getCart().items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
}
