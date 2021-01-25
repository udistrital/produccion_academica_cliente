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
        link: '/pages/produccion_academica/list-produccion_academica/active',
        key: 'list_produccion_academica',
      },
      {
        title: 'Listar Producciones Aprobadas',
        icon: 'nb-list',
        link: '/pages/produccion_academica/list_aproved-produccion_academica',
        key: 'list_aproved_produccion_academica',
      },
      {
        title: 'Listar Producciones inactivas',
        icon: 'nb-list',
        link: '/pages/produccion_academica/list-produccion_academica/inactive',
        key: 'list_produccion_academica_inactive',
      },
    ],
  },
  {
    title:  'Solicitud Paquete',
    icon:  'nb-compose',
    link:  '',
    key:  'solicitud_paquete',
    children:  [
      {
        title:  'Paquetes',
        icon: 'nb-edit',
        link:  '/pages/admin_docencia/list_paquetes',
        key:  'paquetes',
      },
    ],
  },
  {
    title:  'Evaluacion Pares',
    icon:  'nb-compose',
    link:  '',
    key:  'evaluacion_pares',
    children:  [
      {
        title:  'Lista Invitaciones',
        icon: 'nb-edit',
        link:  '/pages/evaluacion_pares/list_invitaciones',
        key:  'lista_invitaciones',
      },
      {
        title: 'Listar Evaluacion',
        icon: 'nb-list',
        link: '/pages/evaluacion_pares/list_evaluaciones',
        key: 'lista_evaluaciones',
      },
    ],
  },
  {
    title:  'Inscripcion',
    icon:  'nb-compose',
    link:  '',
    key:  'inscripcion',
    children:  [
      {
        title:  'Pre Inscripcion',
        icon: 'nb-edit',
        link:  '/pages/inscripcion/preinscripcion',
        key:  'preinscripcion',
      },
    ],
  },
]
