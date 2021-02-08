import { ImplicitAutenticationService } from '../../../@core/utils/implicit_autentication.service';
import { InfoPersona } from './../../../@core/data/models/informacion/info_persona';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FORM_INFO_PERSONA } from './form-info_persona';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import 'style-loader!angular2-toaster/toaster.css';
import { IAppState } from '../../../@core/store/app.state';
import { Store } from '@ngrx/store';
import { PopUpManager } from '../../../managers/popUpManager';
import { ListService } from '../../../@core/store/services/list.service';
import { SgaMidService } from '../../../@core/data/sga_mid.service';
import * as momentTimezone from 'moment-timezone';
import { AutenticacionMidServiced } from '../../../@core/data/autenticacion_mid.service';

@Component({
  selector: 'ngx-crud-info-persona',
  templateUrl: './crud-info_persona.component.html',
  styleUrls: ['./crud-info_persona.component.scss'],
})
export class CrudInfoPersonaComponent implements OnInit {
  filesUp: any;
  config: ToasterConfig;
  info_persona_id: number;
  inscripcion_id: number;

  @Input('info_persona_id')
  set persona(info_persona_id: number) {
    this.info_persona_id = info_persona_id;
    if (!isNaN(this.info_persona_id))
      this.loadInfoPersona();
  }

  @Output() eventChange = new EventEmitter();
  // tslint:disable-next-line: no-output-rename
  @Output('result') result: EventEmitter<any> = new EventEmitter();

  info_info_persona: any;
  formInfoPersona: any;
  info_inscripcion: any;
  clean: boolean;
  loading: boolean;
  percentage: number;
  aceptaTerminos: boolean;

  constructor(
    private translate: TranslateService,
    private popUpManager: PopUpManager,
    private sgamidService: SgaMidService,
    private autenticacionMidService: AutenticacionMidServiced,
    private autenticationService: ImplicitAutenticationService,
    private store: Store<IAppState>,
    private listService: ListService,
    private toasterService: ToasterService) {
    this.formInfoPersona = FORM_INFO_PERSONA;
    this.construirForm();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.construirForm();
    });
    this.listService.findGenero();
    this.listService.findEstadoCivil();
    this.listService.findTipoIdentificacion();
    this.loading = false;
    this.loadLists();
  }

  construirForm() {
    this.formInfoPersona.btn = this.translate.instant('GLOBAL.guardar');
    for (let i = 0; i < this.formInfoPersona.campos.length; i++) {
      this.formInfoPersona.campos[i].label = this.translate.instant('GLOBAL.' + this.formInfoPersona.campos[i].label_i18n);
      this.formInfoPersona.campos[i].placeholder = this.translate.instant('GLOBAL.placeholder_' + this.formInfoPersona.campos[i].label_i18n);
    }
  }

  useLanguage(language: string) {
    this.translate.use(language);
  }

  getIndexForm(nombre: String): number {
    for (let index = 0; index < this.formInfoPersona.campos.length; index++) {
      const element = this.formInfoPersona.campos[index];
      if (element.nombre === nombre) {
        return index
      }
    }
    return 0;
  }

  public loadInfoPersona(): void {
    this.loading = true;
    if (this.info_persona_id !== undefined && this.info_persona_id !== 0 &&
      this.info_persona_id.toString() !== '') {
      this.sgamidService.get('persona/consultar_persona/' + this.info_persona_id)
        .subscribe(res => {
          if (res !== null) {
            const temp = <InfoPersona>res;
            this.info_info_persona = temp;
            const files = []
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
          });
    } else {
      this.info_info_persona = undefined
      this.clean = !this.clean;
      this.loading = false;
    }
  }

  createInfoPersona(infoPersona: any): void {
    const opt: any = {
      title: this.translate.instant('GLOBAL.crear'),
      text: this.translate.instant('GLOBAL.crear_info_persona'),
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
          this.info_info_persona = <any>infoPersona;
          this.info_info_persona.FechaNacimiento = momentTimezone.tz(this.info_info_persona.FechaNacimiento, 'America/Bogota').format('YYYY-MM-DD HH:mm:ss');
          this.info_info_persona.FechaNacimiento = this.info_info_persona.FechaNacimiento + ' +0000 +0000';
          this.info_info_persona.FechaExpedicion = momentTimezone.tz(this.info_info_persona.FechaExpedicion, 'America/Bogota').format('YYYY-MM-DD HH:mm:ss');
          this.info_info_persona.FechaExpedicion = this.info_info_persona.FechaExpedicion + ' +0000 +0000';
          this.info_info_persona.Usuario = this.autenticationService.getPayload().sub;
          this.sgamidService.post('persona/guardar_persona', this.info_info_persona).subscribe(res => {
            const r = <any>res
            if (r !== null && r.Type !== 'error') {
              window.localStorage.setItem('ente', r.Id);
              this.info_persona_id = r.Id;
              sessionStorage.setItem('IdTercero', String(this.info_persona_id));
              this.loading = false;
              this.popUpManager.showSuccessAlert(this.translate.instant('GLOBAL.persona_creado'));
              const rol: any = {
                user: r.UsuarioWSO2,
                rol: 'EVALUADOR',
              }
              this.autenticacionMidService.post('token/addRol', rol).subscribe(resp => {
                const l = <any>resp
                if (l !== null && r.Type !== 'error') {
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
    if (event.valid) {
      if (this.info_inscripcion === undefined) {
        this.validarTerminos(event);
      } else {
        if (this.info_inscripcion.AceptaTerminos !== true) {
          this.validarTerminos(event);
        } else { }
      }
    }
  }

  validarTerminos(event) {
    Swal({
      title: this.translate.instant('GLOBAL.terminos_datos'),
      width: 800,
      allowOutsideClick: true,
      allowEscapeKey: true,
      html: '<embed src="/assets/pdf/politicasUD.pdf" type="application/pdf" style="width:100%; height:375px;" frameborder="0"></embed>',
      input: 'checkbox',
      inputPlaceholder: this.translate.instant('GLOBAL.acepto_terminos'),
      confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
    })
      .then((result) => {
        if (result.value) {
          if (this.info_info_persona === undefined) {
            this.createInfoPersona(event.data.InfoPersona);
          }
        } else if (result.value === 0) {
          Swal({
            type: 'error',
            text: this.translate.instant('GLOBAL.rechazo_terminos'),
            confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
          });
          this.aceptaTerminos = false;
        }
      });
  }

  setPercentage(event) {
    this.percentage = event;
    this.result.emit(this.percentage);
  }

  public loadLists() {
    this.store.select((state) => state).subscribe(
      (list) => {
        this.formInfoPersona.campos[this.getIndexForm('Genero')].opciones = list.listGenero[0];
        this.formInfoPersona.campos[this.getIndexForm('EstadoCivil')].opciones = list.listEstadoCivil[0];
        this.formInfoPersona.campos[this.getIndexForm('TipoIdentificacion')].opciones = list.listTipoIdentificacion[0];
      },
    );
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
