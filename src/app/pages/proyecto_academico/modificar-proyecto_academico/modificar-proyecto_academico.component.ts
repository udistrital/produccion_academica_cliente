import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { OikosService } from '../../../@core/data/oikos.service';
import { CoreService } from '../../../@core/data/core.service';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import {FormBuilder, Validators, FormControl} from '@angular/forms';
import {ProyectoAcademicoPost} from '../../../@core/data/models/proyecto_academico/proyecto_academico_post'
import Swal from 'sweetalert2';
import 'style-loader!angular2-toaster/toaster.css';
import { HttpErrorResponse } from '@angular/common/http';
import { LocalDataSource } from 'ng2-smart-table';
import { UnidadTiempoService } from '../../../@core/data/unidad_tiempo.service';
import { ProyectoAcademicoInstitucion } from '../../../@core/data/models/proyecto_academico/proyecto_academico_institucion';
import { TipoTitulacion } from '../../../@core/data/models/proyecto_academico/tipo_titulacion';
import { Metodologia } from '../../../@core/data/models/proyecto_academico/metodologia';
import { NivelFormacion } from '../../../@core/data/models/proyecto_academico/nivel_formacion';
import { RegistroCalificadoAcreditacion } from '../../../@core/data/models/proyecto_academico/registro_calificado_acreditacion';
import { TipoRegistro } from '../../../@core/data/models/proyecto_academico/tipo_registro';
import { ProyectoAcademicoService } from '../../../@core/data/proyecto_academico.service';
import { InstitucionEnfasis } from '../../../@core/data/models/proyecto_academico/institucion_enfasis';
import { Enfasis } from '../../../@core/data/models/proyecto_academico/enfasis';
import { Titulacion } from '../../../@core/data/models/proyecto_academico/titulacion';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { TipoDependencia } from '../../../@core/data/models/oikos/tipo_dependencia';
import { DependenciaTipoDependencia } from '../../../@core/data/models/oikos/dependencia_tipo_dependencia';
import { Dependencia } from '../../../@core/data/models/oikos/dependencia';
import { SgaMidService } from '../../../@core/data/sga_mid.service';
import * as moment from 'moment';
import { Inject } from '@angular/core';
import * as momentTimezone from 'moment-timezone';
import { InformacionBasicaPut } from '../../../@core/data/models/proyecto_academico/informacion_basica_put';

@Component({
  selector: 'ngx-modificar-proyecto-academico',
  templateUrl: './modificar-proyecto_academico.component.html',
  styleUrls: ['./modificar-proyecto_academico.component.scss'],
  })
export class ModificarProyectoAcademicoComponent implements OnInit {
  config: ToasterConfig;
  settings: any;
  basicform: any;
  resoluform: any;
  resolualtaform: any;
  actoform: any;
  compleform: any;
  facultad = [];
  area = [];
  opcionSeleccionadoFacultad: any;
  opcionSeleccionadoUnidad: any;
  opcionSeleccionadoArea: any;
  opcionSeleccionadoNucleo: any;
  opcionSeleccionadoEnfasis: any;
  opcionSeleccionadoNivel: any;
  opcionSeleccionadoMeto: any;
  checkenfasis: boolean = false;
  checkciclos: boolean = false;
  checkofrece: boolean = false;
  nucleo = [];
  unidad= [];
  enfasis = [];
  nivel = [];
  metodo = [];
  fecha_creacion_calificado: Date;
  fecha_creacion_alta: Date;
  fecha_vencimiento: string;
  fecha_vigencia: string;
  check_alta_calidad: boolean ;
  proyecto_academicoPost: ProyectoAcademicoPost;
  informacion_basicaPut: InformacionBasicaPut;
  proyecto_academico: ProyectoAcademicoInstitucion;
  tipo_titulacion: TipoTitulacion;
  metodologia: Metodologia;
  nivel_formacion: NivelFormacion;
  registro_califacado_acreditacion: RegistroCalificadoAcreditacion;
  tipo_registro: TipoRegistro;
  enfasis_proyecto: InstitucionEnfasis;
  enfasis_basico: Enfasis;
  titulacion_proyecto_snies: Titulacion;
  titulacion_proyecto_mujer: Titulacion;
  titulacion_proyecto_hombre: Titulacion;
  tipo_dependencia: TipoDependencia;
  dependencia_tipo_dependencia: DependenciaTipoDependencia;
  dependencia: Dependencia;



