import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import { HttpErrorResponse } from '@angular/common/http';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { SgaMidService } from '../../../@core/data/sga_mid.service';
import { EvaluacionDocenteService } from '../../../@core/data/evaluacion-docente.service';
import { TercerosService } from '../../../@core/data/terceros.service';
import { NuxeoService } from '../../../@core/utils/nuxeo.service';
import { DocumentoService } from '../../../@core/data/documento.service';
import { SolicitudDocenteService } from '../../../@core/data/solicitud-docente.service';
import { FORM_evaluacion_docente } from './form-evaluacion_docente'
import { Tercero } from '../../../@core/data/models/terceros/tercero';
import { SolicitudDocentePost } from '../../../@core/data/models/solicitud_docente/solicitud_docente';
import { ProduccionAcademicaPost } from '../../../@core/data/models/produccion_academica/produccion_academica';
import { EstadoTipoSolicitud } from '../../../@core/data/models/solicitud_docente/estado_tipo_solicitud';
import { TipoEvaluacion } from '../../../@core/data/models/evaluacion_par/tipo_evaluacion';
import { EvaluacionDocentePost } from '../../../@core/data/models/evaluacion_par/evaluacion';
import { Seccion } from '../../../@core/data/models/evaluacion_par/seccion';
import { Item } from '../../../@core/data/models/evaluacion_par/item';
import Swal from 'sweetalert2';
import pdfMake from 'pdfmake/build/pdfmake';
import html2canvas from 'html2canvas';
import 'style-loader!angular2-toaster/toaster.css';

@Component({
  selector: 'ngx-crud-evaluacion',
  templateUrl: './crud-evaluacion.component.html',
  styleUrls: ['./crud-evaluacion.component.scss'],
})
export class CrudEvaluacionComponent implements OnInit {
  @Input('solicitud_evaluacion_selected')
  set evaluacion(solicitud_evaluacion_selected: SolicitudDocentePost) {
    this.solicitud_evaluacion_selected = solicitud_evaluacion_selected;
    this.evaluacion_post.ciudad = undefined;
    this.loadSubTipoFormFields(this.solicitud_evaluacion_selected.SolicitudPadreId.ProduccionAcademica, null);
  }
  @Input('evaluador_id_selected')
  set evaluador_id(evaluador_id_selected: number) {
    this.evaluador_id_selected = evaluador_id_selected;
    this.loadTerceroData(this.evaluador_id_selected);
  }

  @Output() eventChange = new EventEmitter<any>();

  @ViewChild('formPdf') formPdf: ElementRef;

  orden_result_id: string[] = ['6', '13', '19', '22', '25', '31', '36', '41', '46', '51', '56', '61', '82', '92', '102', '112', '122', '158', '213'];
  resultado_evaluacion: number;
  config: ToasterConfig;
  solicitud_evaluacion_selected: SolicitudDocentePost;
  evaluador_id_selected: number;
  evaluacion_post_selected: EvaluacionDocentePost;
  evaluacion_post: EvaluacionDocentePost;
  tipoEvaluacion: TipoEvaluacion;
  estadosSolicitudes: EstadoTipoSolicitud[];
  formEvaluacionPar: any;
  clean: boolean;
  formConstruido: boolean;
  editando: boolean;
  evaluador: Tercero;
  fecha_actual: string;
  id_documento: number;
  url_documento: string;

