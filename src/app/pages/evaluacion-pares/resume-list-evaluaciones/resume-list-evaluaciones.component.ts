import { Component, OnInit, Input } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { HttpErrorResponse } from '@angular/common/http';
import { SolicitudDocenteService } from '../../../@core/data/solicitud-docente.service';
import { LocalDataSource } from 'ng2-smart-table';
import { SolicitudDocentePost } from '../../../@core/data/models/solicitud_docente/solicitud_docente';
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
    console.info(this.solicitud_padre)
    this.showData();
    this.cargarCampos();
  }

  solicitud_padre: SolicitudDocentePost;
  cambiotab: number = 0;
  settings: any;
  source: LocalDataSource = new LocalDataSource();
  par_nombre: string;
  par_email: string;
  evaluacion_selected: SolicitudDocentePost;
  evaluaciones_list: SolicitudDocentePost[];

  constructor(private translate: TranslateService,
    private solicitudDocenteService: SolicitudDocenteService,
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
            title: '<i class="nb-search" title="view"></i>',
          },
        ],
      },
      mode: 'external',
      columns: {
        'Referencia.Nombre': {
          title: this.translate.instant('produccion_academica.nombre_par_academico'),
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
          width: '15%',
        },
        EstadoTipoSolicitudId: {
          title: this.translate.instant('produccion_academica.estado_evaluacion'),
          valuePrepareFunction: (value) => {
            if (value.EstadoId)
              return value.EstadoId.Nombre;
            return 'No encontrado';
          },
          filter: false,
          width: '10%',
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
          console.info(res);
          if (res !== null) {
            const data = <Array<SolicitudDocentePost>>res;
            console.info(data);
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

  ngOnInit() { }

  onView(event): void {
    this.evaluacion_selected = <SolicitudDocentePost>event.data;
    if (this.evaluacion_selected.EstadoTipoSolicitudId) {
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

  selectTab(event): void { }
}
