import { Component, OnInit, Input } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { SgaMidService } from '../../../../@core/data/sga_mid.service';
import { UserService } from '../../../../@core/data/users.service';
import { TercerosService } from '../../../../@core/data/terceros.service';
import { Tercero } from '../../../../@core/data/models/terceros/tercero';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { ProduccionAcademicaPost } from '../../../../@core/data/models/produccion_academica/produccion_academica';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import 'style-loader!angular2-toaster/toaster.css';
import { Observacion } from '../../../../@core/data/models/solicitud_docente/observacion';

@Component({
  selector: 'ngx-list-comentario',
  templateUrl: './list-comentario.component.html',
  styleUrls: ['./list-comentario.component.scss'],
})
export class ListComentarioComponent implements OnInit {
  @Input('observaciones_selected')
  set observaciones(observaciones_selected: Observacion[]) {
    this.observaciones_selected = observaciones_selected;
    this.loadData();
    this.cargarCampos();
  }

  observaciones_selected: Observacion[];
  prod_selected: ProduccionAcademicaPost;
  cambiotab: boolean = false;
  config: ToasterConfig;
  settings: any;
  rol: string;
  userData: Tercero;

  source: LocalDataSource = new LocalDataSource();

  constructor(private translate: TranslateService,
    private sgaMidService: SgaMidService,
    private tercerosService: TercerosService,
    private user: UserService,
    private toasterService: ToasterService) {
    this.rol = (JSON.parse(atob(localStorage
      .getItem('id_token')
      .split('.')[1])).role)
      .filter((data: any) => (data.indexOf('/') === -1))[0];
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.cargarCampos();
    });
  }

  cargarCampos() {
    this.settings = {
      actions: {
        position: 'right',
        columnTitle: this.translate.instant('produccion_academica.acciones'),
        custom: [
          {
            name: 'view',
            title: '<i class="nb-search" title="view"></i>',
          },
        ],
        delete: false,
        add: false,
        edit: false,
      },
      mode: 'external',
      columns: {
        Titulo: {
          title: this.translate.instant('comentarios.titulo_comentario'),
          filter: false,
          type: 'string;',
          valuePrepareFunction: (value) => {
            return value;
          },
          width: '60%',
        },
        FechaCreacion: {
          title: this.translate.instant('comentarios.fecha_comentario'),
          filter: false,
          valuePrepareFunction: (value) => {
            return ((value) + '').substring(0, 10);
          },
          type: 'string;',
          width: '40%',
        },
      },
    };
    if (this.rol !== 'DOCENTE') {
      this.settings.columns.Persona = {
        title: this.translate.instant('GLOBAL.persona'),
        valuePrepareFunction: (value) => {
          return value.NombreCompleto;
        },
        filter: false,
        width: '20%',
      }
      this.settings.columns.TipoObservacionId = {
        title: this.translate.instant('comentarios.tipo_observacion'),
        filter: false,
        type: 'string;',
        valuePrepareFunction: (value) => {
          return value.Nombre;
        },
        width: '30%',
      }
      this.settings.columns.Titulo.width = '40%';
      this.settings.columns.FechaCreacion.width = '30%';
    }
  }

  useLanguage(language: string) {
    this.translate.use(language);
  }

  loadData(): void {
    if (this.observaciones_selected.length > 0) {
      this.loadTerceroData()
        .then(() => {
          const data = <Array<Observacion>>this.observaciones_selected;
          this.source.load(data);
        })
        .catch(error => {
          if (!error.status)
            error.status = 409;
        })
    } else {
      const data = []
      this.source.load(data);
    }
  }

  loadTerceroData() {
    return new Promise((resolve, reject) => {
      this.observaciones_selected.forEach(observacion => {
        this.tercerosService.get('tercero/?query=Id:' + observacion.TerceroId)
        .subscribe(res => {
          if (Object.keys(res[0]).length > 0) {
            observacion.Persona = <Tercero>res[0];
            resolve(true);
          }else {
            this.observaciones_selected = [];
            reject({ status: 404 });
          }
        }, (error: HttpErrorResponse) => {
          reject(error);
        });
      });
    })
  }

  ngOnInit() {}

  onView(event) {
    const opt: any = {
      width: '550px',
      title: event.data.Titulo,
      text: event.data.Valor,
      html: `
        <p style="width: 80%; margin: auto">${event.data.Valor}</p> <br> <br>
        <small>Escrito por: ${event.data.Persona.NombreCompleto}</small> <br>
        <small>Fecha observación: ${(event.data.FechaCreacion + '').substring(0, 10)}</small>
      `,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    };
    Swal(opt)
  }

  onChange(event) {
    if (event) {
      this.loadData();
      this.cambiotab = !this.cambiotab;
    }
  }

  private showToast(type: string, title: string, body: string) {
    this.config = new ToasterConfig({
      // 'toast-top-full-width', 'toast-bottom-full-width', 'toast-top-left', 'toast-top-center'
      positionClass: 'toast-top-center',
      timeout: 5000,  // ms
      newestOnTop: true,
      tapToDismiss: false, // hide on click
      preventDuplicates: true,
      animation: 'slideDown', // 'fade', 'flyLeft', 'flyRight', 'slideDown', 'slideUp'
      limit: 5,
    });
    const toast: Toast = {
      type: type, // 'default', 'info', 'success', 'warning', 'error'
      title: title,
      body: body,
      showCloseButton: true,
      bodyOutputType: BodyOutputType.TrustedHtml,
    };
    this.toasterService.popAsync(toast);
  }

}
