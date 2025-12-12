// src/hooks/useFilteredMenu.js
import menuItems from '../menu-items';

export default function useFilteredMenu(permisos) {
  if (!permisos?.menus) return { items: [] };

  const filtered = menuItems.items.filter((item) =>
    permisos.menus.includes(item.id) // usamos el `id` de cada menú
  );

  return { items: filtered };
}
