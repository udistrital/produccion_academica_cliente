import { TipoProduccionAcademica } from './../../../@core/data/models/produccion_academica/tipo_produccion_academica';
import { NuxeoService } from '../../../@core/utils/nuxeo.service';
import { DocumentoService } from '../../../@core/data/documento.service';
import { EstadoAutorProduccion } from './../../../@core/data/models/produccion_academica/estado_autor_produccion';
import { SubTipoProduccionAcademica } from './../../../@core/data/models/produccion_academica/subtipo_produccion_academica';
import { UserService } from '../../../@core/data/users.service';
import { TercerosService } from '../../../@core/data/terceros.service';
import { ProduccionAcademicaPost } from './../../../@core/data/models/produccion_academica/produccion_academica';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ProduccionAcademicaService } from '../../../@core/data/produccion_academica.service';
import { SgaMidService } from '../../../@core/data/sga_mid.service';
import { FORM_produccion_academica } from './form-produccion_academica';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

import Swal from 'sweetalert2';
import 'style-loader!angular2-toaster/toaster.css';
import { HttpErrorResponse } from '@angular/common/http';
import { MetadatoSubtipoProduccion } from '../../../@core/data/models/produccion_academica/metadato_subtipo_produccion';
import { Tercero } from '../../../@core/data/models/terceros/tercero';
import { LocalDataSource } from 'ng2-smart-table';

@Component({
  selector: 'ngx-crud-produccion-academica',
  templateUrl: './crud-produccion_academica.component.html',
  styleUrls: ['./crud-produccion_academica.component.scss'],
})
export class CrudProduccionAcademicaComponent implements OnInit {
  config: ToasterConfig;
  produccion_academica_selected: ProduccionAcademicaPost;
  tipoProduccionAcademica: TipoProduccionAcademica;
  SubtipoProduccionId: SubTipoProduccionAcademica;

  @Input('produccion_academica_selected')
  set name(produccion_academica_selected: ProduccionAcademicaPost) {
    this.produccion_academica_selected = produccion_academica_selected;
    this.loadProduccionAcademica();
  }

  @Output() eventChange = new EventEmitter();

  title_tipo_produccion: string;
  date_tipo_produccion: string;
  info_produccion_academica: ProduccionAcademicaPost;
  tiposProduccionAcademica: Array<TipoProduccionAcademica>;
  estadosAutor: Array<EstadoAutorProduccion>;
  subtiposProduccionAcademica: Array<SubTipoProduccionAcademica>;
  subtiposProduccionAcademicaFiltrados: Array<SubTipoProduccionAcademica>;
  personas: Array<Tercero>;
  source_authors: Array<any> = [];
  userData: Tercero;
  userNum: string;
  autorSeleccionado: Tercero;
  formProduccionAcademica: any;
  regProduccionAcademica: any;
  clean: boolean;
  formConstruido: boolean;
  creandoAutor: boolean;
  editando: boolean;
  settings_authors: any;
  DatosAdicionales: any;
  source: LocalDataSource = new LocalDataSource();
  Metadatos: any[];

