import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EvaluacionParesComponent } from './evaluacion-pares.component';
import { ListInvitacionesComponent } from './list-invitaciones/list-invitaciones.component';
import { SendInvitacionComponent } from '../evaluacion-pares/send-invitacion/send-invitacion.component';
import { ListEvaluacionesComponent } from './list-evaluaciones/list-evaluaciones.component';
import { CrudEvaluacionComponent } from './crud-evaluacion/crud-evaluacion.component';
import { ReviewEvaluacionComponent } from './review-evaluacion/review-evaluacion.component';

const routes: Routes = [{
  path: '',
  component: EvaluacionParesComponent,
  children: [{
    path: 'list_invitaciones',
    component: ListInvitacionesComponent,
  }, {
    path: 'list_evaluaciones',
    component: ListEvaluacionesComponent,
  }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EvaluacionParesRoutingModule { }

export const routedComponents = [
  EvaluacionParesComponent,
  ListInvitacionesComponent,
  SendInvitacionComponent,
  ListEvaluacionesComponent,
  CrudEvaluacionComponent,
  ReviewEvaluacionComponent,
];
