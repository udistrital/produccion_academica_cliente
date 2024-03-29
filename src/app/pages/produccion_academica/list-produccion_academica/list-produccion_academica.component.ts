import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import { LocalDataSource } from 'ng2-smart-table';
import { ButtonAlertComponent } from '../../../@theme/components/button-alert/button-alert.component';
import { TercerosService } from '../../../@core/data/terceros.service';
import { SgaMidService } from '../../../@core/data/sga_mid.service';
import { UserService } from '../../../@core/data/users.service';
import { ProduccionAcademicaPost } from './../../../@core/data/models/produccion_academica/produccion_academica';
import { SolicitudDocentePost } from '../../../@core/data/models/solicitud_docente/solicitud_docente';
import { filterList } from './filtros'
import Swal from 'sweetalert2';
import 'style-loader!angular2-toaster/toaster.css';
import { Tercero } from '../../../@core/data/models/terceros/tercero';

@Component({
  selector: 'ngx-list-produccion-academica',
  templateUrl: './list-produccion_academica.component.html',
  styleUrls: ['./list-produccion_academica.component.scss'],
})
export class ListProduccionAcademicaComponent implements OnInit {
  solicitud_updated: SolicitudDocentePost;
  solicitud_selected: SolicitudDocentePost;
  solicitud_selectedReview: SolicitudDocentePost;
  filtros = filterList;
  cambiotab: number = 0;
  pageSize = 15;
  config: ToasterConfig;
  settings: any;
  filter: any;
  estado: string;
  rol: string;
  persona_id: number;
  solicitudes_list: SolicitudDocentePost[];
  solicitudes_list_filter: SolicitudDocentePost[];
  source: LocalDataSource = new LocalDataSource();

  @ViewChild('ctdTabset') ctdTabset;