  constructor(private translate: TranslateService,
    private produccionAcademicaService: ProduccionAcademicaService,
    private user: UserService,
    private nuxeoService: NuxeoService,
    private documentoService: DocumentoService,
    private tercerosService: TercerosService,
    private toasterService: ToasterService,
    private sgaMidService: SgaMidService,
  ) {
    this.formProduccionAcademica = JSON.parse(JSON.stringify(FORM_produccion_academica));
    this.construirForm();
    this.loadOptions();
    this.loadTableSettings();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.construirForm();
      this.loadTableSettings();
    });
  }

  loadTableSettings() {
    this.settings_authors = {
      actions: {
        edit: false,
        delete: false,
        add: false,
      },
      columns: {
        Nombre: {
          title: this.translate.instant('produccion_academica.nombre_autor'),
          valuePrepareFunction: (value) => {
            return value;
          },
          width: '60%',
          filter: false,
        },
        PersonaNum: {
          title: this.translate.instant('produccion_academica.numero_autor'),
          valuePrepareFunction: (value) => {
            return this.userNum;
          },
          width: '30%',
          filter: false,
        },
      },
    };
  }

  construirForm() {
    this.formProduccionAcademica.titulo = this.translate.instant('produccion_academica.produccion_academica');
    this.formProduccionAcademica.btn = this.translate.instant('GLOBAL.guardar');
    for (let i = 0; i < this.formProduccionAcademica.campos.length; i++) {
      this.formProduccionAcademica.campos[i].label = this.translate.instant('produccion_academica.labels.' + this.formProduccionAcademica.campos[i].label_i18n);
      this.formProduccionAcademica.campos[i].placeholder =
        this.translate.instant('produccion_academica.placeholders.' + this.formProduccionAcademica.campos[i].placeholder_i18n);
    }
  }

  useLanguage(language: string) {
    this.translate.use(language);
  }

  loadOptions(): void {
    this.loadEstadosAutor()
    .then(() => {
      Promise.all([
        this.loadOptionsTipoProduccionAcademica(),
        this.loadOptionsSubTipoProduccionAcademica(),
        this.loadUserData(),
      ]).
        then(() => { })
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
            this.tercerosService.get('datos_identificacion/?query=tercero_id:' + (this.user.getPersonaId() || 1))
            .subscribe(res => {
              this.userNum = res[0].Numero;
              this.userData['Nombre'] = this.userData.NombreCompleto;
              this.autorSeleccionado = JSON.parse(JSON.stringify(this.userData));
              this.agregarAutor(false, 1);
              this.autorSeleccionado = undefined;
              resolve(true);
            })
          } else {
            this.tiposProduccionAcademica = [];
            reject({status: 404});
          }
        }, (error: HttpErrorResponse) => {
          reject(error);
        });
    });
  }

  loadEstadosAutor(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.produccionAcademicaService.get('estado_autor_produccion/?limit=0')
        .subscribe(res => {
          // if (res !== null) {
          if (Object.keys(res[0]).length > 0) {
            this.estadosAutor = <Array<EstadoAutorProduccion>>res;
            resolve(true);
          } else {
            this.estadosAutor = [];
            reject({status: 404});
          }
        }, (error: HttpErrorResponse) => {
          reject(error);
        });
    });
  }

  loadOptionsTipoProduccionAcademica(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.produccionAcademicaService.get('tipo_produccion/?limit=0')
        .subscribe(res => {
          // if (res !== null) {
          if (Object.keys(res[0]).length > 0) {
            this.tiposProduccionAcademica = <Array<TipoProduccionAcademica>>res;
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

  loadOptionsSubTipoProduccionAcademica(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.produccionAcademicaService.get('subtipo_produccion/?limit=0')
        .subscribe (res => {
          if (res !== null) {
            this.subtiposProduccionAcademica = <Array<SubTipoProduccionAcademica>>res;
            resolve(true);
          } else {
            this.subtiposProduccionAcademica = [];
            reject({status: 404});
          }
        }, (error: HttpErrorResponse) => {
          reject(error);
        });
    });
  }

  filterSubTypes(tipoProduccionAcademica: TipoProduccionAcademica) {
    this.SubtipoProduccionId = undefined;
    this.formConstruido = false;
    this.subtiposProduccionAcademicaFiltrados = this.subtiposProduccionAcademica.filter(subTipo => subTipo.TipoProduccionId.Id === tipoProduccionAcademica.Id);
    this.filterTitleProduction(tipoProduccionAcademica);
    this.filterDateProduccion(tipoProduccionAcademica);
  }

  filterTitleProduction (tipoProduccionAcademica: TipoProduccionAcademica) {
    switch (tipoProduccionAcademica.Nombre) {
      case 'Cambio Categoria': { this.title_tipo_produccion = "titulo_trabajo_inedito"; break; }
      case 'Titulo Postgrado': { this.title_tipo_produccion = "titulo_obtenido"; break; }
      case 'Articulo':
      case 'Editorial':
      case 'Articulo Corto':
      case 'Traducción de Articulos':
      case 'Publicación Impresa': { this.title_tipo_produccion = "titulo_articulo"; break; }
      case 'Libro':
      case 'Capitulo Libro':
      case 'Traducción de Libro': { this.title_tipo_produccion = "titulo_libro"; break; }
      case 'Premios': { this.title_tipo_produccion = "titulo_premio"; break; }
      case 'Premios': { this.title_tipo_produccion = "titulo_premio"; break; }
      case 'Patente': { this.title_tipo_produccion = "titulo_patente"; break; }
      case 'Software': { this.title_tipo_produccion = "titulo_software"; break; }
      case 'Obras Artisticas': { this.title_tipo_produccion = "titulo_obra"; break; }
      case 'Ponencias': { this.title_tipo_produccion = "titulo_ponencia"; break; }
      case 'Reseña Critica': { this.title_tipo_produccion = "titulo_resena"; break; }
      case 'Estudios Postdoctorales': { this.title_tipo_produccion = "titulo_postdoctorado"; break; }
      case 'Direccion de Tesis': { this.title_tipo_produccion = "titulo_trabajo_grado"; break; }
      default: { this.title_tipo_produccion = "titulo_produccion_academica"; break; }
    }
  }

  filterDateProduccion (tipoProduccionAcademica: TipoProduccionAcademica) {
    switch (tipoProduccionAcademica.Nombre) {
      case 'Titulo Postgrado':
      case 'Premios':
      case 'Estudios Postdoctorales': { this.date_tipo_produccion = "fecha_obtencion"; break; }
      case 'Ponencias': { this.date_tipo_produccion = "fecha_realizacion"; break; }
      case 'Direccion de Tesis': { this.date_tipo_produccion = "fecha_graduacion"; break; }
      case 'Cambio Categoria': { this.date_tipo_produccion = "no_fecha"; break; }
      default: { this.date_tipo_produccion = "fecha_publicacion"; break; }
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

  updateProduccionAcademica(ProduccionAcademica: any): void {
    const opt: any = {
      title: this.translate.instant('GLOBAL.actualizar'),
      text: this.translate.instant('produccion_academica.seguro_continuar_actualizar_produccion'),
      icon: 'warning',
      buttons: true,
      dangerMode: true,
      showCancelButton: true,
    };
    Swal(opt)
    .then((willDelete) => {
      if (willDelete.value) {
        this.info_produccion_academica = <ProduccionAcademicaPost>ProduccionAcademica;
        this.sgaMidService.put('produccion_academica/' + this.info_produccion_academica.Id, this.info_produccion_academica)
        .subscribe((res: any) => {
          if (res.Type === 'error') {
            Swal({
              type: 'error',
              title: res.Code,
              text: this.translate.instant('ERROR.' + res.Code),
              confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
            });
            this.showToast('error', 'Error', this.translate.instant('produccion_academica.produccion_no_actualizada'));
          } else {
            this.info_produccion_academica = <ProduccionAcademicaPost>res.Body[1];
            this.eventChange.emit(true);
            this.showToast('success', this.translate.instant('GLOBAL.actualizar'), this.translate.instant('produccion_academica.produccion_actualizada'));
          }
        });
      }
    });
  }

  createProduccionAcademica(ProduccionAcademica: any): void {
    this.info_produccion_academica = <ProduccionAcademicaPost>ProduccionAcademica;
    console.log('Produccion Academica', this.info_produccion_academica);
    this.sgaMidService.post('produccion_academica', this.info_produccion_academica)
    .subscribe((res: any) => {
      console.log(res);
      if (res.Type === 'error') {
        Swal({
          type: 'error',
            title: res.Code,
          text: this.translate.instant('ERROR.' + res.Code),
          confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
        });
        this.showToast('error', 'error', this.translate.instant('produccion_academica.produccion_no_creada'));
      } else {
        this.info_produccion_academica = <ProduccionAcademicaPost>res;
        this.eventChange.emit(true);
        this.showToast('success', this.translate.instant('GLOBAL.crear'), this.translate.instant('produccion_academica.produccion_creada'));
      }
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
      console.log(this.source_authors)
      console.log(this.source)
    }
  }

  ngOnInit() {
    this.loadProduccionAcademica();
  }

  onDeleteAuthor(event): void {
    if (event.data.PuedeBorrar) {
      this.source_authors.splice(this.source_authors.indexOf(event.data), this.source_authors.indexOf(event.data));
      this.source.load(this.source_authors);
    } else {
      Swal({
        type: 'error',
        title: 'ERROR',
        text: this.translate.instant('produccion_academica.error_autor_borrar'),
        confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
      });
    }
  }

  uploadFilesToMetadaData(files, metadatos) {
    return new Promise((resolve, reject) => {
      files.forEach((file) => {
        file.Id = file.nombre,
        file.nombre = 'soporte_' + file.Id + '_prod_' + this.userData.Id;
        file.key = file.Id;
      });
      this.nuxeoService.getDocumentos$(files, this.documentoService)
        .subscribe(response => {
          console.log('respuesta nuxeo: ', response);
          if (Object.keys(response).length === files.length) {
            files.forEach((file) => {
              metadatos.push({
                MetadatoSubtipoProduccionId: file.Id,
                Valor: response[file.Id].Id + '', // Se castea el valor del string
              });
            });
            console.log(metadatos);
            resolve(true);
          }
        }, error => {
          reject(error);
        });
    });
  }

  validarForm(event) {
    if (event.valid) {
      if (this.info_produccion_academica.Titulo === undefined ||
      this.info_produccion_academica.Fecha === undefined ) {
        Swal({
          type: 'warning',
          title: 'ERROR',
          text: this.translate.instant('produccion_academica.alerta_llenar_campos_datos_basicos'),
          confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
        });
      } else {
        const promises = [];
        const metadatos = [];
        const filesToUpload = [];
        if (event.data.ProduccionAcademica) {
          console.log(event.data.ProduccionAcademica);

          const tempMetadatos = event.data.ProduccionAcademica;
          const keys = Object.keys(tempMetadatos);
          for (let i = 0; i < keys.length; i++) {
            if (tempMetadatos[keys[i]].nombre) {
              if (tempMetadatos[keys[i]].file !== undefined) {
                filesToUpload.push(tempMetadatos[keys[i]]);
              }
            } else {
              metadatos.push({
                MetadatoSubtipoProduccionId: parseInt(keys[i], 10),
                Valor: tempMetadatos[keys[i]],
              });
            }
          }
          console.log(filesToUpload)
          console.log(metadatos)
        } else {
          this.info_produccion_academica.Metadatos = [];
        }
        const opt: any = {
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
            console.log("paso");

            if (filesToUpload.length > 0) {
              promises.push(this.uploadFilesToMetadaData(filesToUpload, metadatos));
            }
            this.info_produccion_academica.Metadatos = metadatos;
            this.info_produccion_academica.Autores = JSON.parse(JSON.stringify(this.source_authors));

            Promise.all(promises)
            .then(() => {
              if ( this.produccion_academica_selected === undefined ) {
                this.createProduccionAcademica(this.info_produccion_academica);
              } else {
                this.updateProduccionAcademica(this.info_produccion_academica);
              }
            })
            .catch(error => {
              // console.log("error subiendo archivos", error);
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
        text: this.translate.instant('produccion_academica.alerta_llenar_campos'),
        confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
      });
    }
  }

  onCreateAuthor(event): void {
    if (!this.editando) {
      this.creandoAutor = !this.creandoAutor;
    } else {
      Swal({
        type: 'error',
        title: 'ERROR',
        text: this.translate.instant('produccion_academica.error_no_puede_editar_autores'),
        confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
      });
    }
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
