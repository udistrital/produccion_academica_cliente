import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { SgaMidService } from '../../../@core/data/sga_mid.service';
import { SolicitudDocenteService } from '../../../@core/data/solicitud-docente.service';
import { UserService } from '../../../@core/data/users.service';
import { EstadoTipoSolicitud } from '../../../@core/data/models/solicitud_docente/estado_tipo_solicitud';
import { GoogleService } from '../../../@core/data/google.service';
import { Invitacion } from '../../../@core/data/models/evaluacion_par/invitacion';
import { SolicitudDocentePost } from '../../../@core/data/models/solicitud_docente/solicitud_docente';
import { Tercero } from '../../../@core/data/models/terceros/tercero';
import Swal from 'sweetalert2';
import { InvitacionTemplate } from '../../../@core/data/models/evaluacion_par/invitacionTemplate';

@Component({
  selector: 'ngx-send-invitacion',
  templateUrl: './send-invitacion.component.html',
  styleUrls: ['./send-invitacion.component.scss'],
})
export class SendInvitacionComponent implements OnInit {
  @Input('solicitud_selected')
  set solicitud(solicitud_selected: SolicitudDocentePost) {
    this.solicitud_selected = solicitud_selected;
  }

  @Output()
  reloadTable = new EventEmitter<boolean>();

  correoTemp: string
  solicitud_selected: SolicitudDocentePost;
  info_solicitud: SolicitudDocentePost;
  invitacion: Invitacion;
  invitacionTemplate: InvitacionTemplate;
  userData: Tercero;
  userNum: string;
  estadosSolicitudes: Array<EstadoTipoSolicitud>;

  constructor(private translate: TranslateService,
    private user: UserService,
    private sgaMidService: SgaMidService,
    private googleMidService: GoogleService,
    private solicitudDocenteService: SolicitudDocenteService,
    ) {
      this.invitacion = new Invitacion();
      this.invitacionTemplate = new InvitacionTemplate();
    }

  ngOnInit() {
    this.loadDataObservation();
  }

  loadDataObservation(): void {
    this.loadEstadoSolicitud()
      .then(() => {
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
      this.solicitudDocenteService.get('estado_tipo_solicitud/?query=EstadoId:' + 5)
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
    console.info(this.info_solicitud);
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
        this.invitacion.templateData.NombreDocente = '';
        this.invitacion.to = [];
        this.invitacion.templateData = null;
        this.correoTemp = '';
        this.reloadTable.emit(true);
      }
    });
  }

  sendInvitation() {
    this.googleMidService.post('notificacion', this.invitacion)
      .subscribe(res => {
        console.info(res);
      })
  }

  validarForm() {
    if (this.invitacionTemplate.NombreDocente && this.correoTemp) {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      this.invitacionTemplate.Fecha = new Date().toLocaleDateString('es-CO', options);
      this.invitacionTemplate.urlCreacionCuentaLogin = 'http://www.google.com';
      this.invitacionTemplate.urlRechazarEvaluacion = 'https://httpbin.org/get';
      this.invitacionTemplate.ContenidoProduccion = this.makeHtmlTemplate();
      this.invitacion.to = [];
      this.invitacion.to.push(this.correoTemp);
      this.invitacion.cc = [];
      this.invitacion.bcc = [];
      this.invitacion.subject = 'Solicitud de evaluacion';
      this.invitacion.templateName = 'invitacion_par_evaluador.html';
      this.invitacion.templateData = this.invitacionTemplate;
      const opt = {
        title: this.translate.instant('GLOBAL.enviar'),
        text: this.translate.instant('produccion_academica.seguro_continuar_enviar_invitacion'),
        icon: 'warning',
        buttons: true,
        dangerMode: true,
        showCancelButton: true,
      };
      Swal(opt)
        .then((willCreate) => {
          if (willCreate.value) {
            this.sendInvitation();
            this.updateSolicitudDocente(this.solicitud_selected);
          }
        });
    }
  }

  makeHtmlTemplate() {
    return `
    <div class=\"row\">
      <div class=\"encabezado\">
        Título:
      </div>
      <div class=\"dato\">
        ${this.solicitud_selected.ProduccionAcademica.Titulo}
      </div>
    </div>
    <div class=\"row\">
      <div class=\"encabezado\">
        Tipo Producción:
      </div>
      <div class=\"dato\">
        ${this.solicitud_selected.ProduccionAcademica.SubtipoProduccionId.Nombre}
      </div>
    </div>
    ` + this.makeRowMetadato();
  }

  makeRowMetadato(): string {
    let metadatoList: string = ``;
    this.solicitud_selected.ProduccionAcademica.Metadatos.forEach(metadato => {
      if (JSON.parse(metadato.MetadatoSubtipoProduccionId.TipoMetadatoId.FormDefinition).etiqueta === 'input' &&
          metadato.Valor) {
            metadatoList += `
            <div class=\"row\">
              <div class=\"encabezado\">
                ${this.translate
                  .instant('produccion_academica.labels.' + JSON.parse(metadato.MetadatoSubtipoProduccionId.TipoMetadatoId.FormDefinition).label_i18n)
                }
              </div>
              <div class=\"dato\">
                ${metadato.Valor}
              </div>
            </div>

            `
          }
    })
    return metadatoList;
  }
}
