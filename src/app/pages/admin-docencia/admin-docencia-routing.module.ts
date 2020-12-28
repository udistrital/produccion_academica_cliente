import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminDocenciaComponent } from './admin-docencia.component';
import { ListPaquetesComponent } from './list-paquetes/list-paquetes.component';
import { ListSolicitudesPaqueteComponent } from './list-solicitudes-paquete/list-solicitudes-paquete.component';

const routes: Routes = [{
  path: '',
  component: AdminDocenciaComponent,
  children: [{
    path: 'list_paquetes',
    component: ListPaquetesComponent,
  }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class AdminDocenciaRoutingModule { }

export const routedComponents = [
  AdminDocenciaComponent,
  ListPaquetesComponent,
  ListSolicitudesPaqueteComponent,
];
