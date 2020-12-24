import { Component, OnInit, Input } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import { LocalDataSource } from 'ng2-smart-table';
import { ButtonAlertComponent } from '../../../@theme/components/button-alert/button-alert.component';
import { TercerosService } from '../../../@core/data/terceros.service';
import { SgaMidService } from '../../../@core/data/sga_mid.service';
import { UserService } from '../../../@core/data/users.service';
import { ProduccionAcademicaPost } from './../../../@core/data/models/produccion_academica/produccion_academica';
import { SolicitudDocentePost } from '../../../@core/data/models/solicitud_docente/solicitud_docente';
import { PaqueteSolicitudPost } from '../../../@core/data/models/solicitud_docente/paquete';
import { filterList } from './filtros'
import Swal from 'sweetalert2';
import 'style-loader!angular2-toaster/toaster.css';
import { Tercero } from '../../../@core/data/models/terceros/tercero';

@Component({
  selector: 'ngx-list-solicitudes-paquete',
  templateUrl: './list-solicitudes-paquete.component.html',
  styleUrls: ['./list-solicitudes-paquete.component.scss']
})
export class ListSolicitudesPaqueteComponent implements OnInit {

  @Input('paquete_solicitud_selected')
  set solicitud(paquete_solicitud_selected: PaqueteSolicitudPost) {
    this.paquete_solicitud_selected = paquete_solicitud_selected;
    console.info(this.paquete_solicitud_selected)
    this.showData();
    this.cargarCampos();
  }

  paquete_solicitud_selected: PaqueteSolicitudPost;
  solicitud_updated: SolicitudDocentePost;
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
    private tercerosService: TercerosService,
    private toasterService: ToasterService) {
    this.persona_id = user.getPersonaId() || 1;
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

  showData() {
    Swal({
      title: 'Espere',
      text: 'Trayendo Información',
      allowOutsideClick: false,
    });
    Swal.showLoading();
    this.loadData()
      .then(() => {
        this.loadTerceroData()
          .then(() => {
            Swal.close();
            this.source.load(this.solicitudes_list);
          })
      })
      .catch(error => {
        if (!error.status) {
          error.status = 409;
        }
        Swal({
          type: 'error',
          title: error.status + '',
          text: this.translate.instant('ERROR.' + error.status),
          confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
        });
      });
  }

  loadData(): Promise<any> {
    return new Promise((resolve, reject) => {
      let endpointSolicitud: string;
      endpointSolicitud = 'paquete_solicitud/' + this.paquete_solicitud_selected.Id;
      this.sgaMidService.get(endpointSolicitud).subscribe((res: any) => {
        console.info(res);
        if (res !== null) {
          if (Object.keys(res[0]).length > 0 && res.Type !== 'error') {
            const data = <Array<SolicitudDocentePost>>res;
            data.forEach(solicitud => {
              if (JSON.parse(solicitud.Referencia).Id !== undefined) {
                const endpointProduccion = 'produccion_academica/get_one/' + JSON.parse(solicitud.Referencia).Id;
                this.sgaMidService.get(endpointProduccion).subscribe((resp: any) => {
                  if (resp !== null) {
                    if (Object.keys(resp[0]).length > 0 && resp.Type !== 'error') {
                      solicitud.ProduccionAcademica = <ProduccionAcademicaPost>resp[0];
                      if (solicitud.Id === data[data.length - 1].Id) {
                        console.info('Paso');
                        resolve(true);
                      }
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
                  reject({ status: 404 });
                  Swal({
                    type: 'error',
                    title: error.status + '',
                    text: this.translate.instant('ERROR.' + error.status),
                    confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
                  });
                });
              }
            });
            console.info(data);
            this.solicitudes_list = data;
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
        reject({ status: 404 });
        Swal({
          type: 'error',
          title: error.status + '',
          text: this.translate.instant('ERROR.' + error.status),
          confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
        });
      });
    });
  }

  loadTerceroData() {
    let i: number = 0;
    return new Promise((resolve, reject) => {
      this.solicitudes_list.forEach(solicitud => {
        this.tercerosService.get('tercero/?query=Id:' + solicitud.Solicitantes[0].TerceroId)
          .subscribe(res => {
            if (Object.keys(res[0]).length > 0) {
              solicitud.Solicitantes[0].Nombre = <Tercero>res[0].NombreCompleto;
              i++
              if (i === this.solicitudes_list.length)
                resolve(true);
            } else {
              this.solicitudes_list = [];
              reject({ status: 404 });
            }
          }, (error: HttpErrorResponse) => {
            reject(error);
          });
      });
    })
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
      this.updateData(event);
      this.cambiotab = 0;
    }
  }

  updateData(event) {
    Swal({
      title: 'Espere',
      text: 'Trayendo Información',
      allowOutsideClick: false,
    });
    Swal.showLoading();
    let endpointSolicitud: string;
    endpointSolicitud = 'solicitud_docente/get_one/' + event;
    this.sgaMidService.get(endpointSolicitud).subscribe((res: any) => {
      if (res !== null) {
        if (Object.keys(res[0]).length > 0 && res.Type !== 'error') {
          this.solicitud_updated = <SolicitudDocentePost>res[0];
          if (JSON.parse(this.solicitud_updated.Referencia).Id !== undefined) {
            const endpointProduccion = 'produccion_academica/get_one/' + JSON.parse(this.solicitud_updated.Referencia).Id;
            this.sgaMidService.get(endpointProduccion).subscribe((resp: any) => {
              if (resp !== null) {
                if (Object.keys(resp[0]).length > 0 && resp.Type !== 'error') {
                  this.solicitud_updated.ProduccionAcademica = <ProduccionAcademicaPost>resp[0];
                  this.loadTerceroDataOne(this.solicitud_updated)
                  .then(() => {
                    this.solicitudes_list = this.solicitudes_list.map(solicitud => {
                      if (solicitud.Id === this.solicitud_updated.Id)
                        solicitud = this.solicitud_updated
                      return solicitud;
                    })
                    this.source.load(this.solicitudes_list);
                    Swal.close();
                  })
                  .catch(error => {
                    Swal({
                      type: 'error',
                      title: '404',
                      text: this.translate.instant('ERROR.404'),
                      confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
                    });
                  })
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

  loadTerceroDataOne(solicitud) {
    return new Promise((resolve, reject) => {
      this.tercerosService.get('tercero/?query=Id:' + solicitud.Solicitantes[0].TerceroId)
        .subscribe(res => {
          if (Object.keys(res[0]).length > 0) {
            solicitud.Solicitantes[0].Nombre = <Tercero>res[0].NombreCompleto;
            resolve(true);
          } else {
            this.solicitudes_list = [];
            reject({ status: 404 });
          }
        }, (error: HttpErrorResponse) => {
          reject(error);
        });
    })
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
