import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { HttpErrorResponse } from '@angular/common/http';
import { ProduccionAcademicaService } from '../../../@core/data/produccion_academica.service';
import { SgaMidService } from '../../../@core/data/sga_mid.service';
import { SolicitudDocenteService } from '../../../@core/data/solicitud-docente.service';
import { TranslateService } from '@ngx-translate/core';
import { DocumentoService } from '../../../@core/data/documento.service';
import { UserService } from '../../../@core/data/users.service';
import { NuxeoService } from '../../../@core/utils/nuxeo.service';
import { FORM_produccion_academica } from './form-produccion_academica';
import { EstadoTipoSolicitud } from '../../../@core/data/models/solicitud_docente/estado_tipo_solicitud';
import { ProduccionAcademicaPost } from './../../../@core/data/models/produccion_academica/produccion_academica';
import { SubTipoProduccionAcademica } from './../../../@core/data/models/produccion_academica/subtipo_produccion_academica';
import { MetadatoSubtipoProduccion } from '../../../@core/data/models/produccion_academica/metadato_subtipo_produccion';
import { TercerosService } from '../../../@core/data/terceros.service';
import { Tercero } from '../../../@core/data/models/terceros/tercero';
import { TipoProduccionAcademica } from './../../../@core/data/models/produccion_academica/tipo_produccion_academica';
import { EstadoAutorProduccion } from './../../../@core/data/models/produccion_academica/estado_autor_produccion';
import { SolicitudDocentePost } from '../../../@core/data/models/solicitud_docente/solicitud_docente';
import { Observacion } from '../../../@core/data/models/solicitud_docente/observacion';
import Swal from 'sweetalert2';

@Component({
  selector: 'ngx-review-produccion-academica',
  templateUrl: './review-produccion-academica.component.html',
  styleUrls: ['./review-produccion-academica.component.scss'],
})
export class ReviewProduccionAcademicaComponent implements OnInit {

  rol: string;
  buttonAdmin: boolean;
  buttonModify: boolean;
  solicitud_docente_selected: SolicitudDocentePost;
  info_solicitud: SolicitudDocentePost;
  info_produccion_academica: ProduccionAcademicaPost;
  source_authors: Array<any> = [];
  source: LocalDataSource = new LocalDataSource();
  Metadatos: any[];
  pointRequest: number;
  esRechazada: boolean;
  esEvaluada: boolean;
  existeCoincidencia: boolean;
  clean: boolean;
  formProduccionAcademica: any;
  userData: Tercero;
  autorSeleccionado: Tercero;
  isExistPoint: boolean;
  tiposProduccionAcademica: Array<TipoProduccionAcademica>;
  estadosAutor: Array<EstadoAutorProduccion>;
  estadosSolicitudes: Array<EstadoTipoSolicitud>;
  creandoAutor: boolean;
  observaciones_comments: Observacion[] = [];
  observaciones_alerts: Observacion[] = [];
  observaciones_coincidences: Observacion[] = [];
  id_coincidences: string[];

  @Input('solicitud_docente_selected')
  set solicitud(solicitud_docente_selected: SolicitudDocentePost) {
    this.solicitud_docente_selected = solicitud_docente_selected;
    this.observaciones_alerts = [];
    this.observaciones_coincidences = [];
    this.isExistPoint = false;
    if (this.solicitud_docente_selected.Resultado.length > 0 && this.rol !== 'DOCENTE') {
      console.info(JSON.parse(this.solicitud_docente_selected.Resultado).Puntaje)
      this.isExistPoint = true;
      this.pointRequest = JSON.parse(this.solicitud_docente_selected.Resultado).Puntaje;
    }
    this.verifyType();
    this.filterObservations()
    this.loadProduccionAcademica();
    this.setButtonOptions();
  }

  @Output()
  solicitudOut = new EventEmitter<any>();

  @Output() eventChange = new EventEmitter<number>();

  constructor(
    private produccionAcademicaService: ProduccionAcademicaService,
    private nuxeoService: NuxeoService,
    private documentoService: DocumentoService,
    private translate: TranslateService,
    private tercerosService: TercerosService,
    private sgaMidService: SgaMidService,
    private user: UserService,
    private solicitudDocenteService: SolicitudDocenteService,
  ) {
    this.rol = (JSON.parse(atob(localStorage
      .getItem('id_token')
      .split('.')[1])).role)
      .filter((data: any) => (data.indexOf('/') === -1))[0];
    this.formProduccionAcademica = JSON.parse(JSON.stringify(FORM_produccion_academica));
  }

