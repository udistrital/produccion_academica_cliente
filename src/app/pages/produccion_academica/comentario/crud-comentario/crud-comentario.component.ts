import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TercerosService } from '../../../../@core/data/terceros.service';
import { UserService } from '../../../../@core/data/users.service';
import { SgaMidService } from '../../../../@core/data/sga_mid.service';
import { SolicitudDocenteService } from '../../../../@core/data/solicitud-docente.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SolicitudDocentePost } from '../../../../@core/data/models/solicitud_docente/solicitud_docente';
import { Observacion } from '../../../../@core/data/models/solicitud_docente/observacion';
import { TipoObservacion } from '../../../../@core/data/models/solicitud_docente/tipo_observacion';
import { EstadoTipoSolicitud } from '../../../../@core/data/models/solicitud_docente/estado_tipo_solicitud';
import Swal from 'sweetalert2';
import { Tercero } from '../../../../@core/data/models/terceros/tercero';

@Component({
  selector: 'ngx-crud-comentario',
  templateUrl: './crud-comentario.component.html',
  styleUrls: ['./crud-comentario.component.scss'],
})
export class CrudComentarioComponent implements OnInit {

  @Input('solicitud_selected')
  set solicitud(solicitud_selected: SolicitudDocentePost) {
    this.solicitud_selected = solicitud_selected;
  }

  @Output()
  reloadTable = new EventEmitter<boolean>();

  solicitud_selected: SolicitudDocentePost;
  info_solicitud: SolicitudDocentePost;
  observacion: Observacion;
  userData: Tercero;
  userNum: string;
  estadosSolicitudes: Array<EstadoTipoSolicitud>;
  tipoObservaciones: Array<TipoObservacion>;

  constructor(private translate: TranslateService,
    private tercerosService: TercerosService,
    private user: UserService,
    private sgaMidService: SgaMidService,
    private solicitudDocenteService: SolicitudDocenteService) {
    this.observacion = new Observacion();
    this.loadDataObservation();
  }

  loadDataObservation(): void {
    this.loadEstadoSolicitud()
      .then(() => {
        Promise.all([
          this.loadObservationType(),
          this.loadUserData(),
        ]).
          then(() => {
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

  loadEstadoSolicitud(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.solicitudDocenteService.get('estado_tipo_solicitud/?query=EstadoId:2')
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

  loadObservationType(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.solicitudDocenteService.get('tipo_observacion/?query=Id:1')
        .subscribe(res => {
          if (Object.keys(res.Data[0]).length > 0) {
            this.tipoObservaciones = <Array<TipoObservacion>>res.Data;
            resolve(true);
          } else {
            this.tipoObservaciones = [];
            reject({ status: 404 });
          }
        }, (error: HttpErrorResponse) => {
          reject(error);
        });
    });
  }

  loadUserData(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.tercerosService.get('tercero/?query=Id:' + (this.user.getPersonaId() || 1))
        .subscribe(res => {
          // if (res !== null) {
          if (Object.keys(res[0]).length > 0) {
            this.userData = <Tercero>res[0];
            this.userData['PuedeBorrar'] = false;
            this.tercerosService.get('datos_identificacion/?query=tercero_id:' + (this.user.getPersonaId() || 1))
              .subscribe(resp => {
                this.userNum = resp[0].Numero;
                this.userData['Nombre'] = this.userData.NombreCompleto;
                resolve(true);
              })
          } else {
            reject({ status: 404 });
          }
        }, (error: HttpErrorResponse) => {
          reject(error);
        });
    });
  }

  ngOnInit() {
  }

  updateSolicitudDocente(solicitudDocente: any): void {
    this.info_solicitud = <SolicitudDocentePost>solicitudDocente;
    this.info_solicitud.EstadoTipoSolicitudId = <EstadoTipoSolicitud>this.estadosSolicitudes[0];
    this.info_solicitud.TerceroId = this.user.getPersonaId() || 3;
    this.sgaMidService.put('solicitud_docente', this.info_solicitud)
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
        this.observacion.Titulo = '';
        this.observacion.Valor = '';
        this.reloadTable.emit(true);
      }
    });
  }

  validarForm() {
    if (this.observacion.Titulo && this.observacion.Valor) {
      this.observacion.TipoObservacionId = this.tipoObservaciones[0];
      this.observacion.TerceroId = this.user.getPersonaId() | 3;
      this.solicitud_selected.Observaciones.push(this.observacion);
      this.updateSolicitudDocente(this.solicitud_selected);
    }
  }

}
