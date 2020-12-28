import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import { LocalDataSource } from 'ng2-smart-table';
import { ButtonAlertComponent } from '../../../@theme/components/button-alert/button-alert.component';
import { SgaMidService } from '../../../@core/data/sga_mid.service';
import { TercerosService } from '../../../@core/data/terceros.service';
import { SolicitudDocenteService } from '../../../@core/data/solicitud-docente.service';
import { UserService } from '../../../@core/data/users.service';
import { PaqueteSolicitudPost } from '../../../@core/data/models/solicitud_docente/paquete';
import { SolicitudDocentePost } from '../../../@core/data/models/solicitud_docente/solicitud_docente';
import { ProduccionAcademicaPost } from './../../../@core/data/models/produccion_academica/produccion_academica';
import { EstadoTipoSolicitud } from '../../../@core/data/models/solicitud_docente/estado_tipo_solicitud';
import { Tercero } from '../../../@core/data/models/terceros/tercero';
import { filterList } from './filtros'
import Swal from 'sweetalert2';
import 'style-loader!angular2-toaster/toaster.css';

@Component({
  selector: 'ngx-list-produccion-academica',
  templateUrl: './list_aproved-produccion_academica.component.html',
  styleUrls: ['./list_aproved-produccion_academica.component.scss'],
})
export class ListAprovedProduccionAcademicaComponent implements OnInit {
  solicitud_selected: SolicitudDocentePost;
  solicitud_selectedReview: SolicitudDocentePost;
  paquete_solicitud: PaqueteSolicitudPost;
  filtros = filterList;
  isDateInput: boolean = false;
  cambiotab: number = 0;
  config: ToasterConfig;
  settings: any;
  filter: any;
  rol: string;
  persona_id: number;
  estadosSolicitudes: Array<EstadoTipoSolicitud>;
  solicitudes_list: SolicitudDocentePost[];
  solicitudes_list_filter: SolicitudDocentePost[];
  solicitudes_selected_list: SolicitudDocentePost[] = [];
  source: LocalDataSource = new LocalDataSource();

  constructor(private translate: TranslateService,
    private sgaMidService: SgaMidService,
    private tercerosService: TercerosService,
    private solicitudDocenteService: SolicitudDocenteService,
    private user: UserService,
    private router: Router,
    private toasterService: ToasterService) {
    this.paquete_solicitud = new PaqueteSolicitudPost();
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
      selectMode: 'multi',
      pager: {
        display: true,
        perPage: 30,
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
        select: true,
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
        Solicitantes: {
          title: this.translate.instant('GLOBAL.persona'),
          valuePrepareFunction: (value) => {
            return value[0].Nombre;
          },
          filter: false,
          width: '20%',
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
    let i: number = 0;
    return new Promise((resolve, reject) => {
      let endpointSolicitud: string;
      if (this.rol === 'SECRETARIA_DOCENCIA' || this.rol === 'ADMIN_DOCENCIA')
        endpointSolicitud = 'solicitud_docente/get_estado/4';
      this.sgaMidService.get(endpointSolicitud).subscribe((res: any) => {
        if (res !== null) {
          if (Object.keys(res[0]).length > 0 && res.Type !== 'error') {
            const dataSolicitud = <Array<SolicitudDocentePost>>res;
            dataSolicitud.forEach(solicitud => {
              if (Object.keys(solicitud.Observaciones[0]).length === 0) {
                solicitud.Observaciones = []
              }
              if (JSON.parse(solicitud.Referencia).Id !== undefined) {
                const endpointProduccion = 'produccion_academica/get_one/' + JSON.parse(solicitud.Referencia).Id;
                this.sgaMidService.get(endpointProduccion).subscribe((resp: any) => {
                  if (resp !== null) {
                    if (Object.keys(resp[0]).length > 0 && resp.Type !== 'error') {
                      solicitud.ProduccionAcademica = <ProduccionAcademicaPost>resp[0];
                      i++
                      if (i === dataSolicitud.length) {
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
            this.solicitudes_list = dataSolicitud;
            console.info(this.solicitudes_list);
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
    });
  }

  loadEstadoSolicitud(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.solicitudDocenteService.get('estado_tipo_solicitud/?query=EstadoId:' + 6)
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

  ngOnInit() {
    this.loadEstadoSolicitud()
    .then(() => {})
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

  onEdit(event): void {
    this.solicitud_selected = event.data;
    this.activetab(1);
  }

  onView(event): void {
    this.solicitud_selectedReview = event.data;
    this.activetab(2);
  }

  onSelect(event): void {
    console.info(event)
    if (event.data)
      this.solicitudes_selected_list = event.selected;
    else if (event.selected.length > 0)
      this.solicitudes_selected_list = this.solicitudes_list;
    else
      this.solicitudes_selected_list = [];
    console.info(this.solicitudes_selected_list);
  }

  filterSolicitudes(filter) {
    this.solicitudes_selected_list = [];
    let data;
    if (filter) {
      this.solicitudes_list_filter = this.solicitudes_list.filter(solicitud =>
        solicitud.ProduccionAcademica.SubtipoProduccionId.CategoriaProduccion.TipoPuntaje === filter.Nombre,
      )
      data = <Array<SolicitudDocentePost>>this.solicitudes_list_filter;
    } else {
      data = <Array<SolicitudDocentePost>>this.solicitudes_list;
    }
    this.source.load(data);
  }

  verifySelected() {
    if (this.solicitudes_selected_list.length === 0) {
      const opt: any = {
        width: '550px',
        title: this.translate.instant('produccion_academica.generacion_paquete'),
        html: this.translate.instant('produccion_academica.alerta_no_seleccion'),
        icon: 'warning',
        buttons: true,
        dangerMode: true,
      };
      Swal(opt)
    } else {
      const opt = {
        title: this.translate.instant('GLOBAL.registrar'),
        text: this.translate.instant('produccion_academica.seguro_continuar_generar_paquete'),
        icon: 'warning',
        buttons: true,
        dangerMode: true,
        showCancelButton: true,
      };
      Swal(opt)
        .then((willCreate) => {
          if (willCreate.value) {
            this.isDateInput = true;
          }
        });
    }
  }

  generatePackage() {
    this.closePop();
    Swal({
      title: 'Espere',
      text: 'Enviando Información',
      allowOutsideClick: false,
    });
    Swal.showLoading();
    this.paquete_solicitud.SolicitudesList = this.solicitudes_selected_list;
    this.paquete_solicitud.Nombre = this.paquete_solicitud.NumeroComite;
    this.paquete_solicitud.EstadoTipoSolicitudId = <EstadoTipoSolicitud>this.estadosSolicitudes[0];
    this.paquete_solicitud.TerceroId = this.user.getPersonaId() || 3;
    this.sgaMidService.post('paquete_solicitud', this.paquete_solicitud)
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
          this.paquete_solicitud = resp;
          console.info(resp);
          Swal({
            title: `Éxito al crear Paquete.`,
            text: 'Información Guardada correctamente',
          });
          this.router.navigate(['./pages/produccion_academica/new-solicitud']);
        }
      });
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

  closePop() {
    this.isDateInput = false;
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

