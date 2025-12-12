// assets
import { IconLayoutDashboard } from '@tabler/icons-react';

// constant
const icons = { IconLayoutDashboard };

// ==============================|| DASHBOARD MENU ||============================== //
const dashboard = {
  id: 'dashboard',
  title: 'Overview',
  icon: icons.IconLayoutDashboard,
  type: 'group',
  children: [
    {
      id: 'home',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard',
      icon: icons.IconLayoutDashboard,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
