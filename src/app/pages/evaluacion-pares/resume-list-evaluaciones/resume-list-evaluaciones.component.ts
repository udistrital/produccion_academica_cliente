import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { HttpErrorResponse } from '@angular/common/http';
import { SolicitudDocenteService } from '../../../@core/data/solicitud-docente.service';
import { UserService } from '../../../@core/data/users.service';
import { SgaMidService } from '../../../@core/data/sga_mid.service';
import { LocalDataSource } from 'ng2-smart-table';
import { SolicitudDocentePost } from '../../../@core/data/models/solicitud_docente/solicitud_docente';
import { EstadoTipoSolicitud } from '../../../@core/data/models/solicitud_docente/estado_tipo_solicitud';
import Swal from 'sweetalert2';
import 'style-loader!angular2-toaster/toaster.css';

@Component({
  selector: 'ngx-resume-list-evaluaciones',
  templateUrl: './resume-list-evaluaciones.component.html',
  styleUrls: ['./resume-list-evaluaciones.component.scss'],
})
export class ResumeListEvaluacionesComponent implements OnInit {

  @Input('solicitud_padre')
  set solicitud(solicitud_padre: SolicitudDocentePost) {
    this.solicitud_padre = solicitud_padre;
    this.is_evaluated = false;
    this.showData();
    this.cargarCampos();
  }

  @Output()
  reloadTable = new EventEmitter<number>();

  solicitud_padre: SolicitudDocentePost;
  info_solicitud: SolicitudDocentePost;
  cambiotab: number = 0;
  settings: any;
  source: LocalDataSource = new LocalDataSource();
  par_nombre: string;
  par_email: string;
  is_evaluated: boolean;
  is_evaluacion_verify: boolean;
  is_evaluacion_selected: boolean;
  evaluacion_selected: SolicitudDocentePost;
  solicitud_updated: SolicitudDocentePost;
  estadosSolicitudes: EstadoTipoSolicitud[];
  evaluaciones_list: SolicitudDocentePost[];
  evaluaciones_evaluated_list: SolicitudDocentePost[];

