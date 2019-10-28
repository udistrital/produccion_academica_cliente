import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportesComponent } from './reportes.component';
import { InscritosProyectoComponent } from './inscripciones/inscritos-proyecto/inscritos-proyecto.component';
import { ReporteProyectosListComponent } from './proyectos/list-proyectos/list-proyectos.component';
import { ReporteHistoricoAcreditacionesComponent } from './proyectos/historico-acreditaciones/historico-acreditaciones.component';


const routes: Routes = [{
  path: '',
  component: ReportesComponent,
  children: [
    {
      path: 'inscripciones/inscritos-proyecto',
      component: InscritosProyectoComponent,
    },
    {
      path: 'proyectos/list-proyectos',
      component: ReporteProyectosListComponent,
    },
    {
      path: 'proyectos/historico-acreditaciones',
      component: ReporteHistoricoAcreditacionesComponent,
    },
  ],
}];

@NgModule({
  imports: [
      RouterModule.forChild(routes),
  ],
  exports: [
      RouterModule,
  ],
})

export class EventoRoutingModule { }

export const routedComponents = [
  ReportesComponent,
  InscritosProyectoComponent,
  ReporteProyectosListComponent,
  ReporteHistoricoAcreditacionesComponent,
];
