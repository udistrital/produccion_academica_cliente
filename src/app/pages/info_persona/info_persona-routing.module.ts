import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InfoPersonaComponent } from './info_persona.component';
import { CrudInfoPersonaComponent } from './crud-info_persona/crud-info_persona.component';
import { ViewInfoPersonaComponent } from './view-info-persona/view-info-persona.component';
import { AuthGuard } from '../../@core/_guards/auth.guard';

const routes: Routes = [{
  path: '',
  component: InfoPersonaComponent,
  children: [{
    path: 'crud-info_persona',
    component: CrudInfoPersonaComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [
        'ADMIN_CAMPUS',
        'ASPIRANTE',
        'Internal/selfsignup',
        'Internal/everyone',
      ],
    },
  }, {
    path: 'view-info_persona',
    component: ViewInfoPersonaComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [
        'ADMIN_CAMPUS',
        'ASPIRANTE',
        'Internal/selfsignup',
        'Internal/everyone',
      ],
    },
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

export class InfoPersonaRoutingModule { }

export const routedComponents = [
  InfoPersonaComponent,
  CrudInfoPersonaComponent,
  ViewInfoPersonaComponent,
];