  constructor(
    public translate: TranslateService,
    private evaluacionDocenteService: EvaluacionDocenteService,
    private tercerosService: TercerosService,
    private nuxeoService: NuxeoService,
    private documentoService: DocumentoService,
    private solicitudDocenteService: SolicitudDocenteService,
    private toasterService: ToasterService,
    private sgaMidService: SgaMidService,
  ) {
    this.fecha_actual = (new Date()).toISOString().split('T')[0];
    this.evaluacion_post = new EvaluacionDocentePost;
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.construirForm();
    });
  }

  construirForm() {
    this.formEvaluacionPar.titulo = this.translate.instant('evaluacion.evaluacion_docente');
    this.formEvaluacionPar.btn = this.translate.instant('GLOBAL.guardar');
    this.formEvaluacionPar.secciones.forEach(seccion => {
      seccion.campos.forEach(campo => {
        campo.label = this.translate.instant('evaluacion.labels.' + campo.label_i18n);
        (campo.placeholder_i18n) &&
          (campo.placeholder = this.translate.instant('evaluacion.placeholders.' + campo.placeholder_i18n));
      })
    });
  }

  loadEstadoSolicitud(numState): Promise<any> {
    return new Promise((resolve, reject) => {
      if (numState === 0)
        resolve(true)
      this.solicitudDocenteService.get('estado_tipo_solicitud/?query=EstadoId:' + numState)
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

  loadTerceroData(evaluador_id) {
    this.tercerosService.get('tercero/?query=Id:' + (evaluador_id || 1))
      .subscribe(res => {
        if (Object.keys(res[0]).length > 0) {
          this.evaluador = <Tercero>res[0];
          this.tercerosService.get('datos_identificacion/?query=tercero_id:' + (evaluador_id || 1))
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

  loadSubTipoFormFields(produccionAcademica: ProduccionAcademicaPost, callback: Function) {
    this.formEvaluacionPar = JSON.parse(JSON.stringify(FORM_evaluacion_docente));
    this.formConstruido = false;
    let query;
    if (produccionAcademica.SubtipoProduccionId.TipoProduccionId.Id === 6 ||
      produccionAcademica.SubtipoProduccionId.TipoProduccionId.Id === 13 ||
      produccionAcademica.SubtipoProduccionId.TipoProduccionId.Id === 14
    )
      query = `query=nombre:${produccionAcademica.SubtipoProduccionId.Nombre}`;
    else if (produccionAcademica.SubtipoProduccionId.TipoProduccionId.Id === 8)
      query = `query=nombre:Libro de Texto`;
    else
      query = `query=nombre:${produccionAcademica.SubtipoProduccionId.TipoProduccionId.Nombre}`;

    query = this.prepararQuery(query);
    this.evaluacionDocenteService.get(`tipos-evaluacion?${query}`)
      .subscribe(res => {
        if (res !== null) {
          this.tipoEvaluacion = <TipoEvaluacion>res.Data[0];
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
          // if (callback !== undefined) {
          //   console.info('loadSubtipoFormField(call) - Campos: ', this.formProduccionAcademica.campos)
          //   console.info('loadSubtipoFormField(call) - Metadatos: ', this.info_produccion_academica.Metadatos)
          //   callback(
          //     this.formProduccionAcademica.campos,
          //     this.info_produccion_academica.Metadatos,
          //     this.nuxeoService,
          //     this.documentoService,
          //     this.link_data_drive,
          //   );
          // }
          this.construirForm();
          this.formConstruido = true;
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

  prepararQuery(query: string): string {
    let finalQuery;
    finalQuery = query.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    finalQuery = finalQuery.replaceAll(',', '');
    finalQuery = finalQuery.replaceAll(' ', '%20');
    finalQuery = finalQuery + '&populate=true';
    return finalQuery;
  }

  ngOnInit() {
  }


  createEvaluacionDocente(evlauacionPost: any): void {
    this.evaluacion_post = <EvaluacionDocentePost>evlauacionPost;
    this.evaluacion_post.tipo_evaluacion_id = this.tipoEvaluacion._id;
    this.evaluacion_post.nombre = `${this.solicitud_evaluacion_selected.SolicitudPadreId.ProduccionAcademica.Titulo}-${this.evaluador.NombreCompleto}`;
    this.evaluacion_post.descripcion = 'Evaluación docente';
    this.evaluacion_post.estructura_evaluacion = { ciudad: this.evaluacion_post.ciudad };
    this.evaluacion_post.estado = <EstadoTipoSolicitud>this.estadosSolicitudes[0];
    this.evaluacion_post.resultado = { resultado: this.resultado_evaluacion };
    this.evaluacionDocenteService.post('evaluaciones', this.evaluacion_post)
      .subscribe((res: any) => {
        if (res.Type === 'error') {
          Swal({
            type: 'error',
            title: res.Code,
            text: this.translate.instant('ERROR.' + res.Code),
            confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
          });
          this.showToast('error', 'error', this.translate.instant('produccion_academica.produccion_no_creada'));
        } else {
          this.evaluacion_post = <EvaluacionDocentePost>res.Data;
          const referencia = JSON.parse(this.solicitud_evaluacion_selected.Referencia);
          this.solicitud_evaluacion_selected.Referencia =
            `{\"Nombre\": \"${referencia.Nombre}\", \"Correo\": \"${referencia.Correo}\", \"IdEvaluacion\": \"${this.evaluacion_post._id}\", \"IdDocumento\": ${this.id_documento}, \"UrlDocumento\": \"${this.url_documento}\"}`;
          this.updateSolicitudDocente(this.solicitud_evaluacion_selected);
        }
      });
  }

  updateSolicitudDocente(solicitudDocente: any): void {
    this.solicitud_evaluacion_selected = <SolicitudDocentePost>solicitudDocente;
    this.solicitud_evaluacion_selected.EstadoTipoSolicitudId = <EstadoTipoSolicitud>this.estadosSolicitudes[0];
    this.solicitud_evaluacion_selected.TerceroId = this.evaluador_id_selected || 3;
    this.solicitud_evaluacion_selected.Resultado = `{ \"Puntaje\": ${this.resultado_evaluacion} }`;
    this.solicitud_evaluacion_selected.Observaciones = [];
    this.sgaMidService.post('solicitud_docente/' + this.solicitud_evaluacion_selected.Id, this.solicitud_evaluacion_selected)
      .subscribe((resp: any) => {
        if (resp.Type === 'error') {
          Swal({
            type: 'error',
            title: resp.Code,
            text: this.translate.instant('ERROR.' + resp.Code),
            confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
          });
        } else {
          this.solicitud_evaluacion_selected = <SolicitudDocentePost>resp;
          Swal({
            title: `Éxito al Enviar Observación.`,
            text: 'Información Modificada correctamente',
          });
          this.resultado_evaluacion = 0;
          this.evaluacion_post.ciudad = '';
          this.eventChange.emit(this.solicitud_evaluacion_selected);
        }
      });
  }

  validarForm(event) {
    if (event.valid) {
      if (this.evaluacion_post.ciudad === undefined || this.evaluacion_post.ciudad === '') {
        Swal({
          type: 'warning',
          title: 'ERROR',
          text: this.translate.instant('evaluacion.alerta_llenar_campos_evaluador'),
          confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
        });
      } else {
        const promises = [];
        const respuestas = [];
        const filesToUpload = [];
        if (event.data.EvaluacionDocentePost) {
          const tempRestpuestas = event.data.EvaluacionDocentePost;
          const keys = Object.keys(tempRestpuestas);
          this.getResultado(tempRestpuestas, keys);
          keys.forEach(key => {
            if (tempRestpuestas[key] !== undefined) {
              if (tempRestpuestas[key].nombre) {
                if (tempRestpuestas[key].file !== undefined) {
                  filesToUpload.push(tempRestpuestas[key]);
                }
              } else {
                respuestas.push({
                  fecha_presentacion: (new Date()).toISOString(),
                  respuestas: [
                    {
                      item_id: key,
                      respuesta: tempRestpuestas[key],
                    },
                  ],
                });
              }
            }
          });
        } else {
          this.evaluacion_post.respuestas_por_fecha = [];
        }
        let opt;
        if (this.evaluacion_post_selected === undefined) {
          opt = {
            title: this.translate.instant('GLOBAL.registrar'),
            text: this.translate.instant('evaluacion.seguro_continuar_registrar_evaluacion'),
            icon: 'warning',
            buttons: true,
            dangerMode: true,
            showCancelButton: true,
          };
        } else {
          opt = {
            title: this.translate.instant('GLOBAL.actualizar'),
            text: this.translate.instant('evaluacion.seguro_continuar_actualizar_evaluacion'),
            icon: 'warning',
            buttons: true,
            dangerMode: true,
            showCancelButton: true,
          };
        }
        Swal(opt)
          .then((willCreate) => {
            if (willCreate.value) {
              Swal({
                title: 'Espere',
                text: 'Enviando Información',
                allowOutsideClick: false,
              });
              Swal.showLoading();
              if (filesToUpload.length > 0) {
                promises.push(this.uploadFilesToMetadaData(filesToUpload, respuestas));
              }
              promises.push(this.loadEstadoSolicitud(13));
              promises.push(this.downloadAsPDF());
              this.evaluacion_post.respuestas_por_fecha = respuestas;
              Promise.all(promises)
                .then(() => {
                  if (this.evaluacion_post_selected === undefined)
                    this.createEvaluacionDocente(this.evaluacion_post);
                  // } else {
                  //   this.updateEvaluacionDocente(this.info_produccion_academica);
                  // }
                })
                .catch(error => {
                  Swal({
                    type: 'error',
                    title: 'ERROR',
                    text: this.translate.instant('ERROR.error_subir_documento'),
                    confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
                  });
                });
            }
          });
      }
    } else {
      Swal({
        type: 'warning',
        title: 'ERROR',
        text: this.translate.instant('evaluacion.alerta_llenar_campos'),
        confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
      });
    }
  }

  getResultado(respuestas: any, idRespuestas: string[]) {
    this.formEvaluacionPar.secciones.forEach(seccion => {
      seccion.campos.forEach(item => {
        if (this.orden_result_id.includes(item.orden)) {
          idRespuestas.forEach(key => {
            if (key === item.nombre)
              this.resultado_evaluacion = respuestas[key];
          });
        }
      });
    });
  }

  public downloadAsPDF() {
    const filesToUpload = [];
    return new Promise((resolve, reject) => {
      let docDefinition;
      html2canvas(this.formPdf.nativeElement)
      .then(canvas => {
        if (this.solicitud_evaluacion_selected.SolicitudPadreId.ProduccionAcademica.SubtipoProduccionId.TipoProduccionId.Id === 10 ||
            this.solicitud_evaluacion_selected.SolicitudPadreId.ProduccionAcademica.SubtipoProduccionId.TipoProduccionId.Id === 12
          ) {
          docDefinition = {
            content: [
              {
                image: canvas.toDataURL('image/png'),
                width: 550,
                height: 1608,
              },
              {
                image: canvas.toDataURL('image/png'),
                width: 550,
                height: 1600,
                absolutePosition: {x: 40, y: -795},
                pageBreak: 'before',
              },
            ],
          };
        } else {
          docDefinition = {
            content: [
              {
                image: canvas.toDataURL('image/png'),
                width: 550,
                height: 790,
              },
            ],
          };
        }
        const pdfDoc = pdfMake.createPdf(docDefinition);
        pdfDoc.download();
        pdfDoc.getBlob((blob) => {
          const file = {
            IdDocumento: 15,
            file: blob,
            nombre: this.solicitud_evaluacion_selected.Id,
          }
          filesToUpload.push(file);
          this.uploadFilesToMetadaData(filesToUpload, [])
          .then(() => resolve(true))
          .catch(error => reject(error));
        });
      });
    });
  }

  uploadFilesToMetadaData(files, respuestas) {
    const filesToGet = [];
    return new Promise((resolve, reject) => {
      files.forEach((file) => {
        file.Id = file.nombre,
          file.nombre = 'soporte_' + file.Id + '_prod_' + this.evaluador_id_selected;
        file.key = file.Id;
      });
      this.nuxeoService.getDocumentos$(files, this.documentoService)
        .subscribe(response => {
          if (Object.keys(response).length === files.length) {

            filesToGet.push({ Id: response[this.solicitud_evaluacion_selected.Id].Id, key: this.solicitud_evaluacion_selected.Id });
            this.nuxeoService.getDocumentoById$(filesToGet, this.documentoService)
            .subscribe(resp => {
              const filesResponse = <any>resp;
              if (Object.keys(filesResponse).length === filesToGet.length) {
                this.id_documento = response[this.solicitud_evaluacion_selected.Id].Id;
                this.url_documento = filesResponse[this.solicitud_evaluacion_selected.Id];
                resolve(true);
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
        }, error => {
          reject(error);
        });
    });
  }

  validInput() {
    if (this.evaluacion_post.ciudad)
      return false;
    return true;
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
