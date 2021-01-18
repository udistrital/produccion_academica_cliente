import { ProduccionAcademicaRoutingModule, routedComponents } from './produccion_academica-routing.module';
import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ToasterModule } from 'angular2-toaster';
import { SharedModule } from '../../shared/shared.module';
import { SolicitudDocenteService } from '../../@core/data/solicitud-docente.service'
import { ProduccionAcademicaService } from '../../@core/data/produccion_academica.service';
import { UserService } from '../../@core/data/users.service';
import { PersonaService } from '../../@core/data/persona.service';
import { NuxeoService } from '../../@core/utils/nuxeo.service';
import { CrudProduccionAcademicaComponent } from './crud-produccion_academica/crud-produccion_academica.component';
import { ListProduccionAcademicaComponent } from './list-produccion_academica/list-produccion_academica.component';
import { ListAprovedProduccionAcademicaComponent } from './list_aproved-produccion_academica/list_aproved-produccion_academica.component';
import { ReviewProduccionAcademicaComponent } from './review-produccion-academica/review-produccion-academica.component';
import { CrudComentarioComponent } from './comentario/crud-comentario/crud-comentario.component';
import { ListComentarioComponent } from './comentario/list-comentario/list-comentario.component';
import { NewSolicitudComponent } from './new-solicitud/new-solicitud.component';
import { SendInvitacionComponent } from '../evaluacion-pares/send-invitacion/send-invitacion.component';
import { ButtonAlertComponent } from '../../@theme/components/button-alert/button-alert.component';
import { EvaluacionParesModule } from '../evaluacion-pares/evaluacion-pares.module';
import { ResumeListEvaluacionesComponent } from '../evaluacion-pares/resume-list-evaluaciones/resume-list-evaluaciones.component';

@NgModule({
  imports: [
    ThemeModule,
    ProduccionAcademicaRoutingModule,
    Ng2SmartTableModule,
    ToasterModule,
    SharedModule,
    EvaluacionParesModule,
  ],
  entryComponents: [
    ButtonAlertComponent,
    SendInvitacionComponent,
    ResumeListEvaluacionesComponent,
  ],
  declarations: [
    ...routedComponents,
  ],
  providers: [
    ProduccionAcademicaService,
    SolicitudDocenteService,
    UserService,
    PersonaService,
    NuxeoService,
  ],
  exports: [
    CrudProduccionAcademicaComponent,
    ListProduccionAcademicaComponent,
    ReviewProduccionAcademicaComponent,
    CrudComentarioComponent,
    ListComentarioComponent,
    NewSolicitudComponent,
    ListAprovedProduccionAcademicaComponent,
  ],
})
export class ProduccionAcademicaModule { }
