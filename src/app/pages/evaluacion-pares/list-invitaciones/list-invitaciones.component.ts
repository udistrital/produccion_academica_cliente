import { Component, OnInit } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { HttpErrorResponse } from '@angular/common/http';
import { SolicitudDocenteService } from '../../../@core/data/solicitud-docente.service';
import { SgaMidService } from '../../../@core/data/sga_mid.service';
import { UserService } from '../../../@core/data/users.service';
import { LocalDataSource } from 'ng2-smart-table';
import { SolicitudDocentePost } from '../../../@core/data/models/solicitud_docente/solicitud_docente';
import { ProduccionAcademicaPost } from '../../../@core/data/models/produccion_academica/produccion_academica';
import { EstadoTipoSolicitud } from '../../../@core/data/models/solicitud_docente/estado_tipo_solicitud';
import { Solicitante } from '../../../@core/data/models/solicitud_docente/solicitante';
import Swal from 'sweetalert2';
import 'style-loader!angular2-toaster/toaster.css';
@Component({
  selector: 'ngx-list-invitaciones',
  templateUrl: './list-invitaciones.component.html',
  styleUrls: ['./list-invitaciones.component.scss'],
})
export class ListInvitacionesComponent implements OnInit {
  cambiotab: number = 0;
  settings: any;
  source: LocalDataSource = new LocalDataSource();
  persona_id: number;
  par_email: string;
  evaluador: Solicitante;
  invitacion_updated: SolicitudDocentePost;
  invitacion_selected: SolicitudDocentePost;
  invitaciones_list: SolicitudDocentePost[];
  estadosSolicitudes: Array<EstadoTipoSolicitud>;

