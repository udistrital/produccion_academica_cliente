import { ProyectoAcademicoRoutingModule, routedComponents } from './proyecto_academico-routing.module';
import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { ProduccionAcademicaService } from '../../@core/data/produccion_academica.service';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ToasterModule } from 'angular2-toaster';
import { SharedModule } from '../../shared/shared.module';
import { CrudProyectoAcademicoComponent } from './crud-proyecto_academico/crud-proyecto_academico.component';
import { ListProyectoAcademicoComponent } from './list-proyecto_academico/list-proyecto_academico.component';
import { UserService } from '../../@core/data/users.service';
import { PersonaService } from '../../@core/data/persona.service';
import { NuxeoService } from '../../@core/utils/nuxeo.service';
import {NgDatepickerModule} from 'ng2-datepicker';
import { ConsultaProyectoAcademicoComponent } from './consulta-proyecto_academico/consulta-proyecto_academico.component';
import { ModificarProyectoAcademicoComponent } from './modificar-proyecto_academico/modificar-proyecto_academico.component';


@NgModule({
  imports: [
    ThemeModule,
    ProyectoAcademicoRoutingModule,
    Ng2SmartTableModule,
    ToasterModule,
    SharedModule,
    NgDatepickerModule,
  ],
  declarations: [
    ...routedComponents,
  ],
  providers: [
    ProduccionAcademicaService,
    UserService,
    PersonaService,
    NuxeoService,
  ],
  exports: [
    CrudProyectoAcademicoComponent,
    ListProyectoAcademicoComponent,
    ConsultaProyectoAcademicoComponent,
    ModificarProyectoAcademicoComponent,
  ],
})
export class ProyectoAcademicoModule { }
