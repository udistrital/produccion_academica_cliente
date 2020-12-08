import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ProduccionAcademicaPost } from './../../../@core/data/models/produccion_academica/produccion_academica';
import { LocalDataSource } from 'ng2-smart-table';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { SubTipoProduccionAcademica } from './../../../@core/data/models/produccion_academica/subtipo_produccion_academica';
import { FORM_produccion_academica } from './form-produccion_academica';
import { ProduccionAcademicaService } from '../../../@core/data/produccion_academica.service';
import { MetadatoSubtipoProduccion } from '../../../@core/data/models/produccion_academica/metadato_subtipo_produccion';
import { NuxeoService } from '../../../@core/utils/nuxeo.service';
import { DocumentoService } from '../../../@core/data/documento.service';
import { TranslateService } from '@ngx-translate/core';
import { TercerosService } from '../../../@core/data/terceros.service';
import { Tercero } from '../../../@core/data/models/terceros/tercero';
import { TipoProduccionAcademica } from './../../../@core/data/models/produccion_academica/tipo_produccion_academica';
import { EstadoAutorProduccion } from './../../../@core/data/models/produccion_academica/estado_autor_produccion';
import { UserService } from '../../../@core/data/users.service';
import { SolicitudDocentePost } from '../../../@core/data/models/solicitud_docente/solicitud_docente';

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
  editando: boolean;
  clean: boolean;
  formProduccionAcademica: any;
  userData: Tercero;
  autorSeleccionado: Tercero;
  tiposProduccionAcademica: Array<TipoProduccionAcademica>;
  estadosAutor: Array<EstadoAutorProduccion>;
  creandoAutor: boolean;

  @Input('solicitud_docente_selected')
  set solicitud(solicitud_docente_selected: SolicitudDocentePost) {
    this.solicitud_docente_selected = solicitud_docente_selected;
    this.loadProduccionAcademica();
    this.setButtonOptions();
  }

  @Output()
  solicitudOut = new EventEmitter<any>();

  @Output() eventChange = new EventEmitter();

  constructor(
    private produccionAcademicaService: ProduccionAcademicaService,
    private nuxeoService: NuxeoService,
    private documentoService: DocumentoService,
    private translate: TranslateService,
    private tercerosService: TercerosService,
    private user: UserService,
    ) {
    this.rol = (JSON.parse(atob(localStorage
      .getItem('id_token')
      .split('.')[1])).role)
      .filter((data: any) => (data.indexOf('/') === -1))[0];
    this.formProduccionAcademica = JSON.parse(JSON.stringify(FORM_produccion_academica));
  }

  ngOnInit() { }

  public setButtonOptions() {
    if (this.rol !== 'DOCENTE') {
      this.buttonAdmin = true;
      this.buttonModify = true;
    } else {
      (this.solicitud_docente_selected.EstadoTipoSolicitudId.EstadoId.Id === 2) 
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
      this.editando = true;
    } else {
      this.info_produccion_academica = new ProduccionAcademicaPost();
      this.info_solicitud = new SolicitudDocentePost();
      this.clean = !this.clean;
      this.editando = false;
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
            <p">${this.solicitud_docente_selected.EvolucionEstado[this.solicitud_docente_selected.EvolucionEstado.length - 1]
              .EstadoTipoSolicitudId.EstadoId.Nombre}</p>
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

  reloadTable(event) {
    this.eventChange.emit(event);
  }
}
