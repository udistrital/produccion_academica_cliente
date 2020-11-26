import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProduccionAcademicaComponent } from './produccion_academica.component';
import { ListProduccionAcademicaComponent } from './list-produccion_academica/list-produccion_academica.component';
import { CrudProduccionAcademicaComponent } from './crud-produccion_academica/crud-produccion_academica.component';
import { ViewProduccionAcademicaComponent } from './view-produccion_academica/view-produccion_academica.component';
import { ReviewProduccionAcademicaComponent } from './review-produccion-academica/review-produccion-academica.component';
import { NewSolicitudComponent } from './new-solicitud/new-solicitud.component';
import { ComentarioComponent } from './comentario/comentario.component';
import { CrudComentarioComponent } from './comentario/crud-comentario/crud-comentario.component';
import { ListComentarioComponent } from './comentario/list-comentario/list-comentario.component';

const routes: Routes = [{
  path: '',
  component: ProduccionAcademicaComponent,
  children: [{
    path: 'list-produccion_academica',
    component: ListProduccionAcademicaComponent,
  }, {
    path: 'view-produccion_academica',
    component: ViewProduccionAcademicaComponent,
  }, {
    path: 'crud-produccion_academica/:id',
    component: CrudProduccionAcademicaComponent,
  }, {
    path: 'review-produccion-academica',
    component: ReviewProduccionAcademicaComponent,
  }, {
    path: 'new-solicitud',
    component: NewSolicitudComponent,
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
  ViewProduccionAcademicaComponent,
  CrudProduccionAcademicaComponent,
  ReviewProduccionAcademicaComponent,
  ComentarioComponent,
  CrudComentarioComponent,
  ListComentarioComponent,
  NewSolicitudComponent,
];