  constructor(private translate: TranslateService,
    private sgaMidService: SgaMidService,
    private user: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private tercerosService: TercerosService,
    private toasterService: ToasterService) {
    this.persona_id = user.getPersonaId() || 1;
    this.rol = (JSON.parse(atob(localStorage
      .getItem('id_token')
      .split('.')[1])).role)
      .filter((data: any) => (data.indexOf('/') === -1))[0];
    this.showData();
    this.cargarCampos();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.cargarCampos();
    });
  }

  cargarCampos() {
    this.settings = {
      pager: {
        display: true,
        // perPage: 30,
        perPage: this.pageSize,
      },
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
            if (value.length > 0) {
              if (this.rol !== 'DOCENTE') {
                return value[value.length - 1].EstadoTipoSolicitudId.EstadoId.Nombre;
              } else {
                if (value[value.length - 1].EstadoTipoSolicitudId.EstadoId.Id === 6 ||
                  value[value.length - 1].EstadoTipoSolicitudId.EstadoId.Id === 7)
                  return 'Preparada para presentar a Comité'
                return value[value.length - 1].EstadoTipoSolicitudId.EstadoId.Nombre;
              }
            }
            return 'Radicada';
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
        'EvolucionEstado.FechaLimite': {
          title: this.translate.instant('produccion_academica.alerta'),
          renderComponent: ButtonAlertComponent,
          type: 'custom',
          filter: false,
          width: '3%',
        },
      },
    };
    if (this.rol !== 'DOCENTE') {
      this.settings.columns.Solicitantes = {
        title: this.translate.instant('GLOBAL.persona'),
        valuePrepareFunction: (value) => {
          if (value.length > 0)
            return value[0].Nombre;
          return 'none';
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
    this.route.params.subscribe((params: Params) => {
      if (params.estado) {
        this.estado = params.estado;
        const estado = params.estado;
        this.router.navigate(['./pages/dashboard']);
        this.router.navigate(['./pages/produccion_academica/list-produccion_academica/' + this.estado]);
        Swal({
          title: 'Espere',
          text: 'Trayendo Información',
          allowOutsideClick: false,
        });
        Swal.showLoading();
        this.loadData(estado, 0)
          .then(() => {
            Swal.close();
            this.source.load(this.solicitudes_list);
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
    });
  }

  loadData(estado, offset): Promise<any> {
    return new Promise((resolve, reject) => {
      let i = 0;
      let endpointSolicitud: string;
      if (this.rol === 'DOCENTE')
        endpointSolicitud = 'solicitud_docente/' + estado + '/' + this.persona_id;
      if (this.rol === 'SECRETARIA_DOCENCIA' || this.rol === 'ADMIN_DOCENCIA')
        endpointSolicitud = 'solicitud_docente/' + estado + '/';
      endpointSolicitud += '?limit=' + this.pageSize * 2 + '&offset=' + offset
      this.sgaMidService.get(endpointSolicitud).subscribe((res: any) => {
        if (res !== null) {
          if (Object.keys(res[0]).length > 0 && res.Type !== 'error') {
            const data = <Array<SolicitudDocentePost>>res;
            data.forEach(solicitud => {
              if (JSON.parse(solicitud.Referencia).Id !== undefined || JSON.parse(solicitud.Referencia).id !== undefined) {
                let endpointProduccion = 'produccion_academica/get_one/';
                if (JSON.parse(solicitud.Referencia).Id === undefined) {
                  endpointProduccion += JSON.parse(solicitud.Referencia).id;
                } else {
                  endpointProduccion += JSON.parse(solicitud.Referencia).Id;
                }
                this.sgaMidService.get(endpointProduccion).subscribe((resp: any) => {
                  if (resp !== null) {
                    if (Object.keys(resp[0]).length > 0 && resp.Type !== 'error') {
                      solicitud.ProduccionAcademica = <ProduccionAcademicaPost>resp[0];
                      i++;
                      if (i === data.length) {
                        resolve(data);
                      }
                    } else {
                      Swal({
                        type: 'info',
                        title: this.translate.instant('GLOBAL.informacion'),
                        text: this.translate.instant('ERROR.lista_vacia'),
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
            this.solicitudes_list = data;
          } else {
            if (this.source.count() > 0) {
              Swal({
                type: 'info',
                title: this.translate.instant('GLOBAL.informacion'),
                text: this.translate.instant('ERROR.no_mas_registros'),
                confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
              });
            } else {
              Swal({
                type: 'warning',
                title: this.translate.instant('GLOBAL.informacion'),
                text: this.translate.instant('ERROR.lista_vacia'),
                confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
              });
            }
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

  ngOnInit() {
    this.source.onChanged().subscribe((change) => {
      if (change.action === 'page') {
        this.pageChange(change.paging.page);
      }
    });
  }

  pageChange(pageIndex) {
    const loadedRecordCount = this.source.count();
    const lastRequestedRecordIndex = pageIndex * this.pageSize;

    if (loadedRecordCount <= lastRequestedRecordIndex) {
      let startIndex = loadedRecordCount + 1;

      Swal({
        title: 'Espere',
        text: 'Trayendo Información',
        allowOutsideClick: false,
      });
      Swal.showLoading();

      this.loadData(this.estado, startIndex)
        .then(data => {
          Swal.close();
          if (this.source.count() > 0) {
            data.forEach(d => this.source.add(d));
            this.source.getAll()
              .then(d => this.source.load(d))
          }
          else
            this.source.load(data);
        })
    }
  }


  onEdit(event): void {
    this.solicitud_selected = event.data;
    this.activetab(1);
  }

  onView(event): void {
    this.solicitud_selectedReview = event.data;
    this.activetab(2);
  }

  filterSolicitudes(filter) {
    let data;
    if (filter) {
      this.solicitudes_list_filter = this.solicitudes_list.filter(solicitud => {
        if (solicitud.EvolucionEstado.length > 0)
          if (solicitud.EvolucionEstado[solicitud.EvolucionEstado.length - 1].EstadoTipoSolicitudId.EstadoId.Id === filter.Id)
            return solicitud;
      });
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
    this.cambiotab = 0;
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
                  this.loadTerceroData(this.solicitud_updated)
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

  loadTerceroData(solicitud) {
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
