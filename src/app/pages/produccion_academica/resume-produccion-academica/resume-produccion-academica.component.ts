import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ProduccionAcademicaService } from '../../../@core/data/produccion_academica.service';
import { TercerosService } from '../../../@core/data/terceros.service';
import { TranslateService } from '@ngx-translate/core';
import { SolicitudDocentePost } from '../../../@core/data/models/solicitud_docente/solicitud_docente';
import { ProduccionAcademicaPost } from '../../../@core/data/models/produccion_academica/produccion_academica';
import { MetadatoSubtipoProduccion } from '../../../@core/data/models/produccion_academica/metadato_subtipo_produccion';
import { SubTipoProduccionAcademica } from '../../../@core/data/models/produccion_academica/subtipo_produccion_academica';
import { Tercero } from '../../../@core/data/models/terceros/tercero';
import { FORM_produccion_academica } from './form-produccion_academica';
import Swal from 'sweetalert2';
import { NuxeoService } from '../../../@core/utils/nuxeo.service';
import { DocumentoService } from '../../../@core/data/documento.service';
@Component({
  selector: 'ngx-resume-produccion-academica',
  templateUrl: './resume-produccion-academica.component.html',
  styleUrls: ['./resume-produccion-academica.component.scss']
})
export class ResumeProduccionAcademicaComponent implements OnInit {
  @Input('evaluacion_selected')
  set evaluacion(evaluacion_selected: SolicitudDocentePost) {
    this.evaluacion_selected = evaluacion_selected;
    console.info(this.evaluacion_selected)
    this.loadProduccionAcademica();
  }

  @Output() eventChange = new EventEmitter<number>();

  evaluacion_selected: SolicitudDocentePost;
  info_solicitud: SolicitudDocentePost;
  info_produccion_academica: ProduccionAcademicaPost;
  formProduccionAcademica: any;
  userData: Tercero;
  Metadatos: any[];
  clean: boolean;

  constructor(
    private produccionAcademicaService: ProduccionAcademicaService,
    private nuxeoService: NuxeoService,
    private documentoService: DocumentoService,
    private translate: TranslateService,
    private tercerosService: TercerosService,
  ) {
    this.formProduccionAcademica = JSON.parse(JSON.stringify(FORM_produccion_academica));
  }

  ngOnInit() {
  }

  public loadProduccionAcademica(): void {
    if (this.evaluacion_selected !== undefined) {
      this.info_solicitud = this.evaluacion_selected.SolicitudPadreId;
      this.info_produccion_academica = this.info_solicitud.ProduccionAcademica;
      console.info(this.evaluacion_selected)
      this.getTerceroData(this.info_produccion_academica.Autores[0].Persona);
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

  getTerceroData(terceroId) {
    this.tercerosService.get('tercero/?query=Id:' + terceroId)
      .subscribe(res => {
        if (Object.keys(res[0]).length > 0) {
          this.userData = <Tercero>res[0];
          this.info_produccion_academica.Autores[0].Nombre = this.userData.NombreCompleto;
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


}
