import { Component, OnInit, Input } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import { LocalDataSource } from 'ng2-smart-table';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { SolicitudDocenteService } from '../../../@core/data/solicitud-docente.service';
import { TercerosService } from '../../../@core/data/terceros.service';
import { SgaMidService } from '../../../@core/data/sga_mid.service';
import { UserService } from '../../../@core/data/users.service';
import { ProduccionAcademicaPost } from './../../../@core/data/models/produccion_academica/produccion_academica';
import { SolicitudDocentePost } from '../../../@core/data/models/solicitud_docente/solicitud_docente';
import { PaqueteSolicitudPost } from '../../../@core/data/models/solicitud_docente/paquete';
import { EstadoTipoSolicitud } from '../../../@core/data/models/solicitud_docente/estado_tipo_solicitud';
import { Tercero } from '../../../@core/data/models/terceros/tercero';
import { filterList } from './filtros'
import Swal from 'sweetalert2';
import 'style-loader!angular2-toaster/toaster.css';

@Component({
  selector: 'ngx-list-solicitudes-paquete',
  templateUrl: './list-solicitudes-paquete.component.html',
  styleUrls: ['./list-solicitudes-paquete.component.scss'],
})
export class ListSolicitudesPaqueteComponent implements OnInit {

  @Input('paquete_solicitud_selected')
  set paquete_solicitud_input(paquete_solicitud_selected: PaqueteSolicitudPost) {
    this.paquete_solicitud_selected = paquete_solicitud_selected;
    this.certificadoAprobado = false;
    this.certificadoExiste = false;
    this.showData();
    this.cargarCampos();
  }

  paquete_solicitud_selected: PaqueteSolicitudPost;
  solicitud_updated: SolicitudDocentePost;
  solicitud_selected: SolicitudDocentePost;
  solicitud_selectedReview: SolicitudDocentePost;
  solicitud_selectedPostpone: SolicitudDocentePost;
  estadosSolicitudes: Array<EstadoTipoSolicitud>;
  filtros = filterList;
  cambiotab: number = 0;
  config: ToasterConfig;
  settings: any;
  filter: any;
  rol: string;
  urlDocument: string;
  urlDocumentComplete: string;
  esRechazada: boolean;
  esComentada: boolean;
  esAplazada: boolean;
  certificadoExiste: boolean;
  certificadoAprobado: boolean;
  persona_id: number;
  solicitudes_list: SolicitudDocentePost[];
  solicitudes_list_filter: SolicitudDocentePost[];
  source: LocalDataSource = new LocalDataSource();

