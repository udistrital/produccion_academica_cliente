import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EvaluacionParesComponent } from './evaluacion-pares.component';
import { ListInvitacionesComponent } from './list-invitaciones/list-invitaciones.component';
const routes: Routes = [{
  path: '',
  component: EvaluacionParesComponent,
  children: [{
    path: 'list_invitaciones',
    component: ListInvitacionesComponent,
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
];