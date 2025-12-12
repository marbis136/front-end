import {
  IconUsersGroup,
  IconCalendarCheck,
  IconSchool,
  IconCertificate
} from '@tabler/icons-react';

const icons = {
  IconUsersGroup,
  IconCalendarCheck,
  IconSchool,
  IconCertificate
};

// ==============================|| HUMAN RESOURCES MENU ||============================== //
const rrhh = {
  id: 'rrhh',
  title: 'Human Resources',
  type: 'group',
  children: [
    {
      id: 'employees',
      title: 'Employees',
      type: 'item',
      url: '/rrhh/employees',
      icon: icons.IconUsersGroup
    },
    {
      id: 'attendance',
      title: 'Attendance',
      type: 'item',
      url: '/rrhh/attendance',
      icon: icons.IconCalendarCheck
    },
    {
      id: 'training',
      title: 'Training',
      type: 'item',
      url: '/rrhh/training',
      icon: icons.IconSchool
    },
    {
      id: 'certifications',
      title: 'Certifications',
      type: 'item',
      url: '/rrhh/certifications',
      icon: icons.IconCertificate
    }
  ]
};

export default rrhh;
