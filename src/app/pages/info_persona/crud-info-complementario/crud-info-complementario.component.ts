import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BodyOutputType, Toast, ToasterConfig, ToasterService } from 'angular2-toaster';
import Swal from 'sweetalert2';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { UserService } from '../../../@core/data/users.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FORM_INFO_COMPLEMENTARIA } from './form-info_complementaria';
import { PopUpManager } from '../../../managers/popUpManager';
import { SgaMidService } from '../../../@core/data/sga_mid.service'
import { TercerosService } from '../../../@core/data/terceros.service';
import { ProyectoAcademicaService } from '../../../@core/data/proyecto_academica.service';
import { ParametrosCrudService } from '../../../@core/data/parametros_crud.service';
import { ImplicitAutenticationService } from '../../../@core/utils/implicit_autentication.service';
import { Tercero } from '../../../@core/data/models/terceros/tercero';


@Component({
  selector: 'ngx-crud-info-complementario',
  templateUrl: './crud-info-complementario.component.html',
  styleUrls: ['./crud-info-complementario.component.scss'],
})
export class CrudInfoComplementarioComponent implements OnInit {
  filesUp: any;
  config: ToasterConfig;
  info_complementaria_id: number;
  inscripcion_id: number;
  data: any;

  @Input('info_complementaria_id')
  set persona(info_complementaria_id: number) {
    this.loadInfoComplementaria();
  }

  @Output() eventChange = new EventEmitter();
  // tslint:disable-next-line: no-output-rename
  @Output('result') result: EventEmitter<any> = new EventEmitter();

  info_info_complementario: any;
  info_complementaria_padre: any;
  formInfoComplementaria: any;
  granAreaConocimiento: any;
  areaConocimientoEspecifica: any;
  listGranAreaConocimiento = [];
  listAreaConocimientoEspecifica = [];
  listAreaConocimientoEspecificaFilter = [];
  listNivelFormacion = [];
  nivelFormacion: any;
  institucion: any;
  info_inscripcion: any;
  clean: boolean;
  loading: boolean;
  percentage: number;
  AREA_CONOCIMIENTO: any;
  NIVEL_FORMACION: any;
  INSTITUCION: any;
  AREA_CONOCIMIENTO2: any;
  NIVEL_FORMACION2: any;
  INSTITUCION2: any;
  listaArea: any;
  listaGranArea: any;
  listaEspeArea: any;
  listaFormacion: any;
  listaInsti: any;
  aceptaTerminos: boolean;
  userData: Tercero;
  userNum: string;

