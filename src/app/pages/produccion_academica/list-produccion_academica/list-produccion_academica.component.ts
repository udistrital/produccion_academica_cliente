import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import { LocalDataSource } from 'ng2-smart-table';
import { SgaMidService } from '../../../@core/data/sga_mid.service';
import { UserService } from '../../../@core/data/users.service';
import { ProduccionAcademicaPost } from './../../../@core/data/models/produccion_academica/produccion_academica';
import { SolicitudDocentePost } from '../../../@core/data/models/solicitud_docente/solicitud_docente';
import { filterList } from './filtros'
import Swal from 'sweetalert2';
import 'style-loader!angular2-toaster/toaster.css';

@Component({
  selector: 'ngx-list-produccion-academica',
  templateUrl: './list-produccion_academica.component.html',
  styleUrls: ['./list-produccion_academica.component.scss'],
  })
export class ListProduccionAcademicaComponent implements OnInit {
  solicitud_selected: SolicitudDocentePost;
  solicitud_selectedReview: SolicitudDocentePost;
  filtros = filterList;
  cambiotab: number = 0;
  config: ToasterConfig;
  settings: any;
  filter: any;
  rol: string;
  persona_id: number;
  solicitudes_list: SolicitudDocentePost[];
  solicitudes_list_filter: SolicitudDocentePost[];

  source: LocalDataSource = new LocalDataSource();

  constructor(private translate: TranslateService,
    private sgaMidService: SgaMidService,
    private user: UserService,
    private toasterService: ToasterService) {
    this.persona_id = user.getPersonaId() || 1;
    this.rol = (JSON.parse(atob(localStorage
      .getItem('id_token')
      .split('.')[1])).role)
      .filter((data: any) => (data.indexOf('/') === -1))[0];
    this.loadData();
    this.cargarCampos();
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
        'ProduccionAcademica.Titulo': {
          title: this.translate.instant('produccion_academica.titulo_produccion_academica'),
          valuePrepareFunction: (cell, row) => {
            return row.ProduccionAcademica.Titulo;
          },
          filter: false,
          width: '25%',
        },
        'ProduccionAcademica.SubtipoProduccionId': {
          title: this.translate.instant('produccion_academica.tipo_produccion_academica'),
          valuePrepareFunction: (cell, row) => {
            return row.ProduccionAcademica.SubtipoProduccionId.Nombre;
          },
          filter: false,
          width: '15%',
        },
        EvolucionEstado: {
          title: this.translate.instant('produccion_academica.estado_solicitud'),
          valuePrepareFunction: (value) => {
            return value[value.length - 1].EstadoTipoSolicitudId.EstadoId.Nombre;
          },
          filter: false,
          width: '10%',
        },
        FechaRadicacion: {
          title: this.translate.instant('produccion_academica.fecha_radicacion'),
          valuePrepareFunction: (value) => {
            return ((value) + '').substring(0, 10);
          },
          filter: false,
          width: '15%',
        },
        'ProduccionAcademica.Fecha': {
          title: this.translate.instant('produccion_academica.fecha_publicacion'),
          valuePrepareFunction: (cell, row) => {
            return ((row.ProduccionAcademica.Fecha) + '').substring(0, 10);
          },
          filter: false,
          width: '15%',
        },
      },
    };
    if (this.rol !== 'DOCENTE') {
      this.settings.columns.Solicitantes = {
        title: this.translate.instant('GLOBAL.persona'),
        valuePrepareFunction: (value) => {
          return value[0].Nombre;
        },
        filter: false,
        width: '20%',
      }
    } else {
      this.settings.columns['ProduccionAcademica.Titulo'].width = '30%';
      this.settings.columns['ProduccionAcademica.SubtipoProduccionId'].width = '20%';
      this.settings.columns.EvolucionEstado.width = '15%';
    }
  }

  useLanguage(language: string) {
    this.translate.use(language);
  }

  loadData(): void {
    Swal({
      title: 'Espere',
      text: 'Trayendo Información',
      allowOutsideClick: false,
    });
    Swal.showLoading();
    let endpointProduccion: string;
    let endpointSolicitud: string;
    if (this.rol === 'DOCENTE') {
      endpointProduccion = 'produccion_academica/' + this.persona_id;
      endpointSolicitud = 'solicitud_docente/' + this.persona_id;
    }
    if (this.rol === 'SECRETARIA_DOCENCIA' || this.rol === 'ADMIN_DOCENCIA') {
      endpointProduccion = 'produccion_academica/';
      endpointSolicitud = 'solicitud_docente/';
    }
    this.sgaMidService.get(endpointProduccion).subscribe((res: any) => {
      if (res !== null) {
        if (Object.keys(res[0]).length > 0 && res.Type !== 'error') {
          const dataProduccion = <Array<ProduccionAcademicaPost>>res;
          this.sgaMidService.get(endpointSolicitud).subscribe((resp: any) => {
            if (resp !== null) {
              if (Object.keys(resp[0]).length > 0 && resp.Type !== 'error') {
                const data = <Array<SolicitudDocentePost>>resp;
                console.info(data);
                data.forEach(solicitud => {
                  dataProduccion.forEach(produccion => {
                    if (JSON.parse(solicitud.Referencia).Id === produccion.Id)
                      solicitud.ProduccionAcademica = produccion;
                  })
                });
                this.solicitudes_list = data;
                Swal.close();
                this.source.load(data);
              } else {
                Swal({
                  type: 'error',
                  title: '404',
                  text: this.translate.instant('ERROR.404'),
                  confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
                });
              }
            }
          }, (error: HttpErrorResponse) => {
            Swal({
              type: 'error',
              title: error.status + '',
              text: this.translate.instant('ERROR.' + error.status),
              confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
            });
          });
        } else {
          Swal({
            type: 'error',
            title: '404',
            text: this.translate.instant('ERROR.404'),
            confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
          });
        }
      }
    }, (error: HttpErrorResponse) => {
      Swal({
        type: 'error',
        title: error.status + '',
        text: this.translate.instant('ERROR.' + error.status),
        confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
      });
    });
  }

  ngOnInit() { }

  onEdit(event): void {
    this.solicitud_selected = event.data;
    this.activetab(1);
  }

  onView(event): void {
    this.solicitud_selectedReview = event.data;
    this.activetab(2);
  }

  filterSolicitudes(filter) {
    console.info(filter);
    let data;
    if (filter) {
      this.solicitudes_list_filter = this.solicitudes_list.filter(solicitud =>
        solicitud.EvolucionEstado[solicitud.EvolucionEstado.length - 1].EstadoTipoSolicitudId.EstadoId.Id === filter.Id,
      )
      data = <Array<SolicitudDocentePost>>this.solicitudes_list_filter;
    } else {
      data = <Array<SolicitudDocentePost>>this.solicitudes_list;
    }
    this.source.load(data);
  }

  activetab(number): void {
    this.cambiotab = number;
  }

  selectTab(event): void {
    if (event.tabTitle === this.translate.instant('GLOBAL.lista')) {
      this.cambiotab = 0;
    } else if (event.tabTitle === this.translate.instant('GLOBAL.formulario')) {
      this.cambiotab = 1;
    } else {
      this.cambiotab = 2;
    }
  }

  onChange(event) {
    if (event) {
      this.loadData();
      this.cambiotab = 0;
    }
  }

  private showToast(type: string, title: string, body: string) {
    this.config = new ToasterConfig({
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
