import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import { LocalDataSource } from 'ng2-smart-table';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { NuxeoService } from '../../../@core/utils/nuxeo.service';
import { TercerosService } from '../../../@core/data/terceros.service';
import { UserService } from '../../../@core/data/users.service';
import { DocumentoService } from '../../../@core/data/documento.service';
import { SgaMidService } from '../../../@core/data/sga_mid.service';
import { GoogleService } from '../../../@core/data/google.service';
import { SolicitudDocenteService } from '../../../@core/data/solicitud-docente.service';
import { ProduccionAcademicaService } from '../../../@core/data/produccion_academica.service';
import { TipoProduccionAcademica } from './../../../@core/data/models/produccion_academica/tipo_produccion_academica';
import { CategoriaProduccion } from './../../../@core/data/models/produccion_academica/categoria_produccion';
import { EstadoAutorProduccion } from './../../../@core/data/models/produccion_academica/estado_autor_produccion';
import { SubTipoProduccionAcademica } from './../../../@core/data/models/produccion_academica/subtipo_produccion_academica';
import { ProduccionAcademicaPost } from './../../../@core/data/models/produccion_academica/produccion_academica';
import { MetadatoSubtipoProduccion } from '../../../@core/data/models/produccion_academica/metadato_subtipo_produccion';
import { Tercero } from '../../../@core/data/models/terceros/tercero';
import { InfoComplementariaTercero } from '../../../@core/data/models/terceros/info_complementaria_tercero';
import { InfoComplementaria } from '../../../@core/data/models/terceros/info_complementaria';
import { FORM_produccion_academica } from './form-produccion_academica';
import { SolicitudDocentePost } from '../../../@core/data/models/solicitud_docente/solicitud_docente';
import { EstadoTipoSolicitud } from '../../../@core/data/models/solicitud_docente/estado_tipo_solicitud';
import Swal from 'sweetalert2';
import 'style-loader!angular2-toaster/toaster.css';

@Component({
  selector: 'ngx-crud-produccion-academica',
  templateUrl: './crud-produccion_academica.component.html',
  styleUrls: ['./crud-produccion_academica.component.scss'],
})
export class CrudProduccionAcademicaComponent implements OnInit {
  @Input('solicitud_docente_selected')
  set solicitud(solicitud_docente_selected: SolicitudDocentePost) {
    this.solicitud_docente_selected = solicitud_docente_selected;
    this.file_from_terceros = [];
    this.isExistPoint = false;
    if (this.solicitud_docente_selected !== undefined) {
      if (this.solicitud_docente_selected.Resultado.length > 0 && this.rol !== 'DOCENTE') {
        this.isExistPoint = true;
        this.pointRequest = JSON.parse(this.solicitud_docente_selected.Resultado).Puntaje;
      }
    }
    this.loadEstadoSolicitud();
    this.loadProduccionAcademica();
  }

  @Input('estadoNum')
  set estado(estadoNum: string) {
    this.estadoNum = estadoNum;
  }

  @Output() eventChange = new EventEmitter<number>();

  config: ToasterConfig;
  solicitud_docente_selected: SolicitudDocentePost;
  tipoProduccionAcademica: TipoProduccionAcademica;
  SubtipoProduccionId: SubTipoProduccionAcademica;
  produccionAudiovisual: boolean;
  produccionSoftware: boolean;
  tipoArticulo: boolean;
  tipoCapitulo: boolean;
  tipoTitulo: boolean;
  isExistPoint: boolean;
  pointRequest: number;
  title_tipo_produccion: string;
  date_tipo_produccion: string;
  category_id: number;
  estadoNum: string;
  link_data_drive: string[] = [];
  id_data_drive: number[] = [];
  files_to_drive: any[] = [];
  file_from_terceros: any[] = [];
  filesToGet: any[] = [];
  info_solicitud: SolicitudDocentePost;
  info_produccion_academica: ProduccionAcademicaPost;
  estadosSolicitudes: Array<EstadoTipoSolicitud>;
  categoriasProduccion: Array<CategoriaProduccion>;
  tiposProduccionAcademica: Array<TipoProduccionAcademica>;
  tiposProduccionAcademicaFiltrados: Array<TipoProduccionAcademica>;
  estadosAutor: Array<EstadoAutorProduccion>;
  subtiposProduccionAcademica: Array<SubTipoProduccionAcademica>;
  subtiposProduccionAcademicaFiltrados: Array<SubTipoProduccionAcademica>;
  source_authors: Array<any> = [];
  userData: Tercero;
  userNum: string;
  rol: string;
  autorSeleccionado: Tercero;
  formProduccionAcademica: any;
  clean: boolean;
  formConstruido: boolean;
  creandoAutor: boolean;
  editando: boolean;
  settings_authors: any;
  source: LocalDataSource = new LocalDataSource();
  Metadatos: any[];
  titulos: InfoComplementariaTercero;
  archivo: any;
  idFile: any;
  nombreFile: any;
  nivel: any;
  fechaCategoria: any;
  categoria: any;

