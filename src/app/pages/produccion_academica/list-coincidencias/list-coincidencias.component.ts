import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { SgaMidService } from '../../../@core/data/sga_mid.service';
import { TercerosService } from '../../../@core/data/terceros.service';
import { SolicitudDocentePost } from '../../../@core/data/models/solicitud_docente/solicitud_docente';
import { ProduccionAcademicaPost } from '../../../@core/data/models/produccion_academica/produccion_academica';
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
    console.info(this.id_coincidencias_list);
    this.showData();
  }

  @Output()
  solicitudOut = new EventEmitter<any>();

  @Output() eventChange = new EventEmitter<number>();

  solicitud_docente_selected: SolicitudDocentePost;
  solicitudes_list: SolicitudDocentePost[] = [];
  id_coincidencias_list: string[];
  isView: boolean;

  constructor(
    private translate: TranslateService,
    private sgaMidService: SgaMidService,
    private tercerosService: TercerosService,
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
            Swal.close();
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
        console.info(endpointSolicitud)
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

  closePop() {
    this.isView = false;
  }

  ngOnInit() {
  }

}
