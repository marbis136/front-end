import { IconKey } from '@tabler/icons-react';

const icons = { IconKey };

// ==============================|| PAGES MENU ||============================== //
const pages = {
  id: 'pages',
  title: 'Pages',
  type: 'group',
  children: [
    {
      id: 'auth',
      title: 'Authentication',
      type: 'collapse',
      icon: icons.IconKey,
      children: [
        {
          id: 'login',
          title: 'Login',
          type: 'item',
          icon: icons.IconKey,
          url: '/pages/login',
          target: true
        },
        {
          id: 'register',
          title: 'Register',
          type: 'item',
          icon: icons.IconKey,
          url: '/pages/register',
          target: true
        }
      ]
    }
  ]
};

export default pages;
