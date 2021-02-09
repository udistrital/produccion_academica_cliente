import { Component, OnInit, OnChanges } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { UtilidadesService } from '../../../@core/utils/utilidades.service';
import { UserService } from '../../../@core/data/users.service';
import { IMAGENES } from './imagenes';
import Swal from 'sweetalert2';
import 'style-loader!angular2-toaster/toaster.css';
import { ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'ngx-preinscripcion',
  templateUrl: './preinscripcion.component.html',
  styleUrls: ['./preinscripcion.component.scss'],
})
export class PreinscripcionComponent implements OnInit, OnChanges {
  toasterService: any;

  @Output() eventChange = new EventEmitter();
  // tslint:disable-next-line: no-output-rename
  @Output('result') result: EventEmitter<any> = new EventEmitter();

  config: ToasterConfig;
  info_persona_id: number;
  preinscripcion: boolean;
  datosComplementarios: boolean;
  info_inscripcion: any;

  percentage_info: number = 0;
  percentage_acad: number = 0;
  percentage_expe: number = 0;
  percentage_proy: number = 0;
  percentage_prod: number = 0;
  percentage_desc: number = 0;
  percentage_docu: number = 0;
  percentage_total: number = 0;

  total: boolean = false;

  percentage_tab_info = [];
  percentage_tab_expe = [];
  percentage_tab_acad = [];
  percentage_tab_proy = [];
  percentage_tab_prod = [];
  percentage_tab_desc = [];
  percentage_tab_docu = [];

  show_info = false;
  show_profile = false;
  show_expe = false;
  show_acad = false;

  info_persona: boolean;
  info_complementario: boolean;
  selectedTipo: any;
  tipo_inscripcion_selected: any;
  selectTipo: any;
  imagenes: any;

  constructor(
    private translate: TranslateService,
    private userService: UserService,
  ) {
    this.imagenes = IMAGENES;
    this.translate = translate;
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
    });
    this.total = true;
    this.show_info = true;
    this.loadData();
  }

  async loadData() {
    try {
      this.info_persona_id = this.userService.getPersonaId();
      this.verifyIdPerson();
    } catch (error) {
      Swal({
        type: 'error',
        title: error.status + '',
        text: this.translate.instant('inscripcion.error_cargar_informacion'),
        confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
      });
    }
  }

  setPercentage_info(number, tab) {
    setTimeout(() => {
      this.percentage_tab_info[tab] = (number * 100) / 2;
      this.percentage_info = Math.round(UtilidadesService.getSumArray(this.percentage_tab_info));
      this.setPercentage_total();
    });
  }

  setPercentage_acad(number, tab) {
    this.percentage_tab_acad[tab] = (number * 100) / 2;
    this.percentage_acad = Math.round(UtilidadesService.getSumArray(this.percentage_tab_acad));
    this.setPercentage_total();
  }
  setPercentage_total() {
    this.percentage_total = Math.round(UtilidadesService.getSumArray(this.percentage_tab_info)) / 2;
    this.percentage_total += Math.round(UtilidadesService.getSumArray(this.percentage_tab_acad)) / 4;
    this.percentage_total += Math.round(UtilidadesService.getSumArray(this.percentage_tab_docu)) / 4;
    this.percentage_total += Math.round(UtilidadesService.getSumArray(this.percentage_tab_proy)) / 4;
    if (this.info_inscripcion !== undefined) {
      if (this.info_inscripcion.EstadoInscripcionId.Id > 1) {
        this.percentage_total = 100;
      }
      if (this.percentage_total >= 100) {
        if (this.info_inscripcion.EstadoInscripcionId.Id === 1) {
          this.total = false;
        }
      }
    }
  }

  useLanguage(language: string) {
    this.translate.use(language);
  }

  verifyIdPerson() {
    if (!isNaN(this.info_persona_id))
      this.datosComplementarios = true;
    else
      this.datosComplementarios = false;
  }

  perfil_editar(event): void {
    switch (event) {
      case 'info_persona':
        this.show_info = true;
        break;
      case 'info_preinscripcion':
        this.preinscripcion = true;
        break;
      case 'info_complementario':
        this.show_info = true;
        break;
      case 'perfil':
        this.show_info = false;
        this.show_profile = true;
        break;
      default:
        this.show_info = false;
        this.show_profile = false;
        break;
    }
  }

  putTerceroId(event) {
    if (event) {
      this.info_persona_id = event;
      this.verifyIdPerson();
    }
  }

  selectTab(event): void {
    if (event.tabTitle === this.translate.instant('GLOBAL.info_persona')) {
      if (this.info_persona)
        this.perfil_editar('info_persona');
    } else if (event.tabTitle === this.translate.instant('GLOBAL.info_caracteristica')) {
      this.perfil_editar('info_caracteristica');
    } else if (event.tabTitle === this.translate.instant('GLOBAL.informacion_contacto')) {
      this.perfil_editar('info_contacto');
    } else if (event.tabTitle === this.translate.instant('GLOBAL.info_complementaria')) {
      if (this.info_complementario)
        this.perfil_editar('info_complementaria');
    }
  }

  ngOnInit() {
    this.info_persona_id = this.userService.getPersonaId();
  }

  ngOnChanges() { }

  viewtab() {
    window.localStorage.setItem('IdTipoInscripcion', this.tipo_inscripcion_selected.Id);
    this.selectTipo = true;
  }
}
