import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SolicitudDocentePost } from '../../../@core/data/models/solicitud_docente/solicitud_docente';

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
  }

  @Output() eventChange = new EventEmitter<number>();

  evaluacion_selected: SolicitudDocentePost;
  constructor(
  ) {
  }

  ngOnInit() {
  }
}