  ngOnInit() { }

  filterObservations() {
    this.solicitud_docente_selected.Observaciones.forEach(observacion => {
      if (Object.keys(observacion).length > 0) {
        if (observacion.TipoObservacionId.Id === 1 || observacion.TipoObservacionId.Id === 3)
          this.observaciones_comments.push(observacion)
        else if (observacion.TipoObservacionId.Id === 2) {
          observacion.Persona = <Tercero>{
            NombreCompleto: 'Sistema',
            Id: 0,
          }
          this.observaciones_alerts.push(observacion);
        } else
          this.observaciones_coincidences.push(observacion);
      }
    });
  }

  public setButtonOptions() {
    if (this.rol !== 'DOCENTE') {
      (this.solicitud_docente_selected.EstadoTipoSolicitudId.EstadoId.Id === 1)
        ? this.buttonAdmin = true : this.buttonAdmin = false;
      (this.solicitud_docente_selected.EstadoTipoSolicitudId.EstadoId.Id !== 9)
        ? this.buttonModify = true : this.buttonModify = false;
    } else {
      (this.solicitud_docente_selected.EstadoTipoSolicitudId.EstadoId.Id === 2
      || this.solicitud_docente_selected.EstadoTipoSolicitudId.EstadoId.Id === 14)
      ? this.buttonModify = true : this.buttonModify = false;
      this.buttonAdmin = false;
    }
  }

  public loadProduccionAcademica(): void {
    if (this.solicitud_docente_selected !== undefined) {
      this.info_produccion_academica = JSON.parse(JSON.stringify(this.solicitud_docente_selected.ProduccionAcademica));
      console.info(this.solicitud_docente_selected)
      this.getTerceroData(this.solicitud_docente_selected.EvolucionEstado[this.solicitud_docente_selected.EvolucionEstado.length - 1].TerceroId);
      // const tipoProduccion = this.tiposProduccionAcademica.filter(tipo =>
      //   tipo.Id === this.info_produccion_academica.SubtipoProduccionId.TipoProduccionId.Id)[0];
      // this.filterTitleProduction(tipoProduccion)
      // this.filterDateProduccion(tipoProduccion)
      this.Metadatos = [];
      const fillForm = function (campos, Metadatos, nuxeoService, documentoService, review) {
        const filesToGet = [];
        campos.forEach(campo => {
          Metadatos.forEach(metadato => {
            if (campo.nombre === metadato.MetadatoSubtipoProduccionId.Id) {
              campo.valor = metadato.Valor;
              if (campo.etiqueta === 'select') {
                campo.valor = campo.opciones[metadato.Valor - 1];
              }
              if (campo.etiqueta === 'file') {
                campo.idFile = parseInt(metadato.Valor, 10);
                filesToGet.push({ Id: campo.idFile, key: campo.nombre });
              }
              if (!campo.etiqueta) {
                campo.label_i18n = metadato.MetadatoSubtipoProduccionId.TipoMetadatoId.CodigoAbreviacion;
              }
            };
          });
          if (!campo.etiqueta && !campo.valor) {
            campo.label_i18n = 'archivo_drive';
          }
        });
        if (filesToGet.length !== 0) {
          nuxeoService.getDocumentoById$(filesToGet, documentoService)
            .subscribe(response => {
              const filesResponse = <any>response;
              if (Object.keys(filesResponse).length === filesToGet.length) {
                campos.forEach(campo => {
                  if (campo.etiqueta === 'file') {
                    campo.url = filesResponse[campo.nombre] + '';
                    campo.urlTemp = filesResponse[campo.nombre] + '';
                  }
                });
              }
            },
              (error: HttpErrorResponse) => {
                Swal({
                  type: 'error',
                  title: error.status + '',
                  text: this.translate.instant('ERROR.' + error.status),
                  confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
                });
              });
        }
      }
      this.loadSubTipoFormFields(this.info_produccion_academica.SubtipoProduccionId, fillForm);
    } else {
      this.info_produccion_academica = new ProduccionAcademicaPost();
      this.info_solicitud = new SolicitudDocentePost();
      this.clean = !this.clean;
      this.Metadatos = [];
    }
  }