  constructor(private translate: TranslateService,
    private solicitudDocenteService: SolicitudDocenteService,
    private user: UserService,
    private sgaMidService: SgaMidService,
  ) {
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.cargarCampos();
    });
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
            name: 'view',
            title: '<i class="nb-search" title="ver"></i>',
          },
          {
            name: 'reject',
            title: '<i class="fa fa-ban" title="rechazar"></i>',
          },
        ],
      },
      mode: 'external',
      columns: {
        'Referencia.Nombre': {
          title: this.translate.instant('produccion_academica.par_academico'),
          valuePrepareFunction: (cell, row) => {
            if (row.Referencia) {
              if (Object.keys(JSON.parse(row.Referencia)).length > 0)
                return JSON.parse(row.Referencia).Nombre;
            }
            return 'No encontrado';
          },
          filter: false,
          width: '25%',
        },
        'Referencia.Correo': {
          title: this.translate.instant('produccion_academica.correo_enviado'),
          valuePrepareFunction: (cell, row) => {
            if (row.Referencia) {
              if (Object.keys(JSON.parse(row.Referencia)).length > 0)
                return JSON.parse(row.Referencia).Correo;
            }
            return 'No encontrado';
          },
          filter: false,
          width: '25%',
        },
        EstadoTipoSolicitudId: {
          title: this.translate.instant('produccion_academica.estado_evaluacion'),
          valuePrepareFunction: (value) => {
            if (value.EstadoId)
              return value.EstadoId.Nombre;
            return 'No encontrado';
          },
          filter: false,
          width: '25%',
        },
        FechaRadicacion: {
          title: this.translate.instant('produccion_academica.fecha_envio'),
          valuePrepareFunction: (value) => {
            if (value)
              return ((value) + '').substring(0, 10);
            return 'No encontrado';
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
        this.source.load(this.evaluaciones_list);
        this.verifyIsEvaluated();
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
      if (this.solicitud_padre) {
        endpointSolicitud = 'solicitud/?limit=0&query=SolicitudPadreId:' + this.solicitud_padre.Id;
        this.solicitudDocenteService.get(endpointSolicitud).subscribe((res: any) => {
          if (res !== null) {
            const data = <Array<SolicitudDocentePost>>res;
            this.evaluaciones_list = data;
            resolve(true);
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
  }

  verifyIsEvaluated() {
    this.evaluaciones_evaluated_list = this.evaluaciones_list.filter(evaluacion => evaluacion.EstadoTipoSolicitudId.EstadoId.Id === 13);
    if (this.evaluaciones_evaluated_list.length > 1 && this.solicitud_padre.EstadoTipoSolicitudId.EstadoId.Id === 5) {
      if (this.evaluaciones_list.some(solicitud => solicitud.EstadoTipoSolicitudId.EstadoId.Id === 10) ||
          this.evaluaciones_list.some(solicitud => solicitud.EstadoTipoSolicitudId.EstadoId.Id === 12)
        )
        this.is_evaluated = false;
      else
        this.is_evaluated = true;
    }
  }

  ngOnInit() { }

  onCustomAction(event): void {
    switch (event.action) {
      case 'view':
        this.onView(event);
        break;
      case 'reject':
        this.onReject(event);
        break;
    }
  }


  onReject(event) {
    this.evaluacion_selected = <SolicitudDocentePost>event.data;
    let opt: any;
    if (this.evaluacion_selected.EstadoTipoSolicitudId) {
      if (this.evaluacion_selected.EstadoTipoSolicitudId.EstadoId.Id === 13) {
        opt = {
          width: '550px',
          title: this.translate.instant('GLOBAL.info_evaluacion'),
          text: this.translate.instant('produccion_academica.evaluacion_evaluada'),
          icon: 'warning',
          buttons: true,
          dangerMode: true,
        };
        Swal(opt)
      } else if (this.evaluacion_selected.EstadoTipoSolicitudId.EstadoId.Id === 11) {
        opt = {
          width: '550px',
          title: this.translate.instant('GLOBAL.info_evaluacion'),
          text: this.translate.instant('produccion_academica.evaluacion_rechazada'),
          icon: 'warning',
          buttons: true,
          dangerMode: true,
        };
        Swal(opt)
      } else {
        const opt2 = {
          title: this.translate.instant('produccion_academica.rechazar_evaluacion'),
          text: this.translate.instant('produccion_academica.seguro_continuar_rechazar_evaluacion'),
          icon: 'warning',
          buttons: true,
          dangerMode: true,
          showCancelButton: true,
        };
        Swal(opt2)
          .then((willCreate) => {
            if (willCreate.value) {
              this.sgaMidService.get('solicitud_evaluacion/' + this.evaluacion_selected.Id)
              .subscribe(resp => {
                if (resp !== null) {
                  this.uploadEvaluationInfo(this.evaluacion_selected.Id)
                }
              })
            }
          });
      }
    }
  }

  onView(event): void {
    this.evaluacion_selected = <SolicitudDocentePost>event.data;
    if (this.evaluacion_selected.EstadoTipoSolicitudId) {
      if (this.evaluacion_selected.EstadoTipoSolicitudId.EstadoId.Id === 13) {
        this.is_evaluacion_selected = true;
      } else {
        let opt: any;
        if (this.evaluacion_selected.EstadoTipoSolicitudId.EstadoId.Id === 10) {
          opt = {
            width: '550px',
            title: this.translate.instant('GLOBAL.info_evaluacion'),
            text: this.translate.instant('produccion_academica.evaluacion_espera'),
            icon: 'warning',
            buttons: true,
            dangerMode: true,
          };
        }
        if (this.evaluacion_selected.EstadoTipoSolicitudId.EstadoId.Id === 11) {
          opt = {
            width: '550px',
            title: this.translate.instant('GLOBAL.info_evaluacion'),
            text: this.translate.instant('produccion_academica.evaluacion_rechazo'),
            icon: 'warning',
            buttons: true,
            dangerMode: true,
          };
        }
        if (this.evaluacion_selected.EstadoTipoSolicitudId.EstadoId.Id === 12) {
          opt = {
            width: '550px',
            title: this.translate.instant('GLOBAL.info_evaluacion'),
            text: this.translate.instant('produccion_academica.evaluacion_en_evaluacion'),
            icon: 'warning',
            buttons: true,
            dangerMode: true,
          };
        }
        Swal(opt)
      }
    }
  }

  closePop() {
    this.is_evaluacion_selected = false;
    this.is_evaluacion_verify = false;
  }

  loadEstadoSolicitud(estadoNum): Promise<any> {
    return new Promise((resolve, reject) => {
      const endpoint = 'estado_tipo_solicitud/?query=EstadoId:' + estadoNum;
      this.solicitudDocenteService.get(endpoint)
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

  updateSolicitudDocente(solicitudDocente: any): void {
    this.info_solicitud = <SolicitudDocentePost>solicitudDocente;
    this.info_solicitud.EstadoTipoSolicitudId = <EstadoTipoSolicitud>this.estadosSolicitudes[0];
    this.info_solicitud.TerceroId = this.user.getPersonaId() || 3;
    this.sgaMidService.post('solicitud_docente/' + this.info_solicitud.Id, this.info_solicitud)
      .subscribe((resp: any) => {
        if (resp.Type === 'error') {
          Swal({
            type: 'error',
            title: resp.Code,
            text: this.translate.instant('ERROR.' + resp.Code),
            confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
          });
        } else {
          this.info_solicitud = <SolicitudDocentePost>resp;
          Swal({
            title: `Éxito al Enviar Observación.`,
            text: 'Información Modificada correctamente',
          });
          this.reloadTable.emit(this.info_solicitud.Id);
        }
      });
  }

  verifyRequest() {
    this.closePop();
    const opt = {
      width: '700px',
      title: this.translate.instant('produccion_academica.verificar'),
      text: this.translate.instant('evaluacion.seguro_continuar_verificar_evaluaciones'),
      icon: 'warning',
      buttons: true,
      dangerMode: true,
      showCancelButton: true,
    };
    Swal(opt)
      .then((willCreate) => {
        if (willCreate.value) {
          this.loadEstadoSolicitud(4)
            .then(() => {
              this.solicitud_padre.Resultado = `{ \"Puntaje\": ${this.calculateResult()} }`
              this.updateSolicitudDocente(this.solicitud_padre);
            })
            .catch(error => {
              Swal({
                type: 'warning',
                title: 'ERROR',
                text: this.translate.instant('ERROR.general'),
                confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
              });
            })
        }
      });
  }

  uploadEvaluationInfo(idSolicitud) {
    Swal({
      title: 'Espere',
      text: 'Trayendo Información',
      allowOutsideClick: false,
    });
    Swal.showLoading();
    let endpointSolicitud: string;
    endpointSolicitud = 'solicitud_docente/get_one/' + idSolicitud;
    this.sgaMidService.get(endpointSolicitud).subscribe((res: any) => {
      if (res !== null) {
        if (Object.keys(res[0]).length > 0 && res.Type !== 'error') {
          this.solicitud_updated = <SolicitudDocentePost>res[0];
          this.evaluaciones_list = this.evaluaciones_list.map(solicitud => {
            if (solicitud.Id === this.solicitud_updated.Id)
              solicitud = this.solicitud_updated
            return solicitud;
          })
          this.source.load(this.evaluaciones_list);
          this.verifyIsEvaluated();
          Swal.close();
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

  getEvaluationResult(evaluacion: SolicitudDocentePost): number {
    if (evaluacion.Resultado) {
      if (Object.keys(JSON.parse(evaluacion.Resultado)).length > 0)
        return JSON.parse(evaluacion.Resultado).Puntaje;
    }
    return 0;
  }

  getEvaluationName(evaluacion: SolicitudDocentePost): string {
    if (evaluacion.Referencia) {
      if (Object.keys(JSON.parse(evaluacion.Referencia)).length > 0)
        return JSON.parse(evaluacion.Referencia).Nombre;
    }
    return 'No encontrado';
  }

  calculateResult(): number {
    let result = 0;
    for (const evaluacion of this.evaluaciones_evaluated_list) {
      result += this.getEvaluationResult(evaluacion);
    }
    return (result / this.evaluaciones_evaluated_list.length);
  }

  selectTab(event): void { }
}
