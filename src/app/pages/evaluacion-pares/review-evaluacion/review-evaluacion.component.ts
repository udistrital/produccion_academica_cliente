import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { DocumentoService } from '../../../@core/data/documento.service';
import { EvaluacionDocenteService } from '../../../@core/data/evaluacion-docente.service';
import { SolicitudDocenteService } from '../../../@core/data/solicitud-docente.service';
import { NuxeoService } from '../../../@core/utils/nuxeo.service';
import { FORM_evaluacion_docente } from './form-evaluacion_docente';
import { EvaluacionDocentePost } from '../../../@core/data/models/evaluacion_par/evaluacion';
import { TipoEvaluacion } from '../../../@core/data/models/evaluacion_par/tipo_evaluacion';
import { EstadoTipoSolicitud } from '../../../@core/data/models/solicitud_docente/estado_tipo_solicitud';
import { ProduccionAcademicaPost } from './../../../@core/data/models/produccion_academica/produccion_academica';
import { TercerosService } from '../../../@core/data/terceros.service';
import { Tercero } from '../../../@core/data/models/terceros/tercero';
import { TipoProduccionAcademica } from './../../../@core/data/models/produccion_academica/tipo_produccion_academica';
import { EstadoAutorProduccion } from './../../../@core/data/models/produccion_academica/estado_autor_produccion';
import { SolicitudDocentePost } from '../../../@core/data/models/solicitud_docente/solicitud_docente';
import { Observacion } from '../../../@core/data/models/solicitud_docente/observacion';
import Swal from 'sweetalert2';
import { Seccion } from '../../../@core/data/models/evaluacion_par/seccion';
import { Item } from '../../../@core/data/models/evaluacion_par/item';
@Component({
  selector: 'ngx-review-evaluacion',
  templateUrl: './review-evaluacion.component.html',
  styleUrls: ['./review-evaluacion.component.scss'],
})
export class ReviewEvaluacionComponent implements OnInit {

  @Input('solicitud_evaluacion_selected')
  set evaluacion_id(solicitud_evaluacion_selected: SolicitudDocentePost) {
    this.solicitud_evaluacion_selected = solicitud_evaluacion_selected;
    this.urlExiste = false;
    this.isExistPoint = false;
    this.urlDocument = '';
    this.loadEvaluacionDocente();
    this.loadTerceroData();
    this.getURLFile();
  }

  @Input('solicitud_padre')
  set solicitud(solicitud_padre: SolicitudDocentePost) {
    this.solicitud_padre = solicitud_padre;
    this.id_tipo_produccion = this.solicitud_padre.ProduccionAcademica.SubtipoProduccionId.TipoProduccionId.Id
  }

  @Output()
  solicitudOut = new EventEmitter<any>();

  @Output() eventChange = new EventEmitter<number>();

  evaluador: Tercero;
  id_tipo_produccion: number;
  solicitud_evaluacion_selected: SolicitudDocentePost;
  solicitud_padre: SolicitudDocentePost;
  info_solicitud: SolicitudDocentePost;
  info_evaluacion_docente: EvaluacionDocentePost;
  tipoEvaluacion: TipoEvaluacion;
  Respuestas: any[];
  pointRequest: number;
  esRechazada: boolean;
  esEvaluada: boolean;
  urlExiste: boolean;
  clean: boolean;
  formEvaluacionPar: any;
  userData: Tercero;
  autorSeleccionado: Tercero;
  isExistPoint: boolean;
  urlDocument: string;
  tiposProduccionAcademica: Array<TipoProduccionAcademica>;
  estadosAutor: Array<EstadoAutorProduccion>;
  estadosSolicitudes: Array<EstadoTipoSolicitud>;
  creandoAutor: boolean;
  observaciones_comments: Observacion[] = [];
  observaciones_alerts: Observacion[] = [];

  constructor(
    private evaluacionDocenteService: EvaluacionDocenteService,
    private nuxeoService: NuxeoService,
    private documentoService: DocumentoService,
    private translate: TranslateService,
    private solicitudDocenteService: SolicitudDocenteService,
    private tercerosService: TercerosService,
  ) {
    this.formEvaluacionPar = JSON.parse(JSON.stringify(FORM_evaluacion_docente));
  }

