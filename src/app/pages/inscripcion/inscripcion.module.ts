import { InscripcionRoutingModule, routedComponents } from './inscripcion-routing.module';
import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { SharedModule } from '../../shared/shared.module';
import { ToasterModule } from 'angular2-toaster';
import { NuxeoService } from './../../@core/utils/nuxeo.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { UtilidadesService } from '../../@core/utils/utilidades.service';
import { ImplicitAutenticationService } from './../../@core/utils/implicit_autentication.service';
import { OikosService } from '../../@core/data/oikos.service';
import { PersonaService } from '../../@core/data/persona.service';
import { UbicacionService } from '../../@core/data/ubicacion.service';
import { ProduccionAcademicaService } from '../../@core/data/produccion_academica.service';
import { DocumentoProgramaService } from '../../@core/data/documento_programa.service';
import { InfoPersonaModule } from '../info_persona/info_persona.module';
// import { InscripcionMultipleModule} from '../inscripcion_multiple/inscripcion_multiple.module'
import { CrudInfoPersonaComponent } from '../info_persona/crud-info_persona/crud-info_persona.component';
// import { CrudInscripcionMultipleComponent} from '../inscripcion_multiple/crud-inscripcion_multiple/crud-inscripcion_multiple.component'
// import { InfoCaracteristicaModule } from '../info_caracteristica/info_caracteristica.module';
// import { CrudInfoCaracteristicaComponent } from '../info_caracteristica/crud-info_caracteristica/crud-info_caracteristica.component';
// import { InformacionContactoModule } from '../informacion_contacto/informacion_contacto.module';
import { FormacionAcademicaModule } from '../formacion_academica/formacion_academica.module';
import { ListFormacionAcademicaComponent } from '../formacion_academica/list-formacion_academica/list-formacion_academica.component';
import { CrudFormacionAcademicaComponent } from '../formacion_academica/crud-formacion_academica/crud-formacion_academica.component';
// tslint:disable-next-line:max-line-length
import { ProduccionAcademicaModule } from '../produccion_academica/produccion_academica.module';
import { ListProduccionAcademicaComponent } from '../produccion_academica/list-produccion_academica/list-produccion_academica.component';
import { DocumentoProgramaModule } from '../documento_programa/documento_programa.module';
// tslint:enable:max-line-length
import { ListDocumentoProgramaComponent } from '../documento_programa/list-documento_programa/list-documento_programa.component';
import { CrudDocumentoProgramaComponent } from '../documento_programa/crud-documento_programa/crud-documento_programa.component';
import { PreinscripcionComponent } from './preinscripcion/preinscripcion.component';


@NgModule({
  imports: [
    ThemeModule,
    InscripcionRoutingModule,
    MatExpansionModule,
    SharedModule,
    ToasterModule,
    InfoPersonaModule,
    // InscripcionMultipleModule,
    // InfoCaracteristicaModule,
    // InformacionContactoModule,
    FormacionAcademicaModule,
    ProduccionAcademicaModule,
    DocumentoProgramaModule,
  ],
  declarations: [
    ...routedComponents,
  ],
  providers: [
    ImplicitAutenticationService,
    NuxeoService,
    UtilidadesService,
    OikosService,
    PersonaService,
    UbicacionService,
    ProduccionAcademicaService,
    DocumentoProgramaService,

  ],
  entryComponents: [
    CrudInfoPersonaComponent,
    // CrudInscripcionMultipleComponent,
    // CrudInfoCaracteristicaComponent,
    // CrudInformacionContactoComponent,
    ListFormacionAcademicaComponent,
    CrudFormacionAcademicaComponent,
    ListProduccionAcademicaComponent,
    ListDocumentoProgramaComponent,
    CrudDocumentoProgramaComponent,
  ],
  exports: [
    PreinscripcionComponent,
  ],
})
export class InscripcionModule { }
