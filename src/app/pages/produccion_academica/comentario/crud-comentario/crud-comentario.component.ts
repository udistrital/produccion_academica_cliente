import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ComentarioComponent } from '../comentario.component';
import { Comentario } from './comentario';

@Component({
  selector: 'ngx-crud-comentario',
  templateUrl: './crud-comentario.component.html',
  styleUrls: ['./crud-comentario.component.scss']
})
export class CrudComentarioComponent implements OnInit {

  comentario: Comentario;


  constructor(private translate: TranslateService) {
    this.comentario = new Comentario();
  }

  ngOnInit() {
  }

}