  loadSubTipoFormFields(subtipoProduccionAcademica: SubTipoProduccionAcademica, callback: Function) {
    this.formProduccionAcademica = JSON.parse(JSON.stringify(FORM_produccion_academica));
    const query = `query=SubtipoProduccionId:${subtipoProduccionAcademica.Id}`;
    this.produccionAcademicaService.get(`metadato_subtipo_produccion/?limit=0&${query}`)
      .subscribe(res => {
        if (res !== null) {
          (<Array<MetadatoSubtipoProduccion>>res).forEach(metadato => {
            if (Object.keys(metadato).length > 0) {
              const field = JSON.parse(metadato.TipoMetadatoId.FormDefinition);
              field.nombre = metadato.Id;
              this.formProduccionAcademica.campos.push(field);
            }
          });
          if (callback !== undefined) {
            console.info('campos review: ', this.formProduccionAcademica.campos)
            console.info('Metadatos review: ', this.info_produccion_academica.Metadatos)
            callback(this.formProduccionAcademica.campos, this.info_produccion_academica.Metadatos, this.nuxeoService, this.documentoService, this);
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

  verifyType() {
    switch (this.solicitud_docente_selected.ProduccionAcademica.SubtipoProduccionId.TipoProduccionId.Id) {
      case 1: case 6: case 7: case 8: case 10: case 12: case 13: case 14:
        if (this.rol !== 'DOCENTE' && this.solicitud_docente_selected.EstadoTipoSolicitudId.EstadoId.Id >= 4)
          this.esEvaluada = true
        else
          this.esEvaluada = false;
        break;
      case 2: case 3: case 4: case 5: case 9: case 11: case 15: case 16: case 17: case 18: case 19: case 20:
        this.esEvaluada = false;
        break;
      default:
        break;
    }
  }

  seeDetailsState() {
    const opt: any = {
      width: '550px',
      title: this.translate.instant('produccion_academica.estado_solicitud'),
      html: `
      <div class="swal-content" style="margin-left: -120px;">
        <div class="row">
          <div class="col-8">
            <h5>Estado:</h5>
          </div>
          <div class="col-4">
            <p">${(
          this.rol === 'DOCENTE' &&
          this.solicitud_docente_selected.EvolucionEstado[this.solicitud_docente_selected.EvolucionEstado.length - 1].EstadoTipoSolicitudId.EstadoId.Id === 6 ||
          this.solicitud_docente_selected.EvolucionEstado[this.solicitud_docente_selected.EvolucionEstado.length - 1].EstadoTipoSolicitudId.EstadoId.Id === 7
        )
          ? 'Preparada para presentar a Comité'
          : this.solicitud_docente_selected.EvolucionEstado[this.solicitud_docente_selected.EvolucionEstado.length - 1]
            .EstadoTipoSolicitudId.EstadoId.Nombre
        }</p>
          </div>
        </div>
        <div class="row">
          <div class="col-8">
            <h5>Fecha Creación:</h5>
          </div>
          <div class="col-4">
            <p">${this.solicitud_docente_selected.EvolucionEstado[this.solicitud_docente_selected.EvolucionEstado.length - 1]
          .FechaCreacion.substring(0, 10)}</p>
          </div>
        </div>
        <div class="row">
          <div class="col-8">
            <h5>Fecha Limite:</h5>
          </div>
          <div class="col-4">
            <p">${this.solicitud_docente_selected.EvolucionEstado[this.solicitud_docente_selected.EvolucionEstado.length - 1]
          .FechaLimite.substring(0, 10)}</p>
          </div>
        </div>
        <div class="row">
          <div class="col-8">
            <h5>Personal:</h5>
          </div>
          <div class="col-4">
            <p">${this.userData.NombreCompleto}</p>
          </div>
        </div>
      </div>
      `,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    };
    Swal(opt)
  }

  getTerceroData(terceroId) {
    this.tercerosService.get('tercero/?query=Id:' + terceroId)
      .subscribe(res => {
        if (Object.keys(res[0]).length > 0) {
          this.userData = <Tercero>res[0];
        }
      });
  }

  download(url, title, w, h) {
    const left = (screen.width / 2) - (w / 2);
    const top = (screen.height / 2) - (h / 2);
    window.open(url, title, 'toolbar=no,' +
      'location=no, directories=no, status=no, menubar=no,' +
      'scrollbars=no, resizable=no, copyhistory=no, ' +
      'width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
  }

  sendRequest() {
    this.solicitudOut.emit({
      data: this.solicitud_docente_selected,
    });
  }

  onView(alert) {
    const opt: any = {
      width: '550px',
      title: this.translate.instant(alert.Titulo),
      html: `
        <p style="width: 80%; margin: auto">
          ${(alert.Valor.length < 37)
          ? this.translate.instant(alert.Valor.substring(0, 34)) + ' ' + alert.Valor.substring(34, alert.Valor.length)
          : this.translate.instant(alert.Valor)
        }
        </p> <br> <br>
        <small>Escrito por: ${alert.Persona.NombreCompleto}</small> <br>
        <small>Fecha observación: ${(alert.FechaCreacion + '').substring(0, 10)}</small>
      `,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    };
    Swal(opt)
  }

  onViewCoincidence(alert) {
    this.id_coincidences = alert.Valor.split(',');
    this.id_coincidences.pop();
    this.existeCoincidencia = true;
  }

  reloadTable(event) {
    this.eventChange.emit(event);
    this.closePop();
  }

  closePop() {
    this.esRechazada = false;
    this.existeCoincidencia = false;
  }

  rejectRequest() {
    const opt = {
      title: this.translate.instant('produccion_academica.rechazar'),
      text: this.translate.instant('produccion_academica.seguro_continuar_rechazar_produccion'),
      icon: 'warning',
      buttons: true,
      dangerMode: true,
      showCancelButton: true,
    };
    Swal(opt)
      .then((willCreate) => {
        if (willCreate.value) {
          this.esRechazada = true;
        }
      });
  }

  verifyRequest() {
    const opt = {
      title: this.translate.instant('produccion_academica.verificar'),
      text: this.translate.instant('produccion_academica.seguro_continuar_verificar_produccion'),
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
          switch (this.solicitud_docente_selected.ProduccionAcademica.SubtipoProduccionId.TipoProduccionId.Id) {
            case 1: case 6: case 7: case 8: case 10: case 12: case 13: case 14:
              this.passForEvaluation();
              break;
            case 2: case 3: case 4: case 5: case 9: case 11: case 15: case 16: case 17: case 18: case 19: case 20:
              this.calculateResult();
              break;
            default:
              break;
          }
        }
      });
  }

  updateSolicitudDocente(solicitudDocente: any): void {
    this.info_solicitud = <SolicitudDocentePost>solicitudDocente;
    this.info_solicitud.EstadoTipoSolicitudId = <EstadoTipoSolicitud>this.estadosSolicitudes[0];
    this.info_solicitud.TerceroId = this.user.getPersonaId() || 3;
    console.info(this.info_solicitud);
    this.sgaMidService.put('solicitud_docente', this.info_solicitud)
      .subscribe((res: any) => {
        if (res.Type === 'error') {
          Swal({
            type: 'error',
            title: res.Code,
            text: this.translate.instant('ERROR.' + res.Code),
            confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
          });
        } else {
          this.info_solicitud = <SolicitudDocentePost>res;
          console.info(this.info_solicitud)
          Swal({
            title: `Éxito al Verificar Solicitud.`,
            text: 'Información Modificada correctamente',
          });
          this.reloadTable(this.info_solicitud.Id);
        }
      });
  }


  passForEvaluation() {
    this.estadosSolicitudes = [];
    this.solicitudDocenteService.get('estado_tipo_solicitud/?query=EstadoId:3')
      .subscribe(res => {
        if (Object.keys(res.Data[0]).length > 0) {
          this.estadosSolicitudes = <Array<EstadoTipoSolicitud>>res.Data;
          this.updateSolicitudDocente(this.solicitud_docente_selected);
        } else {
          this.estadosSolicitudes = [];
        }
      });
  }

  calculateResult() {
    this.estadosSolicitudes = [];
    this.solicitudDocenteService.get('estado_tipo_solicitud/?query=EstadoId:4')
      .subscribe(res => {
        if (Object.keys(res.Data[0]).length > 0) {
          this.estadosSolicitudes = <Array<EstadoTipoSolicitud>>res.Data;
          this.sgaMidService.put('solicitud_produccion/', this.solicitud_docente_selected)
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
                this.updateSolicitudDocente(this.info_solicitud);
              }
            });
        } else {
          this.estadosSolicitudes = [];
        }
      });
  }
}
