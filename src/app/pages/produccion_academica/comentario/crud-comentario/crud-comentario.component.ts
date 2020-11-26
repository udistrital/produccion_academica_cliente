import { Component, OnInit } from '@angular/core';
import { Comentario } from './comentario';

@Component({
  selector: 'ngx-crud-comentario',
  templateUrl: './crud-comentario.component.html',
  styleUrls: ['./crud-comentario.component.scss']
})
export class CrudComentarioComponent implements OnInit {

  comentario: Comentario;


  constructor() { }

  ngOnInit() {
  }

}
