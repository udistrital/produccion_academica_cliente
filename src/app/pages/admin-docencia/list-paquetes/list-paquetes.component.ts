import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import { LocalDataSource } from 'ng2-smart-table';
import { TercerosService } from '../../../@core/data/terceros.service';
import { SgaMidService } from '../../../@core/data/sga_mid.service';
import { SolicitudDocenteService } from '../../../@core/data/solicitud-docente.service';
import { UserService } from '../../../@core/data/users.service';
import { ProduccionAcademicaPost } from './../../../@core/data/models/produccion_academica/produccion_academica';
import { SolicitudDocentePost } from '../../../@core/data/models/solicitud_docente/solicitud_docente';
import { filterList } from './filtros'
import Swal from 'sweetalert2';
import 'style-loader!angular2-toaster/toaster.css';
import { Tercero } from '../../../@core/data/models/terceros/tercero';
import { PaqueteSolicitudPost } from '../../../@core/data/models/solicitud_docente/paquete';

@Component({
  selector: 'ngx-list-paquetes',
  templateUrl: './list-paquetes.component.html',
  styleUrls: ['./list-paquetes.component.scss']
})
export class ListPaquetesComponent implements OnInit {
  solicitud_updated: SolicitudDocentePost;
  solicitud_selected: SolicitudDocentePost;
  solicitud_selectedReview: SolicitudDocentePost;
  filtros = filterList;
  cambiotab: number = 0;
  config: ToasterConfig;
  settings: any;
  filter: any;
  persona_id: number;
  solicitudes_list: PaqueteSolicitudPost[];
  solicitudes_list_filter: SolicitudDocentePost[];
  source: LocalDataSource = new LocalDataSource();

  constructor(private translate: TranslateService,
    private solicitudDocenteService: SolicitudDocenteService,
    private sgaMidService: SgaMidService,
    private user: UserService,
    private tercerosService: TercerosService,
    private toasterService: ToasterService) {
    this.persona_id = user.getPersonaId() || 1;
    this.showData();
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
        Nombre: {
          title: this.translate.instant('produccion_academica.numero_comite'),
          valuePrepareFunction: (value) => {
            return value;
          },
          filter: false,
          width: '15%',
        },
        FechaComite: {
          title: this.translate.instant('produccion_academica.fecha_comite'),
          valuePrepareFunction: (value) => {
            // return ((value) + '').substring(0, 10);
            return value;
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
    this.loadData();
  }

  loadData() {
    let endpointSolicitud: string;
    endpointSolicitud = 'tr_paquete/';
    this.solicitudDocenteService.get(endpointSolicitud).subscribe((res: any) => {
      if (res !== null) {
        if (Object.keys(res[0]).length > 0 && res.Type !== 'error') {
          const data = <Array<PaqueteSolicitudPost>>res;
          console.info(data);
          this.solicitudes_list = data;
          this.source.load(this.solicitudes_list);
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

  ngOnInit() { }

  onEdit(event): void {
    this.solicitud_selected = event.data;
    this.activetab(1);
  }

  onView(event): void {
    this.solicitud_selected = event.data;
    this.activetab(1);
  }

  // filterSolicitudes(filter) {
  //   console.info(filter);
  //   let data;
  //   if (filter) {
  //     this.solicitudes_list_filter = this.solicitudes_list.filter(solicitud =>
  //       solicitud.EvolucionEstado[solicitud.EvolucionEstado.length - 1].EstadoTipoSolicitudId.EstadoId.Id === filter.Id,
  //     )
  //     data = <Array<SolicitudDocentePost>>this.solicitudes_list_filter;
  //   } else {
  //     data = <Array<SolicitudDocentePost>>this.solicitudes_list;
  //   }
  //   this.source.load(data);
  // }

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
      // this.updateData(event);
      this.cambiotab = 0;
    }
  }

  // updateData(event) {
  //   Swal({
  //     title: 'Espere',
  //     text: 'Trayendo Información',
  //     allowOutsideClick: false,
  //   });
  //   Swal.showLoading();
  //   let endpointSolicitud: string;
  //   endpointSolicitud = 'solicitud_docente/get_one/' + event;
  //   this.sgaMidService.get(endpointSolicitud).subscribe((res: any) => {
  //     if (res !== null) {
  //       if (Object.keys(res[0]).length > 0 && res.Type !== 'error') {
  //         this.solicitud_updated = <SolicitudDocentePost>res[0];
  //         if (JSON.parse(this.solicitud_updated.Referencia).Id !== undefined) {
  //           const endpointProduccion = 'produccion_academica/get_one/' + JSON.parse(this.solicitud_updated.Referencia).Id;
  //           this.sgaMidService.get(endpointProduccion).subscribe((resp: any) => {
  //             if (resp !== null) {
  //               if (Object.keys(resp[0]).length > 0 && resp.Type !== 'error') {
  //                 this.solicitud_updated.ProduccionAcademica = <ProduccionAcademicaPost>resp[0];
  //                 this.loadTerceroData(this.solicitud_updated)
  //                   .then(() => {
  //                     this.solicitudes_list = this.solicitudes_list.map(solicitud => {
  //                       if (solicitud.Id === this.solicitud_updated.Id)
  //                         solicitud = this.solicitud_updated
  //                       return solicitud;
  //                     })
  //                     this.source.load(this.solicitudes_list);
  //                     Swal.close();
  //                   })
  //                   .catch(error => {
  //                     Swal({
  //                       type: 'error',
  //                       title: '404',
  //                       text: this.translate.instant('ERROR.404'),
  //                       confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
  //                     });
  //                   })
  //               } else {
  //                 Swal({
  //                   type: 'error',
  //                   title: '404',
  //                   text: this.translate.instant('ERROR.404'),
  //                   confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
  //                 });
  //               }
  //             }
  //           }, (error: HttpErrorResponse) => {
  //             Swal({
  //               type: 'error',
  //               title: error.status + '',
  //               text: this.translate.instant('ERROR.' + error.status),
  //               confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
  //             });
  //           });
  //         }
  //       } else {
  //         Swal({
  //           type: 'error',
  //           title: '404',
  //           text: this.translate.instant('ERROR.404'),
  //           confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
  //         });
  //       }
  //     }
  //   }, (error: HttpErrorResponse) => {
  //     Swal({
  //       type: 'error',
  //       title: error.status + '',
  //       text: this.translate.instant('ERROR.' + error.status),
  //       confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
  //     });
  //   });
  // }

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
