import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../@theme/theme.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ToasterModule } from 'angular2-toaster';
import { ProduccionAcademicaModule } from '../produccion_academica/produccion_academica.module';
import { SharedModule } from '../../shared/shared.module';
import { SolicitudDocenteService } from '../../@core/data/solicitud-docente.service'
import { ProduccionAcademicaService } from '../../@core/data/produccion_academica.service';
import { UserService } from '../../@core/data/users.service';
import { PersonaService } from '../../@core/data/persona.service';
import { NuxeoService } from '../../@core/utils/nuxeo.service';
import { AdminDocenciaRoutingModule, routedComponents } from './admin-docencia-routing.module';
import { ListPaquetesComponent } from './list-paquetes/list-paquetes.component';
import { ListSolicitudesPaqueteComponent } from './list-solicitudes-paquete/list-solicitudes-paquete.component';
import { CrudProduccionAcademicaComponent } from '../produccion_academica/crud-produccion_academica/crud-produccion_academica.component';
import { ReviewProduccionAcademicaComponent } from '../produccion_academica/review-produccion-academica/review-produccion-academica.component';

@NgModule({
  declarations: [...routedComponents],
  imports: [
    CommonModule,
    AdminDocenciaRoutingModule,
    ProduccionAcademicaModule,
    ThemeModule,
    Ng2SmartTableModule,
    ToasterModule,
    SharedModule,
  ],
  entryComponents: [
    CrudProduccionAcademicaComponent,
    ReviewProduccionAcademicaComponent,
  ],
  providers: [
    ProduccionAcademicaService,
    SolicitudDocenteService,
    UserService,
    PersonaService,
    NuxeoService,
  ],
  exports: [ListPaquetesComponent, ListSolicitudesPaqueteComponent],
})
export class AdminDocenciaModule { }