  ngOnInit() { }

  public loadEvaluacionDocente(): void {
    if (this.solicitud_evaluacion_selected !== undefined) {
      const idEvaluacion = JSON.parse(this.solicitud_evaluacion_selected.Referencia).IdEvaluacion;
      this.evaluacionDocenteService.get(`evaluaciones/${idEvaluacion}`)
        .subscribe(res => {
          if (res !== null) {

            this.info_evaluacion_docente = <EvaluacionDocentePost>res.Data;

            this.Respuestas = [];
            const fillForm = function (secciones, respuestas, nuxeoService, documentoService) {
              const filesToGet = [];
              secciones.forEach(seccion => {
                seccion.campos.forEach(campo => {
                  respuestas.forEach(respuesta => {
                    if (campo.nombre === respuesta.respuestas[0].item_id) {
                      campo.valor = respuesta.respuestas[0].respuesta;
                      if (campo.etiqueta === 'select') {
                        campo.valor = respuesta.respuestas[0].respuesta.Nombre;
                      }
                      if (campo.etiqueta === 'file') {
                        campo.idFile = parseInt(respuesta.Valor, 10);
                        filesToGet.push({ Id: campo.idFile, key: campo.nombre });
                      }
                      if (!campo.etiqueta) {
                        campo.label_i18n = respuesta.MetadatoSubtipoProduccionId.TipoMetadatoId.CodigoAbreviacion;
                      }
                    };
                  });
                });
              });
              secciones.forEach(seccion => {
                seccion.campos.filter(campo => campo.valor !== '');
              });
              if (filesToGet.length !== 0) {
                nuxeoService.getDocumentoById$(filesToGet, documentoService)
                  .subscribe(response => {
                    const filesResponse = <any>response;
                    if (Object.keys(filesResponse).length === filesToGet.length) {
                      secciones.forEach(seccion => {
                        seccion.campos.forEach(campo => {
                          if (campo.etiqueta === 'file') {
                            campo.url = filesResponse[campo.nombre] + '';
                            campo.urlTemp = filesResponse[campo.nombre] + '';
                          }
                        });
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
            if (this.solicitud_padre)
              this.loadSubTipoFormFields(this.solicitud_padre.ProduccionAcademica, fillForm);
          }
        });
    } else {
      this.info_evaluacion_docente = new EvaluacionDocentePost();
      this.info_solicitud = new SolicitudDocentePost();
      this.clean = !this.clean;
      this.Respuestas = [];
    }
  }

  loadSubTipoFormFields(produccionAcademica: ProduccionAcademicaPost, callback: Function) {
    this.formEvaluacionPar = JSON.parse(JSON.stringify(FORM_evaluacion_docente));
    const query = `tipos-evaluacion/${this.info_evaluacion_docente.tipo_evaluacion_id}?populate=true`
    this.evaluacionDocenteService.get(query)
      .subscribe(res => {
        if (res !== null) {
          this.tipoEvaluacion = <TipoEvaluacion>res.Data;
          if (produccionAcademica.SubtipoProduccionId.TipoProduccionId.Id === 13 ||
            produccionAcademica.SubtipoProduccionId.TipoProduccionId.Id === 14
          )
            this.filterSections(produccionAcademica);
          (<Array<Seccion>>this.tipoEvaluacion.secciones_id).forEach(seccion => {
            if (Object.keys(seccion).length > 0) {
              const section = seccion.estructura_seccion;
              section.titulo = this.translate.instant('evaluacion.labels.' + section.label_i18n);
              section.orden = section.nombre;
              section.campos = [];
              this.formEvaluacionPar.secciones.push(section);
              (<Array<Item>>seccion.items_id).forEach(item => {
                if (Object.keys(item).length > 0) {
                  const field = item.estructura_item;
                  field.orden = field.nombre;
                  field.nombre = item._id;
                  if (field.etiqueta === 'select')
                    field.key = 'Nombre';
                  section.campos.push(field);
                }
              });
            }
          });
          if (callback !== undefined) {
            callback(
              this.formEvaluacionPar.secciones,
              this.info_evaluacion_docente.respuestas_por_fecha,
              this.nuxeoService,
              this.documentoService,
            );
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

  loadTerceroData() {
    this.solicitudDocenteService.get('solicitante/?query=SolicitudId:' + this.solicitud_evaluacion_selected.Id)
      .subscribe(response => {
        if (response !== null) {
          this.tercerosService.get('tercero/?query=Id:' + (response[0].TerceroId))
            .subscribe(res => {
              if (Object.keys(res[0]).length > 0) {
                this.evaluador = <Tercero>res[0];
                this.tercerosService.get('datos_identificacion/?query=tercero_id:' + (response[0].TerceroId))
                  .subscribe(resp => {
                    if (Object.keys(resp[0]).length > 0) {
                      this.evaluador.DatosDocumento = resp[0];
                    }
                  })
              } else {
                this.evaluador = null;
              }
            }, (error: HttpErrorResponse) => {
              console.info(error)
            });
        }
      });
  }

  filterSections(produccionAcademica: ProduccionAcademicaPost) {
    const metadataNumber: number[] = [];
    const sectionsFilter: any[] = [];
    switch (produccionAcademica.SubtipoProduccionId.Id) {
      case 24:
        produccionAcademica.Metadatos.forEach(metadato => {
          if (metadato.MetadatoSubtipoProduccionId.TipoMetadatoId.Id === 41 || // 1.didáctica 2.documental
            metadato.MetadatoSubtipoProduccionId.TipoMetadatoId.Id === 80)  // 1.internacional 2.nacional
            metadataNumber.push(parseInt(metadato.Valor, 10));
        });
        break;
      case 25:
        produccionAcademica.Metadatos.forEach(metadato => {
          if (metadato.MetadatoSubtipoProduccionId.TipoMetadatoId.Id === 41) // 1.didáctica 2.documental
            metadataNumber.push(parseInt(metadato.Valor, 10));
        });
        break;
      case 26:
      case 27:
        produccionAcademica.Metadatos.forEach(metadato => {
          if (metadato.MetadatoSubtipoProduccionId.TipoMetadatoId.Id === 42) // 1.original 2.complementaria 3.interpretacion
            metadataNumber.push(parseInt(metadato.Valor, 10));
        });
        break;
      default:
        break;
    }
    if (metadataNumber.length > 1) {
      if (metadataNumber[0] === 1) {
        sectionsFilter.push(this.tipoEvaluacion.secciones_id[0])
        sectionsFilter.push(this.tipoEvaluacion.secciones_id[1])
      } else {
        sectionsFilter.push(this.tipoEvaluacion.secciones_id[2])
        sectionsFilter.push(this.tipoEvaluacion.secciones_id[3])
      }
      if (metadataNumber[1] === 1)
        sectionsFilter.pop();
      else
        sectionsFilter.shift();
    } else
      sectionsFilter.push(this.tipoEvaluacion.secciones_id[metadataNumber[0] - 1])
    this.tipoEvaluacion.secciones_id = sectionsFilter;
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

  getURLFile() {
    const filesToGet = [];
    if (this.solicitud_evaluacion_selected.Referencia.length > 0)
      if (JSON.parse(this.solicitud_evaluacion_selected.Referencia).IdDocumento) {
        const idFile = JSON.parse(this.solicitud_evaluacion_selected.Referencia).IdDocumento;
        filesToGet.push({ Id: idFile, key: this.solicitud_evaluacion_selected.Id });

        this.nuxeoService.getDocumentoById$(filesToGet, this.documentoService)
          .subscribe(response => {
            const filesResponse = <any>response;
            if (Object.keys(filesResponse).length === filesToGet.length) {
              this.urlExiste = true;
              this.urlDocument = filesResponse[this.solicitud_evaluacion_selected.Id] + '';
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

  sendRequest() {
    this.solicitudOut.emit({
      data: this.solicitud_evaluacion_selected,
    });
  }

  reloadTable(event) {
    this.eventChange.emit(event);
  }
}
