import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { SgaMidService } from '../../../@core/data/sga_mid.service';
import { UserService } from '../../../@core/data/users.service';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
// import { UserService } from '../../../@core/data/users.service';
import { ProduccionAcademicaPost } from './../../../@core/data/models/produccion_academica/produccion_academica';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import 'style-loader!angular2-toaster/toaster.css';
import { filterList } from './filtros'
import { SolicitudDocentePost } from '../../../@core/data/models/solicitud_docente/solicitud_docente';

@Component({
  selector: 'ngx-list-produccion-academica',
  templateUrl: './list-produccion_academica.component.html',
  styleUrls: ['./list-produccion_academica.component.scss'],
  })
export class ListProduccionAcademicaComponent implements OnInit {
  solicitud_selected: SolicitudDocentePost;
  solicitud_selectedReview: SolicitudDocentePost;
  filtros = filterList;
  cambiotab: number = 0;
  config: ToasterConfig;
  settings: any;
  filter: any;
  persona_id: number;

  source: LocalDataSource = new LocalDataSource();

  constructor(private translate: TranslateService,
    private sgaMidService: SgaMidService,
    private user: UserService,
    private toasterService: ToasterService) {
    this.persona_id = user.getPersonaId() || 2;
    this.loadData();
    this.cargarCampos();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.cargarCampos();
    });
  }

  cargarCampos() {
    this.settings = {
      actions: {
        columnTitle: this.translate.instant('produccion_academica.acciones'),
        custom: [
          {
            name: 'view',
            title: '<i class="nb-search" title="view"></i>',
          },
        ],
        delete: false,
        add: false,
      },
      edit: {
        editButtonContent: '<i class="nb-edit"></i>',
        saveButtonContent: '<i class="nb-checkmark"></i>',
        cancelButtonContent: '<i class="nb-close"></i>',
      },
      mode: 'external',
      columns: {
        // Persona: {
        //   title: this.translate.instant('GLOBAL.persona'),
        //   // type: 'number;',
        //   valuePrepareFunction: (value) => {
        //     return value;
        //   },
        // },
        'ProduccionAcademica.Titulo': {
          title: this.translate.instant('produccion_academica.titulo_produccion_academica'),
          valuePrepareFunction: (cell, row) => {
            return row.ProduccionAcademica.Titulo;
          },
          filter: false,
          width: '20%',
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
            return value[0].EstadoTipoSolicitudId.EstadoId.Nombre;
          },
          filter: false,
          width: '30%',
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
          width: '10%',
        },
      },
    };
  }

  useLanguage(language: string) {
    this.translate.use(language);
  }

  loadData(): void {
    Swal({
      title: 'Espere',
      text: 'Trayendo Información',
      allowOutsideClick: false,
    });
    Swal.showLoading();
    this.sgaMidService.get('produccion_academica/' + this.persona_id).subscribe((res: any) => {
      if (res !== null) {
        if (Object.keys(res[0]).length > 0 && res.Type !== 'error') {
          const dataProduccion = <Array<ProduccionAcademicaPost>>res;
          this.sgaMidService.get('solicitud_docente/' + this.persona_id).subscribe((resp: any) => {
            if (resp !== null) {
              if (Object.keys(resp[0]).length > 0 && resp.Type !== 'error') {
                const data = <Array<SolicitudDocentePost>>resp;
                console.info(data);
                data.forEach(solicitud => {
                  dataProduccion.forEach(produccion => {
                    if (JSON.parse(solicitud.Referencia).Id === produccion.Id)
                      solicitud.ProduccionAcademica = produccion;
                  })
                });
                Swal.close();
                this.source.load(data);
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

  ngOnInit() {
  }

  onEdit(event): void {
    if (event.data.ProduccionAcademica.EstadoEnteAutorId.EstadoAutorProduccionId.Id === 1 ||
        event.data.ProduccionAcademica.EstadoEnteAutorId.EstadoAutorProduccionId.Id === 2
    ) {
      this.solicitud_selected = event.data;
      this.activetab(1);
    } else if (event.data.ProduccionAcademica.EstadoEnteAutorId.EstadoAutorProduccionId.Id === 3) {
      this.updateEstadoAutor(event.data);
    } else {
      this.showToast('error', 'Error', this.translate.instant('GLOBAL.accion_no_permitida'));
    }
  }

  onView(event): void {
    if (event.data.ProduccionAcademica.EstadoEnteAutorId.EstadoAutorProduccionId.Id === 1 ||
        event.data.ProduccionAcademica.EstadoEnteAutorId.EstadoAutorProduccionId.Id === 2
    ) {
      this.solicitud_selectedReview = event.data;
      this.activetab(2);
    } else if (event.data.ProduccionAcademica.EstadoEnteAutorId.EstadoAutorProduccionId.Id === 3) {
      this.updateEstadoAutor(event.data);
    } else {
      this.showToast('error', 'Error', this.translate.instant('GLOBAL.accion_no_permitida'));
    }
  }

  filterSolicitudes(filter) {

  }

  updateEstadoAutor(data: any): void {
    const opt: any = {
      title: 'Error',
      text: this.translate.instant('produccion_academica.autor_no_ha_confirmado'),
      icon: 'warning',
      buttons: true,
      dangerMode: true,
      showCancelButton: true,
    };
    Swal(opt)
    .then((willConfirm) => {
      if (willConfirm.value) {
        const optConfirmar: any = {
          title: this.translate.instant('GLOBAL.confirmar'),
          text: this.translate.instant('produccion_academica.confirma_participar_produccion'),
          icon: 'warning',
          buttons: true,
          dangerMode: true,
          showCancelButton: true,
          confirmButtonText: this.translate.instant('GLOBAL.si'),
          cancelButtonText: this.translate.instant('GLOBAL.no'),
        };
         Swal(optConfirmar)
        .then((isAuthor) => {
          const dataPut = {
            acepta: isAuthor.value ? true : false,
            AutorProduccionAcademica: data.EstadoEnteAutorId,
          }
          this.sgaMidService.put('produccion_academica/estado_autor_produccion/' + dataPut.AutorProduccionAcademica.Id, dataPut)
          .subscribe((res: any) => {
            if (res.Type === 'error') {
              Swal({
                type: 'error',
                title: res.Code,
                text: this.translate.instant('ERROR.' + res.Code),
                confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
              });
              this.showToast('error', 'Error', this.translate.instant('produccion_academica.estado_autor_no_actualizado'));
            } else {
              this.loadData();
              this.showToast('success', this.translate.instant('GLOBAL.actualizar'), this.translate.instant('produccion_academica.estado_autor_actualizado'));
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

  onChange(event, number) {
    if (event) {
      this.loadData();
      this.cambiotab = number;
    }
  }


  itemselec(event): void {
    // console.log("afssaf");
  }

  private showToast(type: string, title: string, body: string) {
    this.config = new ToasterConfig({
      // 'toast-top-full-width', 'toast-bottom-full-width', 'toast-top-left', 'toast-top-center'
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
