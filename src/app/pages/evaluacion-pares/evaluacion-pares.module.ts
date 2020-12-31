import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../@theme/theme.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ToasterModule } from 'angular2-toaster';
import { SharedModule } from '../../shared/shared.module';
import { SolicitudDocenteService } from '../../@core/data/solicitud-docente.service'
import { ProduccionAcademicaService } from '../../@core/data/produccion_academica.service';
import { UserService } from '../../@core/data/users.service';
import { PersonaService } from '../../@core/data/persona.service';
import { NuxeoService } from '../../@core/utils/nuxeo.service';

import { EvaluacionParesRoutingModule, routedComponents } from './evaluacion-pares-routing.module';
import { ListInvitacionesComponent } from './list-invitaciones/list-invitaciones.component';

@NgModule({
  declarations: [...routedComponents],
  imports: [
    CommonModule,
    EvaluacionParesRoutingModule,
    ThemeModule,
    Ng2SmartTableModule,
    ToasterModule,
    SharedModule,
  ],
  providers: [
    ProduccionAcademicaService,
    SolicitudDocenteService,
    UserService,
    PersonaService,
    NuxeoService,
  ],
  exports: [ListInvitacionesComponent],
})
export class EvaluacionParesModule { }