  constructor(public translate: TranslateService,
    private produccionAcademicaService: ProduccionAcademicaService,
    private solicitudDocenteService: SolicitudDocenteService,
    private route: ActivatedRoute,
    private user: UserService,
    private router: Router,
    private nuxeoService: NuxeoService,
    private documentoService: DocumentoService,
    private tercerosService: TercerosService,
    private toasterService: ToasterService,
    private sgaMidService: SgaMidService,
    private googleMidService: GoogleService,
  ) {
    this.rol = (JSON.parse(atob(localStorage
      .getItem('id_token')
      .split('.')[1])).role)
      .filter((data: any) => (data.indexOf('/') === -1))[0];
    this.formProduccionAcademica = JSON.parse(JSON.stringify(FORM_produccion_academica));
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
    this.formProduccionAcademica.campos.sort((campoA, campoB) => (campoA.orden > campoB.orden) ? 1 : -1);
  }

  useLanguage(language: string) {
    this.translate.use(language);
  }

  loadOptions(): void {
    this.loadEstadosAutor()
      .then(() => {
        Promise.all([
          this.loadOptionsCategoriasProduccion(),
          this.loadOptionsTipoProduccionAcademica(),
          this.loadOptionsSubTipoProduccionAcademica(),
          this.loadEstadoSolicitud(),
          this.loadUserData(),
        ]).
          then(() => {
            this.filterTypes();
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
      this.tercerosService.get('tercero/?query=Id:' + (this.user.getPersonaId()))
        .subscribe(res => {
          // if (res !== null) {
          if (Object.keys(res[0]).length > 0) {
            this.userData = <Tercero>res[0];
            this.userData['PuedeBorrar'] = false;
            this.tercerosService.get('datos_identificacion/?query=tercero_id:' + (this.user.getPersonaId()))
              .subscribe(resp => {
                this.userNum = resp[0].Numero;
                this.userData['Nombre'] = this.userData.NombreCompleto;
                this.autorSeleccionado = JSON.parse(JSON.stringify(this.userData));
                this.agregarAutor(false, 1);
                this.autorSeleccionado = undefined;
                resolve(true);
              })
          } else {
            this.tiposProduccionAcademica = [];
            reject({ status: 404 });
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
            reject({ status: 404 });
          }
        }, (error: HttpErrorResponse) => {
          reject(error);
        });
    });
  }

  loadEstadoSolicitud(): Promise<any> {
    return new Promise((resolve, reject) => {
      let endpoint: string;
      if (this.solicitud_docente_selected !== undefined && this.solicitud_docente_selected.EstadoTipoSolicitudId.EstadoId.Id === 4) {
        endpoint = 'estado_tipo_solicitud/?query=EstadoId:' + 4;
      } else {
        endpoint = 'estado_tipo_solicitud/?query=EstadoId:' + (this.estadoNum || 1)
      }
      this.solicitudDocenteService.get(endpoint)
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

  loadOptionsCategoriasProduccion(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.produccionAcademicaService.get('categoria_produccion/?limit=0')
        .subscribe(res => {
          // if (res !== null) {
          if (Object.keys(res[0]).length > 0) {
            this.categoriasProduccion = <Array<CategoriaProduccion>>res;
            resolve(true);
          } else {
            this.categoriasProduccion = [];
            reject({ status: 404 });
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
            reject({ status: 404 });
          }
        }, (error: HttpErrorResponse) => {
          reject(error);
        });
    });
  }

  loadOptionsSubTipoProduccionAcademica(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.produccionAcademicaService.get('subtipo_produccion/?limit=0')
        .subscribe(res => {
          if (res !== null) {
            this.subtiposProduccionAcademica = <Array<SubTipoProduccionAcademica>>res;
            resolve(true);
          } else {
            this.subtiposProduccionAcademica = [];
            reject({ status: 404 });
          }
        }, (error: HttpErrorResponse) => {
          reject(error);
        });
    });
  }

  filterTypes() {
    this.route.params.subscribe((params: Params) => {
      if (params.id) {
        const key = params.id;
        // tslint:disable-next-line: radix
        this.category_id = parseInt(key.charAt(1));
        if (key.charAt(0) === 'c') {
          this.tiposProduccionAcademicaFiltrados = this.tiposProduccionAcademica
            .filter(tipo => {
              const subTiposCategoria = this.subtiposProduccionAcademica
                .filter(subTipo => {
                  return subTipo.CategoriaProduccion.Id === parseInt(key.charAt(1), 10) && subTipo.TipoProduccionId.Id === tipo.Id
                })
              if (subTiposCategoria.length > 0) return true; else return false;
            });
        }
      } else {
        this.tiposProduccionAcademicaFiltrados = this.tiposProduccionAcademica;
      }
    });
  }

  filterSubTypes(tipoProduccionAcademica: TipoProduccionAcademica) {
    this.SubtipoProduccionId = undefined;
    this.formConstruido = false;
    this.addAdditionalItems();
    this.subtiposProduccionAcademicaFiltrados = this.subtiposProduccionAcademica
      .filter(subTipo => subTipo.TipoProduccionId.Id === tipoProduccionAcademica.Id && subTipo.CategoriaProduccion.Id === this.category_id);
    this.filterTitleProduction(tipoProduccionAcademica);
    this.filterDateProduccion(tipoProduccionAcademica);
  }

  addAdditionalItems() {
    this.tipoProduccionAcademica.Nombre === 'Video, Cinematografica o Fonográfia' ||
      this.tipoProduccionAcademica.Nombre === 'Obras Artisticas'
      ? this.produccionAudiovisual = true : this.produccionAudiovisual = false;

    this.tipoProduccionAcademica.Nombre === 'Software'
      ? this.produccionSoftware = true : this.produccionSoftware = false;

    this.tipoProduccionAcademica.Nombre === 'Articulo' ||
      this.tipoProduccionAcademica.Nombre === 'Editorial' ||
      this.tipoProduccionAcademica.Nombre === 'Articulo Corto' ||
      this.tipoProduccionAcademica.Nombre === 'Publicación Impresa'
      ? this.tipoArticulo = true : this.tipoArticulo = false;

    this.tipoProduccionAcademica.Nombre === 'Capitulo Libro' ? this.tipoCapitulo = true : this.tipoCapitulo = false;

    this.tipoProduccionAcademica.Nombre === 'Titulo Postgrado' ? this.tipoTitulo = true : this.tipoTitulo = false;
  }

  filterTitleProduction(tipoProduccionAcademica: TipoProduccionAcademica) {
    switch (tipoProduccionAcademica.Nombre) {
      case 'Cambio Categoria': { this.title_tipo_produccion = 'titulo_trabajo_inedito'; break; }
      case 'Titulo Postgrado': { this.title_tipo_produccion = 'titulo_obtenido'; break; }
      case 'Articulo':
      case 'Editorial':
      case 'Articulo Corto':
      case 'Traducción de Articulos':
      case 'Publicación Impresa': { this.title_tipo_produccion = 'titulo_articulo'; break; }
      case 'Libro':
      case 'Capitulo Libro':
      case 'Traducción de Libro': { this.title_tipo_produccion = 'titulo_libro'; break; }
      case 'Premios': { this.title_tipo_produccion = 'titulo_premio'; break; }
      case 'Premios': { this.title_tipo_produccion = 'titulo_premio'; break; }
      case 'Patente': { this.title_tipo_produccion = 'titulo_patente'; break; }
      case 'Software': { this.title_tipo_produccion = 'titulo_software'; break; }
      case 'Obras Artisticas': { this.title_tipo_produccion = 'titulo_obra'; break; }
      case 'Ponencias': { this.title_tipo_produccion = 'titulo_ponencia'; break; }
      case 'Reseña Critica': { this.title_tipo_produccion = 'titulo_resena'; break; }
      case 'Estudios Postdoctorales': { this.title_tipo_produccion = 'titulo_postdoctorado'; break; }
      case 'Direccion de Tesis': { this.title_tipo_produccion = 'titulo_trabajo_grado'; break; }
      default: { this.title_tipo_produccion = 'titulo_produccion_academica'; break; }
    }
  }

  filterDateProduccion(tipoProduccionAcademica: TipoProduccionAcademica) {
    switch (tipoProduccionAcademica.Nombre) {
      case 'Titulo Postgrado':
      case 'Premios':
      case 'Estudios Postdoctorales': { this.date_tipo_produccion = 'fecha_obtencion'; break; }
      case 'Ponencias': { this.date_tipo_produccion = 'fecha_realizacion'; break; }
      case 'Direccion de Tesis': { this.date_tipo_produccion = 'fecha_graduacion'; break; }
      case 'Cambio Categoria': { this.date_tipo_produccion = 'no_fecha'; break; }
      default: { this.date_tipo_produccion = 'fecha_publicacion'; break; }
    }
  }

  loadSubTipoFormFields(subtipoProduccionAcademica: SubTipoProduccionAcademica, callback: Function) {
    this.formProduccionAcademica = JSON.parse(JSON.stringify(FORM_produccion_academica));
    this.formConstruido = false;
    this.link_data_drive = [];
    this.id_data_drive = [];
    this.files_to_drive = [];
    const query = `query=SubtipoProduccionId:${subtipoProduccionAcademica.Id}`;
    this.produccionAcademicaService.get(`metadato_subtipo_produccion/?limit=0&${query}`)
      .subscribe(res => {
        if (res !== null) {
          (<Array<MetadatoSubtipoProduccion>>res).forEach(metadato => {
            if (Object.keys(metadato).length > 0) {
              const field = JSON.parse(metadato.TipoMetadatoId.FormDefinition);
              field.nombre = metadato.Id;
              field.orden = metadato.Orden;
              this.formProduccionAcademica.campos.push(field);
              if (metadato.TipoMetadatoId.FormDefinition === '{}') {
                this.id_data_drive.push(metadato.Id)
              }
            }
          });
          if (callback !== undefined) {
            callback(
              this.formProduccionAcademica.campos,
              this.info_produccion_academica.Metadatos,
              this.nuxeoService,
              this.documentoService,
              this.link_data_drive,
            );
          }
          this.construirForm();
          this.formConstruido = true;
          if (!this.editando) {
            if (this.tipoProduccionAcademica.Id === 1) {
              this.filesFromTerceros();
              this.loadDatosCambioCategoria();
            }
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

  public loadProduccionAcademica(): void {
    if (this.solicitud_docente_selected !== undefined) {
      this.loadEstadoSolicitud()
        .then(() => {
          this.info_produccion_academica = JSON.parse(JSON.stringify(this.solicitud_docente_selected.ProduccionAcademica));
          this.info_solicitud = JSON.parse(JSON.stringify(this.solicitud_docente_selected));
          (this.info_produccion_academica.SubtipoProduccionId.Id === 23)
            ? this.produccionSoftware = true : this.produccionSoftware = false;
          (this.info_produccion_academica.SubtipoProduccionId.Id === 24 ||
            this.info_produccion_academica.SubtipoProduccionId.Id === 25 ||
            this.info_produccion_academica.SubtipoProduccionId.Id === 26 ||
            this.info_produccion_academica.SubtipoProduccionId.Id === 27
          ) ? this.produccionAudiovisual = true : this.produccionAudiovisual = false;
          this.source_authors = this.info_solicitud.Solicitantes;
          this.source.load(this.source_authors);
          const tipoProduccion = this.tiposProduccionAcademica.filter(tipo =>
            tipo.Id === this.info_produccion_academica.SubtipoProduccionId.TipoProduccionId.Id)[0];
          this.filterTitleProduction(tipoProduccion)
          this.filterDateProduccion(tipoProduccion)
          this.Metadatos = [];
          const fillForm = function (campos, Metadatos, nuxeoService, documentoService, links) {
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
                    links.push(metadato.Valor);
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
          this.editando = true;
        })
    } else {
      this.info_produccion_academica = new ProduccionAcademicaPost();
      this.info_solicitud = new SolicitudDocentePost();
      this.clean = !this.clean;
      this.editando = false;
      this.formConstruido = false;
      this.loadUserData();
      this.Metadatos = [];
    }
  }

  updateProduccionAcademica(ProduccionAcademica: any): void {
    const promises = [];
    this.info_produccion_academica = <ProduccionAcademicaPost>ProduccionAcademica;
    this.info_solicitud.EstadoTipoSolicitudId = <EstadoTipoSolicitud>this.estadosSolicitudes[0];
    this.sgaMidService.post('produccion_academica/' + this.info_produccion_academica.Id, this.info_produccion_academica)
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
          this.info_produccion_academica = <ProduccionAcademicaPost>res;
          this.info_solicitud.TerceroId = this.user.getPersonaId() || 3;
          if (this.isExistPoint)
            this.info_solicitud.Resultado = `{ \"Puntaje\": ${this.pointRequest} }`
          this.sgaMidService.post('solicitud_docente/' + this.info_solicitud.Id, this.info_solicitud)
            .subscribe((resp: any) => {
              if (resp.Type === 'error') {
                Swal({
                  type: 'error',
                  title: resp.Code,
                  text: this.translate.instant('ERROR.' + resp.Code),
                  confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
                });
                this.showToast('error', 'Error', this.translate.instant('produccion_academica.produccion_no_actualizada'));
              } else {
                let metaProduccionId
                if (this.files_to_drive.length > 0) {
                  this.files_to_drive.forEach(file => {
                    this.info_solicitud.ProduccionAcademica.Metadatos.forEach(metadato => {
                      if (metadato.MetadatoSubtipoProduccionId.Id === file.Id)
                        metaProduccionId = metadato.Id
                    })
                    promises.push(this.uploadDriveFilesToMetaData(file.Id, file.File, this.info_produccion_academica.Id, metaProduccionId))
                  })
                }
                Swal({
                  title: `Éxito al modificar solicitud.`,
                  text: 'Información Modificada correctamente',
                });
                this.showToast('success', this.translate.instant('GLOBAL.actualizar'), this.translate.instant('produccion_academica.produccion_actualizada'));
                this.eventChange.emit(this.info_solicitud.Id);
                Promise.all(promises)
                  .then(() => {
                    this.showToast('success', this.translate.instant('GLOBAL.actualizar'), this.translate.instant('produccion_academica.exito_drive'));
                  })
                  .catch(error => {
                    this.showToast('error', 'error', this.translate.instant('produccion_academica.error_drive'));
                  });
              }
            });
        }
      });
  }

  createProduccionAcademica(ProduccionAcademica: any): void {
    const promises = [];
    this.info_produccion_academica = <ProduccionAcademicaPost>ProduccionAcademica;
    this.info_solicitud.EstadoTipoSolicitudId = <EstadoTipoSolicitud>this.estadosSolicitudes[0];
    this.sgaMidService.post('produccion_academica', this.info_produccion_academica)
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
          this.info_produccion_academica = <ProduccionAcademicaPost>res;
          this.info_solicitud.Referencia = `{ \"Id\": ${res.ProduccionAcademica.Id} }`
          this.info_solicitud.Autores = res.Autores;
          this.sgaMidService.post('solicitud_docente', this.info_solicitud)
            .subscribe((resp: any) => {
              if (resp.Type === 'error') {
                Swal({
                  type: 'error',
                  title: resp.Code,
                  text: this.translate.instant('ERROR.' + resp.Code),
                  confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
                });
                this.showToast('error', 'error', this.translate.instant('produccion_academica.produccion_no_creada'));
              } else {
                const info_solicitud_res = <SolicitudDocentePost>resp;
                this.info_solicitud.EvolucionEstado = resp.EvolucionesEstado;
                this.info_solicitud.Id = resp.Solicitud.Id;
                this.info_solicitud.TerceroId = this.user.getPersonaId() || 3;
                this.info_solicitud.ProduccionAcademica = this.info_produccion_academica;
                Swal({
                  title: `Éxito al cargar solicitud.`,
                  text: 'Información Guardada correctamente',
                });
                this.router.navigate(['./pages/produccion_academica/new-solicitud']);

                promises.push(this.generarAlertas(this.info_solicitud));
                if (this.files_to_drive.length > 0) {
                  this.files_to_drive.forEach(file => {
                    promises.push(this.uploadDriveFilesToMetaData(file.Id, file.File, res.ProduccionAcademica.Id, null))
                  })
                }

                Promise.all(promises)
                  .then(() => {
                    this.showToast('success', this.translate.instant('GLOBAL.actualizar'), this.translate.instant('produccion_academica.exito_drive'));
                  })
                  .catch(error => {
                    this.showToast('error', 'error', this.translate.instant('produccion_academica.error_drive'));
                  });
              }
            });
        }
      });
  }

  generarAlertas(info_solicitudPut: SolicitudDocentePost) {
    return new Promise((resolve, reject) => {
      this.sgaMidService.post(
        'solicitud_produccion/' + info_solicitudPut.TerceroId + '/' + this.tipoProduccionAcademica.Id,
        info_solicitudPut,
      )
        .subscribe((res: any) => {
          if (res !== null) {
            resolve(true);
          } else {
            reject({ status: 404 });
          }
        }, (error: HttpErrorResponse) => {
          reject(error);
        });
    });
  }

  agregarAutor(mostrarError: boolean, estadoAutor: number): void {
    if (this.source_authors.find(author => author.PersonaId === this.autorSeleccionado.Id)) {
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
        Nombre: this.autorSeleccionado.NombreCompleto,
        PersonaId: this.autorSeleccionado.Id,
        EstadoAutorProduccionId: this.estadosAutor.filter(estado => estado.Id === estadoAutor)[0],
        PuedeBorrar: estadoAutor !== 1,
      });
      this.autorSeleccionado = undefined;
      this.creandoAutor = false;
      this.source.load(this.source_authors);
    }
  }

  ngOnInit() {
    this.loadProduccionAcademica();
  }

  loadFilesTerceros() {
    return new Promise((resolve, reject) => {
      let i = 0, j = 0;
      this.tercerosService.get(
        'info_complementaria_tercero?query=TerceroId__Id:' +
        (this.user.getPersonaId()) +
        ',InfoCompleTerceroPadreId__isnull:true,InfoComplementariaId__GrupoInfoComplementariaId__Id:18&sortby=Id&order=asc&limit=0',
      )
        .subscribe(res => {
          (<Array<InfoComplementariaTercero>>res).forEach(info1 => {
            this.titulos = info1;
            this.tercerosService.get(
              'info_complementaria_tercero?query=InfoComplementariaId__GrupoInfoComplementariaId__Id:18,InfoCompleTerceroPadreId:' +
              (this.titulos.Id) + '&limit=0',
            )
              .subscribe(resp => {
                (<Array<InfoComplementariaTercero>>resp).forEach(info => {
                  if (info.InfoComplementariaId.Nombre === 'DOCUMENTO_ID') {
                    this.archivo = info;
                    const documento = JSON.parse(info.Dato);
                    this.idFile = parseInt(documento.DocumentoId, 10);
                    this.nombreFile = parseInt(documento.DocumentoNombre, 10);
                  }

                  if (info.InfoComplementariaId.Nombre === 'NIVEL_FORMACION') {
                    this.nivel = JSON.parse(info.Dato).NivelFormacion;
                  }

                  if (this.nivel !== null && this.nivel !== undefined) {
                    this.filesToGet.push({ Id: this.idFile, key: this.nombreFile, nivelFormacion: this.nivel, infoComplementaria: this.archivo })
                    this.nivel = null;
                  }
                  j++;
                  if (j === resp.length) {
                    i++
                    j = 0
                  }
                  if (i === res.length)
                    resolve(true);
                });
              }, (error: HttpErrorResponse) => {
                reject(error);
              });
          });
        }, (error: HttpErrorResponse) => {
          reject(error);
        });
    })
  }

  filesFromTerceros() {
    this.loadFilesTerceros()
      .then(() => {
        let i = 0
        if (this.filesToGet.length !== 0) {
          this.nuxeoService.getDocumentoById$(this.filesToGet, this.documentoService)
            .subscribe(response => {
              i++
              const filesResponse = <any>response;
              if (Object.keys(filesResponse).length > 0 && i === this.filesToGet.length) {
                this.filesToGet.forEach(file => {
                  let idActa;

                  if (this.info_produccion_academica.SubtipoProduccionId.Id === 1) {
                    if (file.nivelFormacion === 'Profesional')
                      idActa = 3;
                    if (file.nivelFormacion === 'Maestria')
                      idActa = 4;
                  }

                  if (this.info_produccion_academica.SubtipoProduccionId.Id === 2) {
                    if (file.nivelFormacion === 'Profesional')
                      idActa = 9;
                    if (file.nivelFormacion === 'Maestria')
                      idActa = 10;
                    if (file.nivelFormacion === 'postgrado')
                      idActa = 11;
                  }

                  if (this.info_produccion_academica.SubtipoProduccionId.Id === 3) {
                    if (file.nivelFormacion === 'Profesional')
                      idActa = 16;
                    if (file.nivelFormacion === 'Maestria')
                      idActa = 17;
                    if (file.nivelFormacion === 'postgrado')
                      idActa = 18;
                  }

                  this.formProduccionAcademica.campos.forEach(campo => {
                    if (campo.etiqueta === 'file' && campo.nombre === idActa) {
                      campo.url = filesResponse[file.key] + '';
                      campo.urlTemp = filesResponse[file.key] + '';
                      campo.valor = file.Id;
                    }
                  });

                  if (idActa !== undefined) {
                    var yaExiste = this.file_from_terceros.some(function (o) {
                      return o.MetadatoSubtipoProduccionId === idActa;
                    });
                    if (!yaExiste) {
                      this.file_from_terceros.push({
                        MetadatoSubtipoProduccionId: idActa,
                        Valor: file.Id + '', // Se castea el valor del string
                        infoComplementaria: file.infoComplementaria,
                      });
                    }
                  }
                });
                this.construirForm();
              }
            });
        }
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
      })
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
          if (Object.keys(response).length === files.length) {
            files.forEach((file) => {
              metadatos.push({
                MetadatoSubtipoProduccionId: file.Id,
                Valor: response[file.Id].Id + '', // Se castea el valor del string
              });
            });
            resolve(true);
          }
        }, error => {
          reject(error);
        });
    });
  }

  uploadDriveFilesToMetaData(idMetadato, file, idProduccion, idMetaProduccion) {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      let query;
      if (idMetaProduccion) {
        query = 'drive/' + idProduccion + '/' + idMetadato + '/' + idMetaProduccion
      } else {
        query = 'drive/' + idProduccion + '/' + idMetadato + '/' + 0
      }
      formData.append('archivo', file);
      this.googleMidService.post_file(query, formData)
        .subscribe((res: any) => {
          if (res) {
            resolve(true);
          }
        }, error => {
          reject(error);
        });
    });
  }

  loadDriveFiles(event, numId) {
    const file = event.target.files[0];
    if (this.files_to_drive[numId])
      this.files_to_drive.splice(numId, 1);
    if (numId === 0) {
      this.files_to_drive.unshift({
        Id: this.id_data_drive[numId],
        File: file,
        URL: URL.createObjectURL(event.srcElement.files[0]),
      });
    } else {
      this.files_to_drive.length === 0 && this.files_to_drive.push({})
      this.files_to_drive.push({
        Id: this.id_data_drive[numId],
        File: file,
        URL: URL.createObjectURL(event.srcElement.files[0]),
      });
    }
  }

  removeDriveFiles(numId) {
    const length = this.files_to_drive.length;
    if (this.files_to_drive[numId])
      this.files_to_drive.splice(numId, 1);
    (length > 1 && numId === 0) && this.files_to_drive.unshift({})
  }

  loadDatosCambioCategoria() {
    return new Promise((resolve, reject) => {
      this.sgaMidService.get('solicitud_docente/inactive/' + (this.user.getPersonaId()))
        .subscribe((res: any) => {
          if (res !== null && Object.keys(res[0]).length > 0) {
            const dataSolicitud = <Array<SolicitudDocentePost>>res;
            let i = 0;
            dataSolicitud.sort((solicitudA, solicitudB) => (solicitudA.Id > solicitudB.Id) ? -1 : 1)
            dataSolicitud.forEach(solicitud => {
              if (JSON.parse(solicitud.Referencia).Id !== undefined) {
                this.sgaMidService.get('produccion_academica/get_one/' + JSON.parse(solicitud.Referencia).Id)
                  .subscribe((resp: any) => {
                    if (this.categoria === undefined || this.fechaCategoria === undefined || this.categoria === ' ' || this.fechaCategoria === new Date()) {
                      if (resp !== null) {
                        if (Object.keys(resp[0]).length > 0 && resp.Type !== 'error') {
                          i++;
                          solicitud.ProduccionAcademica = <ProduccionAcademicaPost>resp[0];
                          if (solicitud.ProduccionAcademica.SubtipoProduccionId.Id === 1 ||
                            solicitud.ProduccionAcademica.SubtipoProduccionId.Id === 2 ||
                            solicitud.ProduccionAcademica.SubtipoProduccionId.Id === 3
                          ) {
                            if (solicitud.ProduccionAcademica.SubtipoProduccionId.Id === 1)
                              this.categoria = 'Asistente';
                            if (solicitud.ProduccionAcademica.SubtipoProduccionId.Id === 2)
                              this.categoria = 'Asociado';
                            if (solicitud.ProduccionAcademica.SubtipoProduccionId.Id === 3)
                              this.categoria = 'Titular';

                            this.fechaCategoria = new Date(solicitud.EvolucionEstado[solicitud.EvolucionEstado.length - 1].FechaModificacion);

                            this.formProduccionAcademica.campos.forEach(campo => {
                              if (campo.nombre === 14 || campo.nombre === 1 || campo.nombre === 7)
                                campo.valor = this.categoria;
                              if (campo.nombre === 15 || campo.nombre === 2 || campo.nombre === 8)
                                campo.valor = this.fechaCategoria;
                            });

                            this.info_produccion_academica.Fecha = new Date();
                            this.construirForm();
                            resolve(true);
                          } else {
                            this.categoria = ' ';
                            this.fechaCategoria = new Date();
                            this.formProduccionAcademica.campos.forEach(campo => {
                              if (campo.nombre === 14 || campo.nombre === 1 || campo.nombre === 7)
                                campo.valor = this.categoria;
                              if (campo.nombre === 15 || campo.nombre === 2 || campo.nombre === 8)
                                campo.valor = this.fechaCategoria;
                            });

                            this.info_produccion_academica.Fecha = new Date();
                          }

                        } else {
                          Swal({
                            type: 'error',
                            title: '404',
                            text: this.translate.instant('ERROR.404'),
                            confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
                          });
                        }
                      }
                    }
                    if (i === dataSolicitud.length)
                      this.construirForm();

                  }, (error: HttpErrorResponse) => {
                    reject({ status: 404 });
                    Swal({
                      type: 'error',
                      title: error.status + '',
                      text: this.translate.instant('ERROR.' + error.status),
                      confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
                    });
                  });
              }
            });
          } else {
            this.categoria = ' ';
            this.fechaCategoria = new Date();
            this.formProduccionAcademica.campos.forEach(campo => {
              if (campo.nombre === 14 || campo.nombre === 1 || campo.nombre === 7)
                campo.valor = this.categoria;
              if (campo.nombre === 15 || campo.nombre === 2 || campo.nombre === 8)
                campo.valor = this.fechaCategoria;
            });

            this.info_produccion_academica.Fecha = new Date();
            resolve(true);
          }
        }, (error: HttpErrorResponse) => {
          Swal({
            type: 'error',
            title: error.status + '',
            text: this.translate.instant('ERROR.' + error.status),
            confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
          });
        });
    });
  }

  actualizarDocumentosTerceros(metadatos) {
    return new Promise((resolve, reject) => {
      let i = 0;
      this.file_from_terceros.forEach(file => {
        if (metadatos.length > 0) {
          var yaExiste = metadatos.some(function (o) {
            return parseInt(o.MetadatoSubtipoProduccionId, 10) === parseInt(file.MetadatoSubtipoProduccionId, 10);
          });
          if (yaExiste) {
            /** si existe el metadato del documento en el listado quiere decir que el documento es nuevo
             por lo que solo se va actualizar la info complementaria del documento en terceros y
            este ya existe en los metadatos
            */
            let infoComplementaria;
            /** Actualizar ID del documento de la infocomplementaria correspontiente */
            metadatos.forEach(metadato => {
              if (metadato.MetadatoSubtipoProduccionId === file.MetadatoSubtipoProduccionId) {
                file.infoComplementaria.Dato = `{\"DocumentoId\":${metadato.Valor},\"DocumentoNombre\":${metadato.MetadatoSubtipoProduccionId}}`
                infoComplementaria = file.infoComplementaria
                this.tercerosService.put("info_complementaria_tercero/", infoComplementaria)
                  .subscribe((resp: any) => {
                    if (resp.Type === 'error') {
                      Swal({
                        type: 'error',
                        title: resp.Code,
                        text: this.translate.instant('ERROR.' + resp.Code),
                        confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
                      });
                    }
                  });
              }
            });
          } else {
            /** si no existe el metadato del documento en el listado quiere decir que el documento es el mismo
            tarido de terceros por lo que solo se va agregar a la lista de metadatos y así la solicitud tenga los datos completos
            */
            metadatos.push({
              MetadatoSubtipoProduccionId: file.MetadatoSubtipoProduccionId,
              Valor: file.Valor,
            });
          }
          i++;
          if (i === this.file_from_terceros.length)
            resolve(true);
        } else {
          reject({
            status: 404,
          });
        }
      });
    });
  }

  uploadTitulacionTerceros(metadatos)
  {
    return new Promise((resolve, reject) => {
      let infoComplementariaTercero: any = {};
      this.tercerosService.get('info_complementaria?query=GrupoInfoComplementariaId__Id:18')
        .subscribe(res => {
          metadatos.forEach(metadato => {
            if(metadato.MetadatoSubtipoProduccionId === 25 || metadato.MetadatoSubtipoProduccionId === 31 || metadato.MetadatoSubtipoProduccionId === 37) {
              let infosComplementarias = <Array<InfoComplementaria>>res;
              infosComplementarias.forEach(info => {
                switch (info.Nombre) {
                  case 'PROGRAMA_ACADEMICO':
                    infoComplementariaTercero.ProgramaAcademico = {
                      Dato: {ProgramaAcademico: this.info_produccion_academica.Titulo},
                      InfoComplementaria: info,
                    }
                    break;
                  case 'FECHA_INICIO':
                    infoComplementariaTercero.FechaInicio = {
                      Dato: {FechaInicio: this.info_produccion_academica.Fecha},
                      InfoComplementaria: info,
                    }
                    break;
                  case 'FECHA_FIN':
                    infoComplementariaTercero.FechaFin = {
                      Dato: {FechaFin: this.info_produccion_academica.Fecha},
                      InfoComplementaria: info,
                    }
                    break;
                  case 'TITULO_TRABAJO_GRADO':
                    infoComplementariaTercero.TituloTrabajoGrado = {
                      Dato: {TituloTrabajoGrado: this.info_produccion_academica.Titulo},
                      InfoComplementaria: info,
                    }
                    break;
                  case 'DES_TRABAJO_GRADO':
                    infoComplementariaTercero.DesTrabajoGrado = {
                      Dato: {DesTrabajoGrado: this.info_produccion_academica.Titulo},
                      InfoComplementaria: info,
                    }
                    break;
                  case 'DOCUMENTO_ID':
                    infoComplementariaTercero.DocumentoId = {
                      Dato: {DocumentoId: metadato.Valor, DocumentoNombre: metadato.MetadatoSubtipoProduccionId},
                      InfoComplementaria: info,
                    }
                    break;
                  case 'NIT_UNIVERSIDAD':
                    infoComplementariaTercero.NitUniversidad = {
                      Dato: {NitUniversidad: ""},
                      InfoComplementaria: info,
                    }
                    break;
                  case 'NIVEL_FORMACION':
                    if(metadato.MetadatoSubtipoProduccionId === 25) {
                      infoComplementariaTercero.NivelFormacion = {
                        Dato: {NivelFormacion: "Especializacion"},
                        InfoComplementaria: info,
                      }
                    } else if (metadato.MetadatoSubtipoProduccionId === 31) {
                      infoComplementariaTercero.NivelFormacion = {
                        Dato: {NivelFormacion: "Maestria"},
                        InfoComplementaria: info,
                      }
                    } else if (metadato.MetadatoSubtipoProduccionId === 37) {
                      infoComplementariaTercero.NivelFormacion = {
                        Dato: {NivelFormacion: "Postgrado"},
                        InfoComplementaria: info,
                      }
                    }
                    break;
                }
              });
              this.userData.FechaNacimiento = null;
              infoComplementariaTercero.TerceroId = this.userData;
            }
          });
          this.tercerosService.post('info_complementaria_tercero/padre', infoComplementariaTercero)
           .subscribe((response: any) => {
            if (response.Type === 'error') {
              reject(response.Code)
              Swal({
                type: 'error',
                title: response.Code,
                text: this.translate.instant('ERROR.' + response.Code),
                confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
              });
            } else {
              resolve(true);
            }
           }, (error: HttpErrorResponse) => {
            reject(error);
          })
        }, (error: HttpErrorResponse) => {
          reject(error);
        });
    });
  }

  validarForm(event) {
    if (event.valid) {
      if (this.info_produccion_academica.Titulo === undefined ||
        this.info_produccion_academica.Fecha === undefined) {
        Swal({
          type: 'warning',
          title: 'ERROR',
          text: this.translate.instant('produccion_academica.alerta_llenar_campos_datos_basicos'),
          confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
        });
      } else {
        if (!this.editando && this.files_to_drive.length === 0 &&
          (this.tipoProduccionAcademica.Id === 12 || this.tipoProduccionAcademica.Id === 13 || this.tipoProduccionAcademica.Id === 14)) {
          Swal({
            type: 'warning',
            title: 'ERROR',
            text: this.translate.instant('produccion_academica.alerta_llenar_archivo_soporte'),
            confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
          });
        } else {
          const promises = [];
          const metadatos = [];
          const filesToUpload = [];
          if (event.data.ProduccionAcademica) {
            const tempMetadatos = event.data.ProduccionAcademica;
            const keys = Object.keys(tempMetadatos);
            for (let i = 0; i < keys.length; i++) {
              if (tempMetadatos[keys[i]] !== undefined) {
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
              } else {
                this.files_to_drive.forEach(fileDrive => {
                  if (parseInt(keys[i], 10) === fileDrive.Id)
                    tempMetadatos[keys[i]] = fileDrive.File
                })
              }
            }
          } else {
            this.info_produccion_academica.Metadatos = [];
          }
          let opt;
          if (this.solicitud_docente_selected === undefined) {
            opt = {
              title: this.translate.instant('GLOBAL.registrar'),
              text: this.translate.instant('produccion_academica.seguro_continuar_registrar_produccion'),
              icon: 'warning',
              footer: this.translate.instant('produccion_academica.advertencia_registrar_produccion'),
              buttons: true,
              dangerMode: true,
              showCancelButton: true,
            };
          } else {
            opt = {
              title: this.translate.instant('GLOBAL.actualizar'),
              text: this.translate.instant('produccion_academica.seguro_continuar_actualizar_produccion'),
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
                  promises.push(this.uploadFilesToMetadaData(filesToUpload, metadatos));
                }

                Promise.all(promises)
                  .then(() => {
                    if (this.file_from_terceros.length > 0) {
                      this.actualizarDocumentosTerceros(metadatos)
                        .then(() => {
                          this.info_produccion_academica.Metadatos = metadatos;
                          this.info_produccion_academica.Autores = JSON.parse(JSON.stringify(this.source_authors));
                          if (this.solicitud_docente_selected === undefined) {
                            this.createProduccionAcademica(this.info_produccion_academica);
                          } else {
                            this.updateProduccionAcademica(this.info_produccion_academica);
                          }
                        })
                    } else if(this.tipoProduccionAcademica.Id === 2) {
                      this.uploadTitulacionTerceros(metadatos)
                        .then(() => { 
                          this.info_produccion_academica.Metadatos = metadatos;
                          this.info_produccion_academica.Autores = JSON.parse(JSON.stringify(this.source_authors));
                          if (this.solicitud_docente_selected === undefined) {
                            this.createProduccionAcademica(this.info_produccion_academica);
                          } else {
                            this.updateProduccionAcademica(this.info_produccion_academica);
                          }
                        })
                    } else {
                      this.info_produccion_academica.Metadatos = metadatos;
                      this.info_produccion_academica.Autores = JSON.parse(JSON.stringify(this.source_authors));
                      if (this.solicitud_docente_selected === undefined) {
                        this.createProduccionAcademica(this.info_produccion_academica);
                      } else {
                        this.updateProduccionAcademica(this.info_produccion_academica);
                      }
                    }

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

  download(url, title, w, h) {
    const left = (screen.width / 2) - (w / 2);
    const top = (screen.height / 2) - (h / 2);
    window.open(url, title, 'toolbar=no,' +
      'location=no, directories=no, status=no, menubar=no,' +
      'scrollbars=no, resizable=no, copyhistory=no, ' +
      'width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
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