  constructor(private translate: TranslateService,
    private user: UserService,
    private solicitudDocenteService: SolicitudDocenteService,
    private sgaMidService: SgaMidService,
  ) {
    this.par_email = (JSON.parse(atob(localStorage
      .getItem('id_token')
      .split('.')[1])).email);
    this.persona_id = user.getPersonaId();
    this.evaluador = new Solicitante();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.cargarCampos();
    });
    this.showData();
    this.cargarCampos();
  }

  cargarCampos() {
    this.settings = {
      actions: {
        position: 'right',
        columnTitle: this.translate.instant('produccion_academica.acciones'),
        delete: false,
        add: false,
        edit: false,
        custom: [
          {
            name: 'check',
            title: '<i class="fa fa-check-circle" title="check"></i>',
          },
        ],
      },
      mode: 'external',
      columns: {
        'SolicitudPadreId.ProduccionAcademica.Titulo': {
          title: this.translate.instant('produccion_academica.titulo_produccion_academica'),
          valuePrepareFunction: (cell, row) => {
            return row.SolicitudPadreId.ProduccionAcademica.Titulo;
          },
          filter: false,
          width: '25%',
        },
        'SolicitudPadreId.ProduccionAcademica.SubtipoProduccionId': {
          title: this.translate.instant('produccion_academica.tipo_produccion_academica'),
          valuePrepareFunction: (cell, row) => {
            return row.SolicitudPadreId.ProduccionAcademica.SubtipoProduccionId.Nombre;
          },
          filter: false,
          width: '15%',
        },
        EstadoTipoSolicitudId: {
          title: this.translate.instant('produccion_academica.estado_solicitud'),
          valuePrepareFunction: (value) => {
            return value.EstadoId.Nombre;
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
        'SolicitudPadreId.ProduccionAcademica.Fecha': {
          title: this.translate.instant('produccion_academica.fecha_publicacion'),
          valuePrepareFunction: (cell, row) => {
            return ((row.SolicitudPadreId.ProduccionAcademica.Fecha) + '').substring(0, 10);
          },
          filter: false,
          width: '15%',
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
        this.source.load(this.invitaciones_list);
        Swal.close();
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
      endpointSolicitud = 'solicitud/email';
      this.solicitudDocenteService.post(endpointSolicitud, { Correo: this.par_email }).subscribe((res: any) => {
        if (res !== null) {
          const data = <Array<SolicitudDocentePost>>res.filter(solicitud => solicitud.EstadoTipoSolicitudId.Id === 10);
          let i = 0;
          data.forEach(solicitud => {
            if (JSON.parse(solicitud.SolicitudPadreId.Referencia).Id !== undefined) {
              const endpointProduccion = 'produccion_academica/get_one/' + JSON.parse(solicitud.SolicitudPadreId.Referencia).Id;
              this.sgaMidService.get(endpointProduccion).subscribe((resp: any) => {
                if (resp !== null) {
                  if (Object.keys(resp[0]).length > 0 && resp.Type !== 'error') {
                    solicitud.SolicitudPadreId.ProduccionAcademica = <ProduccionAcademicaPost>resp[0];
                    i++;
                    if (i === data.length) {
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
          this.invitaciones_list = data;
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

  ngOnInit() { }

  onCheck(event): void {
    const opt = {
      title: this.translate.instant('GLOBAL.aceptar'),
      text: this.translate.instant('produccion_academica.seguro_continuar_aceptar_invitacion'),
      icon: 'warning',
      buttons: true,
      dangerMode: true,
      showCancelButton: true,
    };
    Swal(opt)
      .then((willCreate) => {
        if (willCreate.value) {
          this.loadEstadoSolicitud(12)
            .then(() => {
              Swal({
                title: 'Espere',
                text: 'Enviando Información',
                allowOutsideClick: false,
              });
              Swal.showLoading();
              this.invitacion_selected = <SolicitudDocentePost>event.data;
              this.invitacion_selected.EstadoTipoSolicitudId = this.estadosSolicitudes[0];
              this.invitacion_selected.Observaciones = [];
              this.evaluador.TerceroId = this.persona_id;
              this.evaluador.SolicitudId = this.invitacion_selected;
              this.evaluador.Activo = true;
              if (this.invitacion_selected.Solicitantes.length === 0)
                this.postSolicitante();
              else
                this.updateSolicitudDocente();
            })
            .catch(error => {
              console.info(error)
              if (!error.status) {
                error.status = 409;
              }
              Swal({
                type: 'error',
                title: error.status + '',
                text: this.translate.instant('ERROR.' + error.status),
                confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
              });
            })
        }
      });
  }

  postSolicitante(): void {
    this.solicitudDocenteService.post('solicitante', this.evaluador)
      .subscribe((res: any) => {
        if (res !== null) {
          if (res.Type === 'error') {
            Swal({
              type: 'error',
              title: res.Code,
              text: this.translate.instant('ERROR.' + res.Code),
              confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
            });
          } else {
            this.updateSolicitudDocente();
          }
        }
      })
  }

  updateSolicitudDocente(): void {
    this.sgaMidService.post('solicitud_docente/' + this.invitacion_selected.Id, this.invitacion_selected)
      .subscribe((resp: any) => {
        if (resp.Type === 'error') {
          Swal({
            type: 'error',
            title: resp.Code,
            text: this.translate.instant('ERROR.' + resp.Code),
            confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
          });
        } else {
          this.invitacion_selected = <SolicitudDocentePost>resp;
          this.updateData(this.invitacion_selected)
        }
      });
  }

  selectTab(event): void { }

  updateData(event) {
    this.invitacion_updated = <SolicitudDocentePost>event;
    Swal({
      title: 'Espere',
      text: 'Actualizando Información',
      allowOutsideClick: false,
    });
    Swal.showLoading();
    this.invitaciones_list = this.invitaciones_list.filter(solicitud => solicitud.Id !== this.invitacion_updated.Id)
    this.source.load(this.invitaciones_list);
    this.invitacion_selected = null;
    this.invitacion_updated = null;
    Swal({
      title: `Éxito al Aceptar invitación.`,
      text: 'Información Modificada correctamente',
    });
  }
}
