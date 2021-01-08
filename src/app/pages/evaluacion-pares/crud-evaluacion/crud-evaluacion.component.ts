import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToasterConfig } from 'angular2-toaster';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { EvaluacionDocenteService } from '../../../@core/data/evaluacion-docente.service';
import { FORM_evaluacion_docente } from './form-produccion_academica'
import { SolicitudDocentePost } from '../../../@core/data/models/solicitud_docente/solicitud_docente';
import { ProduccionAcademicaPost } from '../../../@core/data/models/produccion_academica/produccion_academica';
import { TipoEvaluacion } from '../../../@core/data/models/evaluacion_par/tipo_evaluacion';
import { Seccion } from '../../../@core/data/models/evaluacion_par/seccion';
import { Item } from '../../../@core/data/models/evaluacion_par/item';
import Swal from 'sweetalert2';
import 'style-loader!angular2-toaster/toaster.css';

@Component({
  selector: 'ngx-crud-evaluacion',
  templateUrl: './crud-evaluacion.component.html',
  styleUrls: ['./crud-evaluacion.component.scss'],
})
export class CrudEvaluacionComponent implements OnInit {
  @Input('evaluacion_selected')
  set evaluacion(evaluacion_selected: SolicitudDocentePost) {
    this.evaluacion_selected = evaluacion_selected;
    console.info(this.evaluacion_selected)
    this.loadSubTipoFormFields(this.evaluacion_selected.SolicitudPadreId.ProduccionAcademica, null);
  }

  @Output() eventChange = new EventEmitter<number>();

  config: ToasterConfig;
  evaluacion_selected: SolicitudDocentePost;
  tipoEvaluacion: TipoEvaluacion;
  formEvaluacionPar: any;
  clean: boolean;
  formConstruido: boolean;
  editando: boolean;

  constructor(
    public translate: TranslateService,
    private evaluacionDocenteService: EvaluacionDocenteService,
  ) {
  }

  construirForm() {
    this.formEvaluacionPar.titulo = this.translate.instant('produccion_academica.produccion_academica');
    this.formEvaluacionPar.btn = this.translate.instant('GLOBAL.guardar');
    for (let i = 0; i < this.formEvaluacionPar.secciones.campos.length; i++) {
      this.formEvaluacionPar.campos[i].label = this.translate.instant('produccion_academica.labels.' + this.formEvaluacionPar.campos[i].label_i18n);
      this.formEvaluacionPar.campos[i].placeholder =
        this.translate.instant('produccion_academica.placeholders.' + this.formEvaluacionPar.campos[i].placeholder_i18n);
    }
    this.formEvaluacionPar.campos.sort((campoA, campoB) => (campoA.orden > campoB.orden) ? 1 : -1);
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
    else
      query = `query=nombre:${produccionAcademica.SubtipoProduccionId.TipoProduccionId.Nombre}`;

    query = this.prepararQuery(query);
    console.info(query);
    this.evaluacionDocenteService.get(`tipos-evaluacion?${query}`)
      .subscribe(res => {
        if (res !== null) {
          this.tipoEvaluacion = <TipoEvaluacion>res.Data[0]
          console.info(this.tipoEvaluacion);
          // console.info('loadSubtipoFormField - res(metadatos)', res);
          (<Array<Seccion>>this.tipoEvaluacion.secciones_id).forEach(seccion => {
            if (Object.keys(seccion).length > 0) {
              console.info(seccion);
              const section = seccion.estructura_seccion;
              section.titulo = this.translate.instant('evaluacion.labels.' + section.label_i18n);
              section.orden = section.nombre;
              section.campos = [];
              this.formEvaluacionPar.secciones.push(section);
              (<Array<Item>>seccion.items_id).forEach(item => {
                if (Object.keys(item).length > 0) {
                  const field = item.estructura_item;
                  field.orden = field.nombre;
                  section.campos.push(field);
                }
              });
            }
          });
          console.info(this.formEvaluacionPar);
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
          // this.construirForm();
          // this.formConstruido = true;
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

  validarForm(event) {
    if (event.valid) {
      console.info(event.data);
    } else {
      Swal({
        type: 'warning',
        title: 'ERROR',
        text: this.translate.instant('produccion_academica.alerta_llenar_campos'),
        confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
      });
    }
  }
}