import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { PagesRoutingModule } from './pages-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import { SharedModule } from '../shared/shared.module';
import { ConfiguracionService } from '../@core/data/configuracion.service';
import { MenuService } from '../@core/data/menu.service';
import { SgaMidService } from '../@core/data/sga_mid.service';
import { GoogleService } from '../@core/data/google.service';
import { DocumentoService } from '../@core/data/documento.service';
import { MatDialogModule } from '@angular/material';



const PAGES_COMPONENTS = [
  PagesComponent,
];

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    DashboardModule,
    SharedModule,
    MatDialogModule,
  ],
  declarations: [
    ...PAGES_COMPONENTS,
  ],
  entryComponents: [
  ],
  providers: [
    ConfiguracionService,
    MenuService,
    SgaMidService,
    DocumentoService,
    GoogleService,
  ],
})
export class PagesModule {
}
