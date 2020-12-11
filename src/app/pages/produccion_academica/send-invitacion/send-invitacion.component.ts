import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SgaMidService } from '../../../@core/data/sga_mid.service';
import { SolicitudDocenteService } from '../../../@core/data/solicitud-docente.service';
import { TercerosService } from '../../../@core/data/terceros.service';
import { UserService } from '../../../@core/data/users.service';
import { EstadoTipoSolicitud } from '../../../@core/data/models/solicitud_docente/estado_tipo_solicitud';
import { Invitacion } from '../../../@core/data/models/solicitud_docente/invitacion';
import { SolicitudDocentePost } from '../../../@core/data/models/solicitud_docente/solicitud_docente';
import { Tercero } from '../../../@core/data/models/terceros/tercero';
import Swal from 'sweetalert2';

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

  solicitud_selected: SolicitudDocentePost;
  info_solicitud: SolicitudDocentePost;
  invitacion: Invitacion;
  userData: Tercero;
  userNum: string;
  estadosSolicitudes: Array<EstadoTipoSolicitud>;
  
  constructor(private translate: TranslateService,
    private tercerosService: TercerosService,
    private user: UserService,
    private sgaMidService: SgaMidService,
    private solicitudDocenteService: SolicitudDocenteService
    ) { 
      this.invitacion = new Invitacion();
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
        this.invitacion.NombrePar = '';
        this.invitacion.CorreoPar = '';
        this.reloadTable.emit(true);
      }
    });
  }

  validarForm() {
    if (this.invitacion.NombrePar && this.invitacion.CorreoPar) {
      this.invitacion.TerceroId = this.user.getPersonaId() || 3;
      this.solicitud_selected.Invitaciones.push(this.invitacion);
      this.updateSolicitudDocente(this.solicitud_selected);
    }
  }

}
