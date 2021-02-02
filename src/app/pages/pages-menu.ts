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
    icon: 'nb-compose',
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
        title: 'Listar Solicitudes Proceso',
        icon: 'nb-list',
        link: '/pages/produccion_academica/list-produccion_academica/active',
        key: 'list_solicitudes_proceso',
      },
      {
        title: 'Listar Solicitudes para revision de comite',
        icon: 'nb-list',
        link: '/pages/produccion_academica/list_aproved-produccion_academica',
        key: 'list_solicitudes_revision_comite',
      },
      {
        title: 'Listar Solicitudes inactivas',
        icon: 'nb-list',
        link: '/pages/produccion_academica/list-produccion_academica/inactive',
        key: 'list_solicitudes_inactivas',
      },
    ],
  },
  {
    title:  'Administracion',
    icon:  'nb-compose',
    link:  '',
    key:  'administracion',
    children:  [
      {
        title:  'Paquetes',
        icon: 'nb-list',
        link:  '/pages/admin_docencia/list_paquetes',
        key:  'paquetes',
      },
      // {
      //   title:  'Reportes',
      //   icon: 'nb-edit',
      //   link:  '/pages/admin_docencia/reportes',
      //   key:  'reportes',
      // },
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
        icon: 'nb-list',
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
        title:  'Inscripcion Par Academico',
        icon: 'nb-edit',
        link:  '/pages/inscripcion/preinscripcion',
        key:  'inscripcion_par_academico',
      },
    ],
  },
]
