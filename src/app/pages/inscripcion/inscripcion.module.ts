import { InscripcionRoutingModule, routedComponents } from './inscripcion-routing.module';
import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { SharedModule } from '../../shared/shared.module';
import { ToasterModule } from 'angular2-toaster';
import { NuxeoService } from './../../@core/utils/nuxeo.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { UtilidadesService } from '../../@core/utils/utilidades.service';
import { ImplicitAutenticationService } from './../../@core/utils/implicit_autentication.service';
import { PersonaService } from '../../@core/data/persona.service';
import { ProduccionAcademicaService } from '../../@core/data/produccion_academica.service';
import { InfoPersonaModule } from '../info_persona/info_persona.module';
import { CrudInfoPersonaComponent } from '../info_persona/crud-info_persona/crud-info_persona.component';
import { ProduccionAcademicaModule } from '../produccion_academica/produccion_academica.module';
import { ListProduccionAcademicaComponent } from '../produccion_academica/list-produccion_academica/list-produccion_academica.component';
import { PreinscripcionComponent } from './preinscripcion/preinscripcion.component';


@NgModule({
  imports: [
    ThemeModule,
    InscripcionRoutingModule,
    MatExpansionModule,
    SharedModule,
    ToasterModule,
    InfoPersonaModule,
    ProduccionAcademicaModule,
  ],
  declarations: [
    ...routedComponents,
  ],
  providers: [
    ImplicitAutenticationService,
    NuxeoService,
    UtilidadesService,
    PersonaService,
    ProduccionAcademicaService,
  ],
  entryComponents: [
    CrudInfoPersonaComponent,
    ListProduccionAcademicaComponent,
  ],
  exports: [
    PreinscripcionComponent,
  ],
})
export class InscripcionModule { }