  public loadInfoComplementaria(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.loading = true;
      this.parametrosCrudService.get('parametro?query=TipoParametroId__Id:3&limit=0')
        .subscribe(res => {
          this.info_info_complementario = res.Data;
          for (let i = 0; i < this.info_info_complementario.length; i++) {
            if (res.Data[i].ParametroPadreId == null) {
              this.listGranAreaConocimiento.push(this.info_info_complementario[i]);
            } else {
              this.listAreaConocimientoEspecifica.push(this.info_info_complementario[i]);
            }
          }
        },
          (error: HttpErrorResponse) => {
            Swal({
              type: 'error',
              title: error.status + '',
              text: this.translate.instant('ERROR.' + error.status),
              footer: this.translate.instant('GLOBAL.cargar') + '-' +
                this.translate.instant('GLOBAL.info_persona'),
              confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
            });
            reject(error);
          });
      this.proyectoAcademicoService.get('nivel_formacion')
        .subscribe(resp => {
          this.info_info_complementario = resp;
          for (let i = 0; i < this.info_info_complementario.length; i++) {
            if (resp[i].NivelFormacionPadreId != null) {
              this.listNivelFormacion.push(resp[i]);
            }
          }
        },
          (error: HttpErrorResponse) => {
            Swal({
              type: 'error',
              title: error.status + '',
              text: this.translate.instant('ERROR.' + error.status),
              footer: this.translate.instant('GLOBAL.cargar') + '-' +
                this.translate.instant('GLOBAL.info_persona'),
              confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
            });
            reject(error);
          })
      if (!isNaN(this.user.getPersonaId())) {
        this.tercerosService.get('tercero/?query=Id:' + (this.user.getPersonaId()))
          .subscribe(rest => {
            // if (res !== null) {
            if (Object.keys(rest[0]).length > 0) {
              this.userData = <Tercero>rest[0];
              this.userData['PuedeBorrar'] = false;
            }
          }, (error: HttpErrorResponse) => {
            Swal({
              type: 'error',
              title: error.status + '',
              text: this.translate.instant('ERROR.' + error.status),
              footer: this.translate.instant('GLOBAL.cargar') + '-' +
                this.translate.instant('GLOBAL.info_persona'),
              confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
            });
            reject(error);
          });
      }
      resolve(true);
    });
  }

  loadGrupinfoComplementaria(): void {
    this.tercerosService.get('info_complementaria/?query=Nombre:AREA_CONOCIMIENTO')
      .subscribe(res => {
        this.AREA_CONOCIMIENTO = res;
        this.tercerosService.get('info_complementaria/?query=Nombre:FORMACION_ACADEMICA')
          .subscribe(resp => {
            this.NIVEL_FORMACION = resp
            this.tercerosService.get('info_complementaria/?query=Nombre:INSTITUCION')
              .subscribe(rest => {
                this.INSTITUCION = rest
              }, (error: HttpErrorResponse) => {
                Swal({
                  type: 'error',
                  title: error.status + '',
                  text: this.translate.instant('ERROR.' + error.status),
                  footer: this.translate.instant('GLOBAL.cargar') + '-' +
                    this.translate.instant('GLOBAL.Informacion_complementaria'),
                  confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
                });
              });
          }, (error: HttpErrorResponse) => {
            Swal({
              type: 'error',
              title: error.status + '',
              text: this.translate.instant('ERROR.' + error.status),
              footer: this.translate.instant('GLOBAL.cargar') + '-' +
                this.translate.instant('GLOBAL.Informacion_complementaria'),
              confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
            });
          });
      }, (error: HttpErrorResponse) => {
        Swal({
          type: 'error',
          title: error.status + '',
          text: this.translate.instant('ERROR.' + error.status),
          footer: this.translate.instant('GLOBAL.cargar') + '-' +
            this.translate.instant('GLOBAL.Informacion_complementaria'),
          confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
        });
      });
  }

  loadInfoComplementariaTercero(): void {
    if (!isNaN(this.user.getPersonaId())) {
      this.tercerosService.get('info_complementaria_tercero/?query=TerceroId__Id:' +
        (this.user.getPersonaId()) + ',InfoComplementariaId__Nombre:FORMACION_ACADEMICA')
        .subscribe(resp => {
          console.info(resp)
          if (resp !== null && resp !== 'error') {
            this.NIVEL_FORMACION2 = resp
            if (Object.keys(this.NIVEL_FORMACION2[0]).length > 0) {
              this.listaFormacion = JSON.parse(this.NIVEL_FORMACION2[this.NIVEL_FORMACION2.length - 1].Dato)['NivelFormacion']
              this.nivelFormacion = this.listNivelFormacion.find(value => value.Id === this.listaFormacion.Id)
              this.loadInfoGrupoAcademico()
            }
            console.info(this.user.getPersonaId())
            // console.info(this.listNivelFormacion.find(value => value.Id === this.listaFormacion.Id))
          }
        }, (error: HttpErrorResponse) => {
          //  Swal({
          //    type: 'error',
          //    title: error.status + '',
          //    text: this.translate.instant('ERROR.' + error.status),
          //    footer: this.translate.instant('GLOBAL.cargar') + '-' +
          //      this.translate.instant('GLOBAL.Informacion_complementaria'),
          //    confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
          //  });
        });
      this.tercerosService.get('info_complementaria_tercero/?query=TerceroId__Id:' +
        (this.user.getPersonaId()) + ',InfoComplementariaId__Nombre:INSTITUCION')
        .subscribe(rest => {
          if (rest !== null && rest !== 'error') {
            this.INSTITUCION2 = rest
            if (Object.keys(this.INSTITUCION2[0]).length > 0) {
              this.listaInsti = JSON.parse(this.INSTITUCION2[this.INSTITUCION2.length - 1].Dato)
              this.institucion = this.listaInsti.Institucion
            }
          }
        }, (error: HttpErrorResponse) => {
          //  Swal({
          //    type: 'error',
          //    title: error.status + '',
          //    text: this.translate.instant('ERROR.' + error.status),
          //    footer: this.translate.instant('GLOBAL.cargar') + '-' +
          //      this.translate.instant('GLOBAL.Informacion_complementaria'),
          //    confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
          //  });
        });
    }
  }

  loadInfoGrupoAcademico(): void {
    if (!isNaN(this.user.getPersonaId())) {
      this.tercerosService.get('info_complementaria_tercero/?query=TerceroId__Id:' +
        (this.user.getPersonaId()) + ',InfoComplementariaId__Nombre:AREA_CONOCIMIENTO')
        .subscribe(res => {
          if (res !== null && res !== 'error') {
            this.AREA_CONOCIMIENTO2 = res;
            if (Object.keys(this.AREA_CONOCIMIENTO2[0]).length > 0) {
              this.listaArea = JSON.parse(this.AREA_CONOCIMIENTO2[this.AREA_CONOCIMIENTO2.length - 1].Dato)
              this.listaGranArea = this.listaArea['AreaConocimiento']['GranAreaConocimiento']
              this.listaEspeArea = this.listaArea['AreaConocimiento']['AreaConocimientoEspecifica']
              this.granAreaConocimiento = this.listGranAreaConocimiento.find(value => value.Id = this.listaGranArea.Id)
              console.info(this.listGranAreaConocimiento)
              console.info(this.listAreaConocimientoEspecifica)
              console.info(this.listaGranArea)
              console.info(this.listaEspeArea)
              console.info(this.listGranAreaConocimiento.find(value => this.listaGranArea.Id = value.Id))
              this.filterAreaConocimiento(this.granAreaConocimiento)
              this.areaConocimientoEspecifica = this.listAreaConocimientoEspecifica.find(value => value.Id === this.listaEspeArea.Id)
              console.info(this.listAreaConocimientoEspecifica.find(value => value.Id === this.listaEspeArea.Id))
            }
          }
        }, (error: HttpErrorResponse) => {
          Swal({
            type: 'error',
            title: error.status + '',
            text: this.translate.instant('ERROR.' + error.status),
            footer: this.translate.instant('GLOBAL.cargar') + '-' +
              this.translate.instant('GLOBAL.Informacion_complementaria'),
            confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
          });
        });
    }
  }

  constructor(private translate: TranslateService, private popUpManager: PopUpManager,
    private sgamidService: SgaMidService,
    private tercerosService: TercerosService,
    private user: UserService,
    private proyectoAcademicoService: ProyectoAcademicaService,
    private parametrosCrudService: ParametrosCrudService,
    private autenticationService: ImplicitAutenticationService,
    private toasterService: ToasterService) {
    this.loadInfoComplementaria()
      .then(() => { })
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
    this.loadInfoComplementariaTercero()
    this.loadGrupinfoComplementaria()
    this.formInfoComplementaria = JSON.parse(JSON.stringify(FORM_INFO_COMPLEMENTARIA));
    this.construirForm();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.construirForm();
    });
  }

  construirForm() {
    this.formInfoComplementaria.titulo = this.translate.instant('GLOBAL.Informacion_complementaria');
    this.formInfoComplementaria.btn = this.translate.instant('GLOBAL.guardar');
    for (let i = 0; i < this.formInfoComplementaria.campos.length; i++) {
      this.formInfoComplementaria.campos[i].label = this.translate.instant('GLOBAL.' + this.formInfoComplementaria.campos[i].label_i18n);
      this.formInfoComplementaria.campos[i].placeholder = this.translate.instant('GLOBAL.placeholder_' + this.formInfoComplementaria.campos[i].label_i18n);
    }
    this.formInfoComplementaria.campos.sort((campoA, campoB) => (campoA.orden > campoB.orden) ? 1 : -1);
  }

  createInfoComplementaria(): void {
    const areaConocimento: any = {
      GranAreaConocimiento: this.granAreaConocimiento,
      AreaConocimientoEspecifica: this.areaConocimientoEspecifica,
    }
    const AreaConocimiento: any = {
      AREA_CONOCIMIENTO: this.AREA_CONOCIMIENTO,
      AreaConocimiento: areaConocimento,
    }
    const nivelFormacion: any = {
      NIVEL_FORMACION: this.NIVEL_FORMACION,
      FormacionAcademica: this.nivelFormacion,
    }
    const institucion: any = {
      INSTITUCION: this.INSTITUCION,
      Institucion: this.institucion,
    }
    const InformacionParAcademico: any = {
      AreaConocimiento: AreaConocimiento,
      FormacionAcademica: nivelFormacion,
      Institucion: institucion,
      Tercero: this.userData,
    }

    const opt: any = {
      title: this.translate.instant('GLOBAL.crear'),
      text: this.translate.instant('GLOBAL.crear_info_complementaria'),
      icon: 'warning',
      buttons: true,
      dangerMode: true,
      showCancelButton: true,
      confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
      cancelButtonText: this.translate.instant('GLOBAL.cancelar'),
    };
    Swal(opt)
      .then((willDelete) => {
        this.loading = true;
        if (willDelete.value) {
          const files = []
          this.info_info_complementario = <any>InformacionParAcademico;
          this.info_info_complementario.Usuario = this.autenticationService.getPayload().sub;
          this.sgamidService.post('persona/guardar_complementarios_par', InformacionParAcademico).subscribe(res => {
            const r = <any>res
            if (r !== null && r.Type !== 'error') {
              window.localStorage.setItem('ente', r.Id);
              this.info_complementaria_id = r.Id;
              sessionStorage.setItem('IdTercero', String(this.info_complementaria_id));
              this.loading = false;
              this.popUpManager.showSuccessAlert(this.translate.instant('GLOBAL.persona_creado'));
            } else {
              this.showToast('error', this.translate.instant('GLOBAL.error'),
                this.translate.instant('GLOBAL.error'));
            }
          },
            (error: HttpErrorResponse) => {
              Swal({
                type: 'error',
                title: error.status + '',
                text: this.translate.instant('ERROR.' + error.status),
                footer: this.translate.instant('GLOBAL.crear') + '-' +
                  this.translate.instant('GLOBAL.info_persona'),
                confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
              });
            });
        }
      });
  }

  ngOnInit() {

  }

  validarForm(event) {
    this.createInfoComplementaria()
  }

  validCampo(event): boolean {
    if (event == null) {
      return false;
    }
  }

  filterAreaConocimiento(granAreaConocimiento: any) {
    if (granAreaConocimiento == null) {
      return false;
    } else {
      this.listAreaConocimientoEspecificaFilter = this.listAreaConocimientoEspecifica
        .filter(AreaConocimientoEspecifica => AreaConocimientoEspecifica.ParametroPadreId.Id === granAreaConocimiento.Id);
    }
  }

  setPercentage(event) {
    this.percentage = event;
    this.result.emit(this.percentage);
  }

  private showToast(type: string, title: string, body: string) {
    this.config = new ToasterConfig({
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
