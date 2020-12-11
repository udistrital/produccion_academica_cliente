// import { NbMenuItem } from '@nebular/theme';
import { MenuItem } from './menu-item';
import { icon } from 'leaflet';

export const MENU_ITEMS: MenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'nb-home',
    link: '/pages/dashboard',
    home: true,
    key: 'dashboard',
  },
  {
    title: 'Producción Academica',
    icon: 'nb-edit',
    link: '',
    key: 'produccion_academica',
    children: [
      {
        title: 'New Solicitudes',
        icon: 'nb-edit',
        link: '/pages/produccion_academica/new-solicitud',
        key: 'new_solicitud',
      },
      {
        title: 'Listar Producciones',
        icon: 'nb-list',
        link: '/pages/produccion_academica/list-produccion_academica',
        key: 'list_produccion_academica',
      },
      {
        title: 'Listar Producciones Aprobadas',
        icon: 'nb-list',
        link: '/pages/produccion_academica/list_aproved-produccion_academica',
        key: 'list_aproved_produccion_academica',
      },
    ],
  },
]
