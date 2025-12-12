import {
  IconShoppingBag,
  IconChartBar,
  IconBuildingBank,
  IconCalendarEvent,
  IconFileDescription
} from '@tabler/icons-react';

const icons = {
  IconShoppingBag,
  IconChartBar,
  IconBuildingBank,
  IconCalendarEvent,
  IconFileDescription
};

// ==============================|| APPLICATIONS MENU ||============================== //
const apps = {
  id: 'applications',
  title: 'Applications',
  type: 'group',
  children: [
    {
      id: 'ecommerce',
      title: 'E-commerce',
      type: 'item',
      url: '/apps/ecommerce',
      icon: icons.IconShoppingBag
    },
    {
      id: 'analytics',
      title: 'Analytics',
      type: 'item',
      url: '/apps/analytics',
      icon: icons.IconChartBar
    },
    {
      id: 'banking',
      title: 'Banking',
      type: 'item',
      url: '/apps/banking',
      icon: icons.IconBuildingBank
    },
    {
      id: 'booking',
      title: 'Booking',
      type: 'item',
      url: '/apps/booking',
      icon: icons.IconCalendarEvent
    },
    {
      id: 'file',
      title: 'File',
      type: 'item',
      url: '/apps/file',
      icon: icons.IconFileDescription
    }
  ]
};

export default apps;