  constructor(private translate: TranslateService,
    private sgaMidService: SgaMidService,
    private user: UserService,
    private solicitudDocenteService: SolicitudDocenteService,
    private tercerosService: TercerosService,
    private router: Router,
    private toasterService: ToasterService) {
    this.urlDocument =
      environment.SPAGOBI.URL + environment.SPAGOBI.CONTEXT + environment.SPAGOBI.ROLE +
      environment.SPAGOBI.CON + environment.SPAGOBI.LAN + environment.SPAGOBI.HOST +
      environment.SPAGOBI.DFORMAT + environment.SPAGOBI.CONTROLLER + environment.SPAGOBI.USER +
      environment.SPAGOBI.EXECUTION + environment.SPAGOBI.CROSS + environment.SPAGOBI.ENVIRONMENT;
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
      pager: {
        display: true,
        perPage: 30,
      },
      edit: {
        editButtonContent: '<i class="nb-edit"></i>',
        saveButtonContent: '<i class="nb-checkmark"></i>',
        cancelButtonContent: '<i class="nb-close"></i>',
      },
      actions: {
        position: 'right',
        columnTitle: this.translate.instant('produccion_academica.acciones'),
        delete: false,
        add: false,
        edit: true,
        custom: [
          {
            name: 'view',
            title: '<i class="nb-search" title="ver"></i>',
          },
          {
            name: 'postpone',
            title: '<i class="fa fa-angle-double-left" title="aplazar"></i>',
          },
          {
            name: 'reject',
            title: '<i class="fa fa-ban" title="negar"></i>',
          },
          {
            name: 'comment',
            title: '<i class="fa fa-comment" title="comentar"></i>',
          },
        ],
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
            this.verifyCertificateExist();
            this.verifyCertificateApproved();
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
          if (res !== null && Object.keys(res[0]).length > 0) {
            const data = <Array<SolicitudDocentePost>>res;
            data.forEach(solicitud => {
              if (JSON.parse(solicitud.Referencia).Id !== undefined) {
                const endpointProduccion = 'produccion_academica/get_one/' + JSON.parse(solicitud.Referencia).Id;
                this.sgaMidService.get(endpointProduccion).subscribe((resp: any) => {
                  if (resp !== null) {
                    if (Object.keys(resp[0]).length > 0 && resp.Type !== 'error') {
                      solicitud.ProduccionAcademica = <ProduccionAcademicaPost>resp[0];
                      if (solicitud.Id === data[data.length - 1].Id) {
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
            this.solicitudes_list = data;
          } else {
            Swal({
              type: 'info',
              title: this.translate.instant('GLOBAL.informacion'),
              text: this.translate.instant('ERROR.lista_vacia'),
              confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
            });
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

  loadEstadoSolicitud(numState): Promise<any> {
    return new Promise((resolve, reject) => {
      if (numState === 0)
        resolve(true)
      this.solicitudDocenteService.get('estado_tipo_solicitud/?query=EstadoId:' + numState)
        .subscribe(res => {
          if (Object.keys(res.Data[0]).length > 0) {
            this.estadosSolicitudes = <Array<EstadoTipoSolicitud>>res.Data;
            resolve(true);
          } else {
            this.estadosSolicitudes = [];
            reject({ status: 404 });
          }
        }, (error: HttpErrorResponse) => {
          reject(error);
        });
    });
  }

  verifyCertificateExist() {
    if (this.solicitudes_list.some(solicitud => solicitud.EstadoTipoSolicitudId.EstadoId.Id === 8))
      this.certificadoExiste = true;
  }

  verifyCertificateApproved() {
    if (this.solicitudes_list.some(solicitud => solicitud.EstadoTipoSolicitudId.EstadoId.Id === 9))
      this.certificadoAprobado = true;
  }

  postponeSolicitud(event) {
    const opt = {
      title: this.translate.instant('produccion_academica.alerta'),
      text: this.translate.instant('produccion_academica.seguro_continuar_posponer_solicitud'),
      icon: 'warning',
      buttons: true,
      dangerMode: true,
      showCancelButton: true,
    };
    Swal(opt)
      .then((willCreate) => {
        if (willCreate.value) {
          this.estadosSolicitudes = [];
          this.loadEstadoSolicitud(14)
            .then(() => {
              Swal({
                title: 'Espere',
                text: 'Trayendo Información',
                allowOutsideClick: false,
              });
              Swal.showLoading();
              this.solicitud_selectedPostpone = <SolicitudDocentePost>event;
              this.solicitud_selectedPostpone.EstadoTipoSolicitudId = <EstadoTipoSolicitud>this.estadosSolicitudes[0];
              this.solicitud_selectedPostpone.TerceroId = this.user.getPersonaId() || 3;
              this.sgaMidService.post('solicitud_docente/' + this.solicitud_selectedPostpone.Id, this.solicitud_selectedPostpone)
                .subscribe((res: any) => {
                  if (res.Type === 'error') {
                    Swal({
                      type: 'error',
                      title: res.Code,
                      text: this.translate.instant('ERROR.' + res.Code),
                      confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
                    });
                  } else {
                    this.solicitud_selectedPostpone = <SolicitudDocentePost>res;
                    this.onChange(this.solicitud_selectedPostpone.Id);
                    Swal({
                      title: `Éxito al Verificar Solicitud.`,
                      text: 'Información Modificada correctamente',
                    });
                  }
                });
            })
            .catch(error => {
              console.error(error);
            })
        }
      });
  }

  ngOnInit() { }

  onCustomAction(event): void {
    if (event.data.EstadoTipoSolicitudId.EstadoId.Id === 9) {
      const opt: any = {
        width: '550px',
        title: this.translate.instant('produccion_academica.alerta'),
        text: this.translate.instant('produccion_academica.solicitud_finalizada'),
        icon: 'warning',
        buttons: true,
        dangerMode: true,
      };
      Swal(opt)
    } else {
      switch (event.action) {
        case 'view':
          this.onView(event);
          break;
        case 'postpone':
          this.onPostpone(event);
          break;
          case 'reject':
            this.onReject(event);
            break;
          case 'comment':
            this.onComment(event);
            break;
      }
    }
  }

  closePop() {
    this.esRechazada = false;
    this.esComentada = false;
    this.esAplazada = false;
  }

  onReject(event): void {
    this.solicitud_selected = event.data;
    const opt = {
      title: this.translate.instant('produccion_academica.rechazar'),
      text: this.translate.instant('produccion_academica.seguro_continuar_rechazar_produccion'),
      icon: 'warning',
      buttons: true,
      dangerMode: true,
      showCancelButton: true,
    };
    Swal(opt)
      .then((willCreate) => {
        if (willCreate.value) {
          this.esRechazada = true;
        }
      });
  }

  onComment(event): void {
    this.solicitud_selected = event.data;
    this.esComentada = true;

  }

  onPostpone(event): void {
    this.solicitud_selected = event.data;
    this.esAplazada = true;
    // this.postponeSolicitud(this.solicitud_selected);
  }

  onEdit(event): void {
    this.solicitud_selected = event.data;
    if (this.solicitud_selected.EstadoTipoSolicitudId.EstadoId.Id === 9) {
      const opt: any = {
        width: '550px',
        title: this.translate.instant('produccion_academica.alerta'),
        text: this.translate.instant('produccion_academica.solicitud_finalizada'),
        icon: 'warning',
        buttons: true,
        dangerMode: true,
      };
      Swal(opt)
    } else {
      this.activetab(1);
    }
  }

  onView(event): void {
    this.solicitud_selectedReview = event.data;
    this.activetab(2);
  }

  filterSolicitudes(filter) {
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
                      this.updatePackage(0, event);
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

  generateDocument(option: number) {
    if (option === 0) {
      this.urlDocumentComplete = this.urlDocument +
        '&document=862&documentName=docenResumenComite&idPaquete_description=&outputType=XLS&idPaquete=' +
        this.paquete_solicitud_selected.Id;
    } else {
      this.urlDocumentComplete = this.urlDocument +
        '&document=868&documentName=docenActaComite&idPaquete_description=&outputType=RTF&idPaquete=' +
        this.paquete_solicitud_selected.Id;
    }
    const a = document.createElement('a');
    a.href = this.urlDocumentComplete;
    a.click();
  }

  generateCertificate() {
    const opt = {
      title: this.translate.instant('GLOBAL.enviar'),
      text: this.translate.instant('produccion_academica.seguro_continuar_generar_acta'),
      icon: 'warning',
      buttons: true,
      dangerMode: true,
      showCancelButton: true,
    };
    Swal(opt)
      .then((willCreate) => {
        if (willCreate.value) {
          this.solicitudes_list = this.solicitudes_list.filter(solicitud => solicitud.EstadoTipoSolicitudId.EstadoId.Id !== 14);
          this.generateDocument(1);
          if (!this.certificadoAprobado)
            this.updatePackage(8, null);
        }
      });
  }

  acceptCertificate() {
    const opt = {
      title: this.translate.instant('GLOBAL.enviar'),
      text: this.translate.instant('produccion_academica.seguro_continuar_aceptar_acta'),
      icon: 'warning',
      buttons: true,
      dangerMode: true,
      showCancelButton: true,
    };
    Swal(opt)
      .then((willCreate) => {
        if (willCreate.value) {
          this.solicitudes_list = this.solicitudes_list.filter(solicitud => solicitud.EstadoTipoSolicitudId.EstadoId.Id !== 14);
          this.solicitudes_list.forEach(solicitud => solicitud.SolicitudFinalizada = true);
          this.updatePackage(9, null);
        }
      });
  }

  updatePackage(numberState, event) {
    this.estadosSolicitudes = [];
    this.loadEstadoSolicitud(numberState)
      .then(() => {
        Swal({
          title: 'Espere',
          text: 'Enviando Información',
          allowOutsideClick: false,
        });
        Swal.showLoading();
        this.paquete_solicitud_selected.SolicitudesList = this.solicitudes_list;
        if (numberState === 0)
          this.paquete_solicitud_selected.EstadoTipoSolicitudId = null;
        else
          this.paquete_solicitud_selected.EstadoTipoSolicitudId = <EstadoTipoSolicitud>this.estadosSolicitudes[0];
        this.paquete_solicitud_selected.TerceroId = this.user.getPersonaId() || 3;
        if (numberState === 9)
          this.paquete_solicitud_selected.PaqueteRevisado = true;
        else
          this.paquete_solicitud_selected.PaqueteRevisado = false;
        this.sgaMidService.post('paquete_solicitud/' + this.paquete_solicitud_selected.Id, this.paquete_solicitud_selected)
          .subscribe((resp: any) => {
            if (resp.Type === 'error') {
              Swal({
                type: 'error',
                title: resp.Code,
                text: this.translate.instant('ERROR.' + resp.Code),
                confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
              });
              this.showToast('error', 'error', this.translate.instant('produccion_academica.produccion_no_creada'));
            } else {
              this.paquete_solicitud_selected = resp;
              Swal({
                title: `Éxito al actualizar Paquete.`,
                text: 'Información Guardada correctamente',
              });
              if (event === null) {
                this.showData();
                this.verifyCertificateExist();
              }
            }
          });
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