  CampoControl = new FormControl('', [Validators.required]);
  Campo1Control = new FormControl('', [Validators.required]);
  Campo2Control = new FormControl('', [Validators.required]);
  Campo3Control = new FormControl('', [Validators.required]);
  Campo4Control = new FormControl('', [Validators.required]);
  Campo5Control = new FormControl('', [Validators.required]);
  Campo6Control = new FormControl('', [Validators.required]);
  Campo7Control = new FormControl('', [Validators.required]);
  Campo8Control = new FormControl('', [Validators.required]);
  Campo9Control = new FormControl('', [Validators.required]);
  Campo10Control = new FormControl('', [Validators.required]);
  Campo11Control = new FormControl('', [Validators.required, Validators.maxLength(4)]);
  Campo12Control = new FormControl('', [Validators.required]);
  Campo13Control = new FormControl('', [Validators.required, Validators.maxLength(4)]);
  Campo14Control = new FormControl('', [Validators.required]);
  Campo16Control = new FormControl('', [Validators.required]);
  Campo17Control = new FormControl('', [Validators.required, Validators.maxLength(4)]);
  Campo18Control = new FormControl('', [Validators.required]);
  Campo19Control = new FormControl('', [Validators.required]);
  Campo20Control = new FormControl('', [Validators.required]);
  Campo21Control = new FormControl('', [Validators.required]);
  Campo22Control = new FormControl('', [Validators.required, Validators.maxLength(2)]);
  Campo23Control = new FormControl('', [Validators.required, Validators.maxLength(1)]);
  CampoCorreoControl = new FormControl('', [Validators.required, Validators.email]);
  CampoCreditosControl = new FormControl('', [Validators.required, Validators.maxLength(4)]);
  Campo24Control = new FormControl('', [Validators.required, Validators.maxLength(4)]);
  Campo25Control = new FormControl('', [Validators.required, Validators.maxLength(4)]);
  Campo26Control = new FormControl('', [Validators.required]);
  Campo28Control = new FormControl('', [Validators.required, Validators.maxLength(1)]);
  Campo27Control = new FormControl('', [Validators.required, Validators.maxLength(2)]);
  selectFormControl = new FormControl('', Validators.required);
  @Output() eventChange = new EventEmitter();

  constructor(private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ModificarProyectoAcademicoComponent>,
    private toasterService: ToasterService,
    private oikosService: OikosService,
    private coreService: CoreService,
    private proyectoacademicoService: ProyectoAcademicoService,
    private sgamidService: SgaMidService,
    private unidadtiempoService: UnidadTiempoService,
    private formBuilder: FormBuilder) {
      this.basicform = this.formBuilder.group({
        codigo_snies: ['', Validators.required],
        facultad: ['', Validators.required],
        nivel_proyecto: ['', Validators.required],
        metodologia_proyecto: ['', Validators.required],
        nombre_proyecto: ['', Validators.required],
        abreviacion_proyecto: ['', Validators.required],
        correo_proyecto: ['', [Validators.required, Validators.email]],
        numero_proyecto: ['', Validators.required],
        creditos_proyecto: ['', [Validators.required, Validators.maxLength(4)]],
        duracion_proyecto: ['', Validators.required],
        tipo_duracion_proyecto: ['', Validators.required],
        ciclos_proyecto: ['', Validators.required],
        ofrece_proyecto: ['', Validators.required],
        // enfasis_proyecto: ['', Validators.required],
     })
     this.resoluform = formBuilder.group({
      resolucion: ['', Validators.required],
      ano_resolucion: ['', [Validators.required, Validators.maxLength(4)]],
      fecha_creacion: ['', Validators.required],
      mes_vigencia: ['', [Validators.required, Validators.maxLength(2)]],
      ano_vigencia: ['', [Validators.required, Validators.maxLength(1)]],
     })
     this.resolualtaform = formBuilder.group({
      resolucion: ['', Validators.required],
      ano_resolucion: ['', [Validators.required, Validators.maxLength(4)]],
      fecha_creacion: ['', Validators.required],
      mes_vigencia: ['', [Validators.required, Validators.maxLength(2)]],
      ano_vigencia: ['', [Validators.required, Validators.maxLength(1)]],
     })
     this.actoform = formBuilder.group({
      acto: ['', Validators.required],
      ano_acto: ['', [Validators.required, Validators.maxLength(4)]],
     })
     this.compleform = formBuilder.group({
       titulacion_snies: ['', Validators.required],
       titulacion_mujer: ['', Validators.required],
       titulacion_hombre: ['', Validators.required],
       competencias: ['', Validators.required],
     });
    this.loadfacultad();
   this.loadnivel();
   this.loadmetodologia();
   this.loadunidadtiempo();
   this.loadarea();
   this.loadnucleo();
   this.checkofrece = Boolean(JSON.parse(this.data.oferta_check));
   this.checkciclos = Boolean(JSON.parse(this.data.ciclos_check));
   console.info(this.data.fecha_creacion_registro)
   this.fecha_creacion_calificado = momentTimezone.tz(this.data.fecha_creacion_registro, 'America/Bogota').format('YYYY-MM-DDTHH:mm');
   console.info('despues' + this.fecha_creacion_calificado)
    }



