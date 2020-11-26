import { ProduccionAcademicaRoutingModule, routedComponents } from './produccion_academica-routing.module';
import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { ProduccionAcademicaService } from '../../@core/data/produccion_academica.service';
import { SolicitudDocenteService } from '../../@core/data/solicitud-docente.service'
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ToasterModule } from 'angular2-toaster';
import { SharedModule } from '../../shared/shared.module';
import { CrudProduccionAcademicaComponent } from './crud-produccion_academica/crud-produccion_academica.component';
import { ListProduccionAcademicaComponent } from './list-produccion_academica/list-produccion_academica.component';
import { ViewProduccionAcademicaComponent } from './view-produccion_academica/view-produccion_academica.component';
import { UserService } from '../../@core/data/users.service';
import { PersonaService } from '../../@core/data/persona.service';
import { NuxeoService } from '../../@core/utils/nuxeo.service';
import { NewSolicitudComponent } from './new-solicitud/new-solicitud.component';


@NgModule({
  imports: [
    ThemeModule,
    ProduccionAcademicaRoutingModule,
    Ng2SmartTableModule,
    ToasterModule,
    SharedModule,
  ],
  declarations: [
    ...routedComponents,
    NewSolicitudComponent,
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
    ViewProduccionAcademicaComponent,
  ],
})
export class ProduccionAcademicaModule { }
