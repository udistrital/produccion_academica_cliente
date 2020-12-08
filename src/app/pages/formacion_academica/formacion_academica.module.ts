import { FormacionAcademicaRoutingModule, routedComponents } from './formacion_academica-routing.module';
import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
// import { CampusMidService } from '../../@core/data/campus_mid.service';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ToasterModule } from 'angular2-toaster';
import { SharedModule } from '../../shared/shared.module';
import { CrudFormacionAcademicaComponent } from './crud-formacion_academica/crud-formacion_academica.component';
import { ListFormacionAcademicaComponent } from './list-formacion_academica/list-formacion_academica.component';
import { ViewFormacionAcademicaComponent } from './view-formacion_academica/view-formacion_academica.component';
import { UserService } from '../../@core/data/users.service';
import { FormacionAcademicaService } from '../../@core/data/formacion_academica.service';
import { CrudTransferenciaInternaComponent } from './crud-transferencia_interna/crud-transferencia_interna.component';
import { CrudExternoComponent } from './crud-externo/crud-externo.component';

@NgModule({
  imports: [
    ThemeModule,
    FormacionAcademicaRoutingModule,
    Ng2SmartTableModule,
    ToasterModule,
    SharedModule,
  ],
  declarations: [
    ...routedComponents,
  ],
  providers: [
    // CampusMidService,
    UserService,
    FormacionAcademicaService,
  ],
  exports: [
    CrudFormacionAcademicaComponent,
    ListFormacionAcademicaComponent,
    CrudTransferenciaInternaComponent,
    CrudExternoComponent,
    ViewFormacionAcademicaComponent,
  ],
})
export class FormacionAcademicaModule { }
