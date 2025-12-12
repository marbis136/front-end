// menu/gestionVentas.js
import {
  IconList,          // Menú
  IconClipboardList, // Pedidos
  IconShoppingCart,  // Ventas
  IconReceipt2,      // Gastos
  IconCash           // Caja
} from '@tabler/icons-react';

const gestionVentas = {
  id: 'ventas-group',
  title: 'Ventas',
  type: 'group',
  children: [
    {
      id: 'menu',
      title: 'Menú',
      type: 'item',
      url: '/menu',
      icon: IconList
    },
    {
      id: 'pedidos',
      title: 'Pedidos',
      type: 'item',
      url: '/pedidos',
      icon: IconClipboardList
    },
    {
      id: 'ventas',
      title: 'Ventas',
      type: 'item',
      url: '/ventas',
      icon: IconShoppingCart
    },
    {
      id: 'gastos',
      title: 'Gastos',
      type: 'item',
      url: '/gastos',
      icon: IconReceipt2
    },
    {
      id: 'caja',
      title: 'Caja',
      type: 'item',
      url: '/caja',
      icon: IconCash
    },
    {
      id: 'usuario',
      title: 'Usuario',
      type: 'item',
      url: '/usuario',
      icon: IconCash
    }

  ]
};

export default gestionVentas;
