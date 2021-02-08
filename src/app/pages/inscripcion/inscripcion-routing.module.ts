import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InscripcionComponent } from './inscripcion.component';
import { PreinscripcionComponent } from './preinscripcion/preinscripcion.component';

const routes: Routes = [{
  path: '',
  component: InscripcionComponent,
  children: [{
  path: 'preinscripcion',
  component: PreinscripcionComponent,
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

export class InscripcionRoutingModule { }

export const routedComponents = [
  InscripcionComponent,
  PreinscripcionComponent,
];
