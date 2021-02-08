import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { SgaMidService } from '../../../@core/data/sga_mid.service';
import { SolicitudDocenteService } from '../../../@core/data/solicitud-docente.service';
import { TercerosService } from '../../../@core/data/terceros.service';
import { UserService } from '../../../@core/data/users.service';
import { SolicitudDocentePost } from '../../../@core/data/models/solicitud_docente/solicitud_docente';
import { ProduccionAcademicaPost } from '../../../@core/data/models/produccion_academica/produccion_academica';
import { EstadoTipoSolicitud } from '../../../@core/data/models/solicitud_docente/estado_tipo_solicitud';
import { Tercero } from '../../../@core/data/models/terceros/tercero';
import Swal from 'sweetalert2';

@Component({
  selector: 'ngx-list-coincidencias',
  templateUrl: './list-coincidencias.component.html',
  styleUrls: ['./list-coincidencias.component.scss'],
})
export class ListCoincidenciasComponent implements OnInit {

  @Input('solicitud_docente_selected')
  set solicitud_input(solicitud_docente_selected: SolicitudDocentePost) {
    this.solicitud_docente_selected = solicitud_docente_selected;
  }

  @Input('id_coincidencias_list')
  set coincidencias_input(id_coincidencias_list: string[]) {
    this.id_coincidencias_list = id_coincidencias_list;
    this.showData();
  }

  @Output() reloadTable = new EventEmitter<number>();

  solicitud_docente_selected: SolicitudDocentePost;
  solicitud_docente_coincidence: SolicitudDocentePost;
  info_solicitud: SolicitudDocentePost;
  solicitudes_list: SolicitudDocentePost[] = [];
  estadosSolicitudes: Array<EstadoTipoSolicitud>;
  id_coincidencias_list: string[];
  isView: boolean;

  constructor(
    private translate: TranslateService,
    private sgaMidService: SgaMidService,
    private tercerosService: TercerosService,
    private user: UserService,
    private solicitudDocenteService: SolicitudDocenteService,
  ) { }

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
            this.loadEstadoSolicitud(4)
            .then(() => {
              Swal.close();
            })
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
      let i = 0;
      this.id_coincidencias_list.forEach(idCoincidencia => {
        const endpointSolicitud = 'solicitud_docente/get_one/' + idCoincidencia;
        this.sgaMidService.get(endpointSolicitud).subscribe((res: any) => {
          if (res !== null) {
            if (Object.keys(res[0]).length > 0 && res.Type !== 'error') {
              const solicitud = <SolicitudDocentePost>res[0];

              if (JSON.parse(solicitud.Referencia).Id !== undefined) {
                const endpointProduccion = 'produccion_academica/get_one/' + JSON.parse(solicitud.Referencia).Id;
                this.sgaMidService.get(endpointProduccion).subscribe((resp: any) => {
                  if (resp !== null) {
                    if (Object.keys(resp[0]).length > 0 && resp.Type !== 'error') {
                      solicitud.ProduccionAcademica = <ProduccionAcademicaPost>resp[0];
                      this.solicitudes_list.push(solicitud);
                      i++;
                      if (i === this.id_coincidencias_list.length) {
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

  cloneEvaluations() {
    let endpoint: string;
    endpoint = `solicitud_produccion/coincidencia/${this.solicitud_docente_selected.Id}/${this.solicitud_docente_coincidence.Id}/${this.user.getPersonaId()}`;
    this.sgaMidService.post(endpoint, this.solicitud_docente_selected)
      .subscribe(res => {
        if (res !== null) {
          this.cloneResult();
        }
      })
  }

  cloneResult() {
    this.solicitud_docente_selected.Resultado = `{ \"Puntaje\": ${this.getResult(this.solicitud_docente_coincidence.Resultado)} }`;
    this.updateSolicitudDocente(this.solicitud_docente_selected);
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
    })
  }

  acceptCoincidence(solicitud_selected: SolicitudDocentePost) {
    const opt = {
      title: this.translate.instant('GLOBAL.confirmar'),
      text: this.translate.instant('produccion_academica.seguro_continuar_aceptar_coincidencia'),
      icon: 'warning',
      buttons: true,
      dangerMode: true,
      showCancelButton: true,
    };
    Swal(opt)
      .then((willCreate) => {
        if (willCreate.value) {
          Swal({
            title: 'Espere',
            text: 'Enviando Información',
            allowOutsideClick: false,
          });
          Swal.showLoading();
          this.solicitud_docente_coincidence = solicitud_selected;
          switch (this.solicitud_docente_coincidence.ProduccionAcademica.SubtipoProduccionId.TipoProduccionId.Id) {
            case 1: case 6: case 7: case 8: case 10: case 12: case 13: case 14:
              this.cloneEvaluations();
              break;
            case 2: case 3: case 4: case 5: case 9: case 11: case 15: case 16: case 17: case 18: case 19: case 20:
              this.cloneResult();
              break;
            default:
              break;
          }
        }
      });

  }

  closePop() {
    this.isView = false;
  }

  getResult (resultJson: string): string {
    if (resultJson.length > 0) {
      return JSON.parse(resultJson).Puntaje.toString();
    }
    return '';
  }

  ngOnInit() { }
}
