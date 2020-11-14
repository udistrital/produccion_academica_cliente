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
        title: 'Listar Producciones',
        icon: 'nb-list',
        link: '/pages/produccion_academica/list-produccion_academica',
        key: 'list_produccion_academica',
      },
    ],
  },
  {
    title: 'Calendario académico',
    icon: 'nb-compose',
    link: '',
    key: 'calendarioacademico',
    children: [
      {
        title: 'Listar calendarios académicos',
        icon: 'nb-list',
        link: '/pages/calendario-academico/list-calendario-academico',
        key: 'list_calendarioacademico',
      },
    ],
  },
  {
    title: 'Calendarioevento',
    icon: 'nb-compose',
    link: '/pages/calendarioevento',
    key: 'calendarioevento',
    children: [
      {
        title: 'Lista Calendarioevento',
        link: '/pages/calendarioevento/list-calendarioevento',
        key: 'lista_calendarioevento',
      },
      // {
      //   title: 'CRUD Calendarioevento',
      //   link: '/pages/calendarioevento/crud-calendarioevento',
      //   key: 'crud_calendarioevento',
      // },
    ],
  },
  {
    title: 'Reportes',
    icon: 'nb-compose',
    link: '',
    key: 'reportes',
    children: [
      {
        title: 'Inscripciones',
        icon: '	nb-maximize',
        link: '',
        key: 'inscripciones',
        children: [
          {
            title: 'Inscritos por proyecto',
            icon: 'nb-list',
            link: '/pages/reportes/inscripciones/inscritos-proyecto',
            key: 'inscritos_por_proyecto',
          },
        ],
      },
      {
        title: 'Icfes',
        icon: '	nb-maximize',
        link: '',
        key: 'icfes',
        children: [
          {
            title: 'Registro Icfes por proyecto',
            icon: 'nb-list',
            link: '/pages/reportes/icfes_SNP/icfes-proyecto',
            key: 'icfes_por_proyecto',
          },
        ],
      },
      {
        title: 'Proyectos',
        icon: '	nb-maximize',
        link: '',
        key: 'proyectos_curriculares',
        children: [
          {
            title: 'Proyectos',
            icon: 'nb-list',
            link: '/pages/reportes/proyectos/list-proyectos',
            key: 'lista_proyectos_curriculares',
          },
          {
            title: 'HistoricoAcreditaciones',
            icon: 'nb-list',
            link: '/pages/reportes/proyectos/historico-acreditaciones',
            key: 'historico_acreditaciones',
          },
        ],
      },
    ],
  },
]