  useLanguage(language: string) {
    this.translate.use(language);
  }
  onclick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }
  loadfacultad() {
    this.oikosService.get('dependencia_tipo_dependencia/?query=TipoDependenciaId:2')
    .subscribe((res: any) => {
      const r = <any>res;
      if (res !== null && r.Type !== 'error') {
        this.facultad = res.map((data: any) => (data.DependenciaId));
        this.facultad.forEach((fac: any ) => {
          if (fac.Id === Number(this.data.idfacultad)) {
            this.opcionSeleccionadoFacultad = fac;
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

  loadnivel() {
    this.proyectoacademicoService.get('nivel_formacion')
    .subscribe(res => {
      const r = <any>res;
      if (res !== null && r.Type !== 'error') {
        this.nivel = <any>res;
        this.nivel.forEach((niv: any ) => {
          if (niv.Id === Number(this.data.idnivel)) {
            this.opcionSeleccionadoNivel = niv;
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
  loadmetodologia() {
    this.proyectoacademicoService.get('metodologia')
    .subscribe(res => {
      const r = <any>res;
      if (res !== null && r.Type !== 'error') {
        this.metodo = <any>res;
        this.metodo.forEach((met: any ) => {
          if (met.Id === Number(this.data.idmetodo)) {
            this.opcionSeleccionadoMeto = met;
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
  loadunidadtiempo() {
    this.unidadtiempoService.get('unidad_tiempo')
    .subscribe(res => {
      const r = <any>res;
      if (res !== null && r.Type !== 'error') {
        this.unidad = <any>res;
        this.unidad.forEach((uni: any ) => {
          if (uni.Id === Number(this.data.idunidad)) {
            this.opcionSeleccionadoUnidad = uni;
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
  loadarea() {
    this.coreService.get('area_conocimiento')
    .subscribe(res => {
      const r = <any>res;
      if (res !== null && r.Type !== 'error') {
        this.area = <any>res;
        this.area.forEach((are: any ) => {
          if (are.Id === Number(this.data.idarea)) {
            this.opcionSeleccionadoArea = are;
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
  loadnucleo() {
    this.coreService.get('nucleo_basico_conocimiento')
    .subscribe(res => {
      const r = <any>res;
      if (res !== null && r.Type !== 'error') {
        this.nucleo = <any>res;
        this.nucleo.forEach((nuc: any ) => {
          if (nuc.Id === Number(this.data.idnucleo)) {
            this.opcionSeleccionadoNucleo = nuc;
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

  putinformacionbasica() {
    if ( this.compleform.valid ) {
    this.metodologia = {
      Id: this.opcionSeleccionadoMeto['Id'],
    }
    this.nivel_formacion = {
      Id: this.opcionSeleccionadoNivel['Id'],
    }
    this.proyecto_academico = {
      Id : Number(this.data.idproyecto) ,
      Codigo : '0',
      Nombre : this.basicform.value.nombre_proyecto[0],
      CodigoSnies: this.basicform.value.codigo_snies[0],
      Duracion: Number(this.basicform.value.duracion_proyecto),
      NumeroCreditos: Number(this.basicform.value.creditos_proyecto),
      CorreoElectronico: this.basicform.value.correo_proyecto[0],
      CiclosPropedeuticos: this.checkciclos,
      NumeroActoAdministrativo: Number(this.actoform.value.acto),
      EnlaceActoAdministrativo: 'Pruebalinkdocumento.udistrital.edu.co',
      Competencias: this.compleform.value.competencias[0],
      CodigoAbreviacion: this.basicform.value.abreviacion_proyecto[0],
      Activo: true,
      Oferta: this.checkofrece,
      UnidadTiempoId: this.opcionSeleccionadoUnidad['Id'],
      AnoActoAdministrativoId: this.actoform.value.ano_acto,
      DependenciaId: this.opcionSeleccionadoFacultad['Id'],
      AreaConocimientoId: this.opcionSeleccionadoArea['Id'],
      NucleoBaseId: this.opcionSeleccionadoNucleo['Id'],
      MetodologiaId: this.metodologia,
      NivelFormacionId: this.nivel_formacion,
      AnoActoAdministrativo: this.actoform.value.ano_acto,

    }

    this.titulacion_proyecto_snies = {
      Id: 0,
      Nombre: String(this.compleform.value.titulacion_snies),
      Activo: true,
      TipoTitulacionId: this.tipo_titulacion = {
        Id: 1,
      },
      ProyectoAcademicoInstitucionId: this.proyecto_academico,
    }
    this.titulacion_proyecto_mujer = {
      Id: 0,
      Nombre: String(this.compleform.value.titulacion_mujer),
      Activo: true,
      TipoTitulacionId: this.tipo_titulacion = {
        Id: 3,
      },
      ProyectoAcademicoInstitucionId: this.proyecto_academico,
    }
    this.titulacion_proyecto_hombre = {
      Id: 0,
      Nombre: String(this.compleform.value.titulacion_hombre),
      Activo: true,
      TipoTitulacionId: this.tipo_titulacion = {
        Id: 2,
      },
      ProyectoAcademicoInstitucionId: this.proyecto_academico,
    }
    const informacion_basicaPut = {
      ProyectoAcademicoInstitucion: this.proyecto_academico,
      Titulaciones: [this.titulacion_proyecto_snies, this.titulacion_proyecto_mujer, this.titulacion_proyecto_hombre],
    }
    const opt: any = {
      title: this.translate.instant('GLOBAL.actualizar'),
      text: this.translate.instant('editarproyecto.seguro_continuar_actualizar_proyecto'),
      icon: 'warning',
      buttons: true,
      dangerMode: true,
      showCancelButton: true,
    };
    Swal(opt)
    .then((willCreate) => {
      if (willCreate.value) {
        this.proyectoacademicoService.put('tr_proyecto_academico/informacion_basica/' + Number(this.data.idproyecto), informacion_basicaPut)
        .subscribe((res: any) => {
          if (res.Type === 'error') {
            Swal({
              type: 'error',
               title: res.Code,
              text: this.translate.instant('ERROR.' + res.Code),
              confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
            });
            this.showToast('error', 'error', this.translate.instant('editarproyecto.proyecto_no_actualizado'));
          } else {
            const opt1: any = {
              title: this.translate.instant('editarproyecto.actualizado'),
              text: this.translate.instant('editarproyecto.proyecto_actualizado'),
              icon: 'warning',
              buttons: true,
              dangerMode: true,
              showCancelButton: true,
            }; Swal(opt1)
            .then((willDelete) => {
              if (willDelete.value) {
              }
            });
          }
        });
      }
    });
  } else {
    const opt1: any = {
      title: this.translate.instant('GLOBAL.atencion'),
      text: this.translate.instant('proyecto.error_datos'),
      icon: 'warning',
      buttons: true,
      dangerMode: true,
      showCancelButton: true,
    }; Swal(opt1)
    .then((willDelete) => {
      if (willDelete.value) {

      }
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
