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
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { TercerosService } from '../../../@core/data/terceros.service';
import { Tercero } from '../../../@core/data/models/terceros/tercero';
import { TipoProduccionAcademica } from './../../../@core/data/models/produccion_academica/tipo_produccion_academica';
import { EstadoAutorProduccion } from './../../../@core/data/models/produccion_academica/estado_autor_produccion';
import { UserService } from '../../../@core/data/users.service';

@Component({
  selector: 'ngx-review-produccion-academica',
  templateUrl: './review-produccion-academica.component.html',
  styleUrls: ['./review-produccion-academica.component.scss']
})
export class ReviewProduccionAcademicaComponent implements OnInit {

  produccion_academica_selected: ProduccionAcademicaPost;
  info_produccion_academica: ProduccionAcademicaPost;
  source_authors: Array<any> = [];
  source: LocalDataSource = new LocalDataSource();
  Metadatos: any[];
  formConstruido: boolean;
  editando: boolean;
  clean: boolean;
  formProduccionAcademica: any;
  userData: Tercero;
  autorSeleccionado: Tercero;
  tiposProduccionAcademica: Array<TipoProduccionAcademica>;
  estadosAutor: Array<EstadoAutorProduccion>;
  creandoAutor: boolean;

  @Input('produccion_academica_selected')
  set name(produccion_academica_selected: ProduccionAcademicaPost) {
    this.produccion_academica_selected = produccion_academica_selected;
    this.loadProduccionAcademica();
  }
  constructor(
    private produccionAcademicaService: ProduccionAcademicaService,
    private nuxeoService: NuxeoService,
    private documentoService: DocumentoService,
    private translate: TranslateService,
    private tercerosService: TercerosService,
    private user: UserService,
    ) {  
    this.formProduccionAcademica = JSON.parse(JSON.stringify(FORM_produccion_academica));
  }

  ngOnInit() {
  }

  public loadProduccionAcademica(): void {
    if (this.produccion_academica_selected !== undefined ) {
      /*
      this.produccionAcademicaService.get('produccion_academica/?query=id:' + this.produccion_academica_id)
        .subscribe(res => {
          if (res !== null) {
            this.info_produccion_academica = <ProduccionAcademicaPost>res[0];
          }
        });
      */
      this.info_produccion_academica = JSON.parse(JSON.stringify(this.produccion_academica_selected));
      this.source_authors = this.info_produccion_academica.Autores;
      this.source.load(this.source_authors);
      this.Metadatos = [];
      // this.formProduccionAcademica = JSON.parse(JSON.stringify(FORM_produccion_academica));
      const fillForm = function(campos, Metadatos, nuxeoService, documentoService){
        const filesToGet = [];
        campos.forEach(campo => {
          Metadatos.forEach( metadato => {
              // const field = JSON.parse(datoAdicional.DatoAdicionalSubtipoProduccion.TipoDatoAdicional.FormDefiniton);
              if (campo.nombre === metadato.MetadatoSubtipoProduccionId.Id) {
                campo.valor = metadato.Valor;
                if (campo.etiqueta === 'file') {
                  campo.idFile = parseInt(metadato.Valor, 10);
                  filesToGet.push({Id: campo.idFile, key: campo.nombre});
                }
              };
          });
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
      this.construirForm();
      this.formConstruido = true;
      this.editando = true;
    } else  {
      this.info_produccion_academica = new ProduccionAcademicaPost();
      this.clean = !this.clean;
      this.editando = false;
      this.formConstruido = false;
      this.loadUserData();
      this.Metadatos = [];
    }
  }

  loadSubTipoFormFields(subtipoProduccionAcademica: SubTipoProduccionAcademica, callback: Function) {
    this.formProduccionAcademica = JSON.parse(JSON.stringify(FORM_produccion_academica));
    this.construirForm();
    this.formConstruido = false;
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
              callback(this.formProduccionAcademica.campos, this.info_produccion_academica.Metadatos, this.nuxeoService, this.documentoService);
            }
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

  construirForm() {
    this.formProduccionAcademica.titulo = this.translate.instant('produccion_academica.produccion_academica');
    this.formProduccionAcademica.btn = this.translate.instant('GLOBAL.guardar');
    for (let i = 0; i < this.formProduccionAcademica.campos.length; i++) {
      this.formProduccionAcademica.campos[i].label = this.translate.instant('produccion_academica.' + this.formProduccionAcademica.campos[i].label_i18n);
      this.formProduccionAcademica.campos[i].placeholder =
        this.translate.instant('produccion_academica.placeholder_' + this.formProduccionAcademica.campos[i].label_i18n);
    }
  }

  loadUserData(): Promise<any> {
    this.source_authors = [];
    this.source.load(this.source_authors);
    return new Promise((resolve, reject) => {
        this.tercerosService.get('tercero/?query=Id:' + (this.user.getPersonaId() || 1))
        .subscribe(res => {
          // if (res !== null) {
          if (Object.keys(res[0]).length > 0) {
            this.userData = <Tercero>res[0];
            this.userData['PuedeBorrar'] = false;
            /*
            this.userData['EstadoAutorProduccion'] = {
              Id: 1,
              Nombre: 'Autor principal',
            };
            */
            this.userData['Nombre'] = this.userData.NombreCompleto;
            this.autorSeleccionado = JSON.parse(JSON.stringify(this.userData));
            this.agregarAutor(false, 1);
            // this.source_authors.push(this.userData);
            // this.source.load(this.source_authors);
            this.autorSeleccionado = undefined;
            resolve(true);
          } else {
            this.tiposProduccionAcademica = [];
            reject({status: 404});
          }
        }, (error: HttpErrorResponse) => {
          reject(error);
        });
    });
  }

  agregarAutor(mostrarError: boolean, estadoAutor: number): void {
    if (this.source_authors.find( author => author.PersonaId === this.autorSeleccionado.Id) ) {
      if (mostrarError) {
        Swal({
          type: 'error',
          title: 'ERROR',
          text: this.translate.instant('produccion_academica.error_autor_ya_existe'),
          confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
        });
      }
    } else {
      this.source_authors.push({
        // Nombre: this.getFullAuthorName(this.autorSeleccionado),
        Nombre: this.autorSeleccionado.NombreCompleto,
        PersonaId: this.autorSeleccionado.Id,
        // EstadoAutorProduccion: this.estadosAutor.filter(estado => estado.Id === 3)[0],
        EstadoAutorProduccionId: this.estadosAutor.filter(estado => estado.Id === estadoAutor)[0],
        // PuedeBorrar: true,
        PuedeBorrar: estadoAutor !== 1,
      });
      this.autorSeleccionado = undefined;
      this.creandoAutor = false;
      this.source.load(this.source_authors);
    }
  }

}
