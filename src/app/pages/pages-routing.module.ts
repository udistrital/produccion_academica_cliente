import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
        path: 'dashboard',
        component: DashboardComponent,
    },
    {
      path: 'produccion_academica',
      loadChildren: './produccion_academica/produccion_academica.module#ProduccionAcademicaModule',
    },
    {
      path: 'admin_docencia',
      loadChildren: './admin-docencia/admin-docencia.module#AdminDocenciaModule',
    },
    {
      path: 'inscripcion',
      loadChildren: './inscripcion/inscripcion.module#InscripcionModule',
    },
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}

