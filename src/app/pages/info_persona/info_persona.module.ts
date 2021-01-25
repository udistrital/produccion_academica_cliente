import { InfoPersonaRoutingModule, routedComponents } from './info_persona-routing.module';
import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { PersonaService } from '../../@core/data/persona.service';
import { EnteService } from '../../@core/data/ente.service';
import { InscripcionService } from '../../@core/data/inscripcion.service';
// import { CampusMidService } from '../../@core/data/campus_mid.service';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ToasterModule } from 'angular2-toaster';
import { SharedModule } from '../../shared/shared.module';
import { CrudInfoPersonaComponent } from './crud-info_persona/crud-info_persona.component';
import { ViewInfoPersonaComponent } from './view-info-persona/view-info-persona.component';
import { CrudInfoComplementarioComponent } from './crud-info-complementario/crud-info-complementario.component';

@NgModule({
  imports: [
    ThemeModule,
    InfoPersonaRoutingModule,
    Ng2SmartTableModule,
    ToasterModule,
    SharedModule,
  ],
  declarations: [
    ...routedComponents,
    CrudInfoComplementarioComponent,
  ],
  providers: [
    PersonaService,
    EnteService,
    // CampusMidService,
    InscripcionService,
  ],
  exports: [
    CrudInfoComplementarioComponent,
    CrudInfoPersonaComponent,
    ViewInfoPersonaComponent,
  ],
})
export class InfoPersonaModule { }
