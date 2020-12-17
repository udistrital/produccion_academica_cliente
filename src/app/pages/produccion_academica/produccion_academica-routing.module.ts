import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProduccionAcademicaComponent } from './produccion_academica.component';
import { ListProduccionAcademicaComponent } from './list-produccion_academica/list-produccion_academica.component';
import { ListAprovedProduccionAcademicaComponent } from './list_aproved-produccion_academica/list_aproved-produccion_academica.component';
import { CrudProduccionAcademicaComponent } from './crud-produccion_academica/crud-produccion_academica.component';
import { ReviewProduccionAcademicaComponent } from './review-produccion-academica/review-produccion-academica.component';
import { NewSolicitudComponent } from './new-solicitud/new-solicitud.component';
import { CrudComentarioComponent } from './comentario/crud-comentario/crud-comentario.component';
import { ListComentarioComponent } from './comentario/list-comentario/list-comentario.component';
import { SendInvitacionComponent } from './send-invitacion/send-invitacion.component';

const routes: Routes = [{
  path: '',
  component: ProduccionAcademicaComponent,
  children: [{
    path: 'list-produccion_academica',
    component: ListProduccionAcademicaComponent,
  }, {
    path: 'crud-produccion_academica/:id',
    component: CrudProduccionAcademicaComponent,
  }, {
    path: 'review-produccion-academica',
    component: ReviewProduccionAcademicaComponent,
  }, {
    path: 'new-solicitud',
    component: NewSolicitudComponent,
  }, {
    path: 'list_aproved-produccion_academica',
    component: ListAprovedProduccionAcademicaComponent,
  }],
}];

@NgModule({
  imports: [
      RouterModule.forChild(routes),
  ],
  exports: [
      RouterModule,
  ],
})

export class ProduccionAcademicaRoutingModule { }

export const routedComponents = [
  ProduccionAcademicaComponent,
  ListProduccionAcademicaComponent,
  CrudProduccionAcademicaComponent,
  ReviewProduccionAcademicaComponent,
  CrudComentarioComponent,
  ListComentarioComponent,
  NewSolicitudComponent,
  ListAprovedProduccionAcademicaComponent,
  SendInvitacionComponent,
];
