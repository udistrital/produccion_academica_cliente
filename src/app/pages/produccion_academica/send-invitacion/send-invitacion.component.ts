import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SgaMidService } from '../../../@core/data/sga_mid.service';
import { SolicitudDocenteService } from '../../../@core/data/solicitud-docente.service';
import { TercerosService } from '../../../@core/data/terceros.service';
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
  styleUrls: ['./send-invitacion.component.scss']
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
    private tercerosService: TercerosService,
    private user: UserService,
    private sgaMidService: SgaMidService,
    private googleMidService: GoogleService,
    private solicitudDocenteService: SolicitudDocenteService
    ) {
      this.invitacion = new Invitacion();
      this.invitacionTemplate = new InvitacionTemplate();
    }

  ngOnInit() {
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
      this.invitacionTemplate.Fecha = Date.now().toString();
      this.invitacionTemplate.urlCreacionCuentaLogin = 'http://www.google.com';
      this.invitacionTemplate.urlRechazarEvaluacion = 'https://httpbin.org/get';
      this.invitacionTemplate.ContenidoProduccion = this.makeHtmlTemplate();
      this.invitacion.to = [];
      this.invitacion.to.push(this.correoTemp);
      this.invitacion.cc = [];
      this.invitacion.bcc = [];
      this.invitacion.subject = 'Solicitud de evaluación';
      this.invitacion.templateName = 'invitacion_par_evaluador.html';
      this.invitacion.templateData = this.invitacionTemplate;

      console.info(this.invitacion)

      const opt = {
        title: this.translate.instant('GLOBAL.registrar'),
        text: this.translate.instant('produccion_academica.seguro_continuar_registrar_produccion'),
        icon: 'warning',
        buttons: true,
        dangerMode: true,
        showCancelButton: true,
      };
      Swal(opt)
        .then((willCreate) => {
          if (willCreate.value) {
            this.sendInvitation();
          }
        });
      // this.updateSolicitudDocente(this.solicitud_selected);
    }
  }

  makeHtmlTemplate() {
    return `
    <div class=\"encabezado\">
      Título:
    </div>
    <div class=\"dato\">
      ${this.solicitud_selected.ProduccionAcademica.Titulo}
    </div>
    <div class=\"encabezado\">
      Tipo Producción:
    </div>
    <div class=\"dato\">
      ${this.solicitud_selected.ProduccionAcademica.SubtipoProduccionId.Nombre}
    </div>
    `
  }

}
