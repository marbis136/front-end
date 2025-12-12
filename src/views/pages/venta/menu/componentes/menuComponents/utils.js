import conectionbd from "../../conectionbd";

export let products = [];
export let subcategoriasPorCategoria = {};

export async function loadProducts() {
  products = await conectionbd();
  subcategoriasPorCategoria = getSubcategoriasPorCategoria();
}

export function getSubcategoriasPorCategoria() {
  const mapa = {};
  products.forEach(p => {
    if (!mapa[p.category]) {
      mapa[p.category] = [];
    }
    if (!mapa[p.category].includes(p.subcategory)) {
      mapa[p.category].push(p.subcategory);
    }
  });
  return mapa;
}

export const obtenerNombreProducto = (code) =>
  products.find((p) => p.code === String(code))?.name || `#${code}`;

export const obtenerPrecio = (item) => {
  if (item.tipo === "mitad") {
    const p1 = products.find((p) => p.code === String(item.prod1))?.price || 0;
    const p2 = products.find((p) => p.code === String(item.prod2))?.price || 0;
    return Math.max(p1, p2);
  }
  return products.find((p) => p.code === String(item.prod1))?.price || 0;
};
