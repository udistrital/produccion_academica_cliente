import { ProduccionAcademicaRoutingModule, routedComponents } from './produccion_academica-routing.module';
import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { ProduccionAcademicaService } from '../../@core/data/produccion_academica.service';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ToasterModule } from 'angular2-toaster';
import { SharedModule } from '../../shared/shared.module';
import { CrudProduccionAcademicaComponent } from './crud-produccion_academica/crud-produccion_academica.component';
import { ListProduccionAcademicaComponent } from './list-produccion_academica/list-produccion_academica.component';
import { ViewProduccionAcademicaComponent } from './view-produccion_academica/view-produccion_academica.component';
import { UserService } from '../../@core/data/users.service';
import { PersonaService } from '../../@core/data/persona.service';
import { NuxeoService } from '../../@core/utils/nuxeo.service';
import { ReviewProduccionAcademicaComponent } from './review-produccion-academica/review-produccion-academica.component';
import { ComentarioComponent } from './comentario/comentario.component';
import { CrudComentarioComponent } from './comentario/crud-comentario/crud-comentario.component';
import { ListComentarioComponent } from './comentario/list-comentario/list-comentario.component';


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
    ReviewProduccionAcademicaComponent,
    ComentarioComponent,
    CrudComentarioComponent,
    ListComentarioComponent,
  ],
  providers: [
    ProduccionAcademicaService,
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
