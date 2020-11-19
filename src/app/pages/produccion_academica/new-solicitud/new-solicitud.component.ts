import { Component, OnInit } from '@angular/core';
import { categoriasList } from './categorias'

@Component({
  selector: 'new-solicitud',
  templateUrl: './new-solicitud.component.html',
  styleUrls: ['./new-solicitud.component.scss']
})
export class NewSolicitudComponent implements OnInit {
  requestList = categoriasList;

  constructor() { }

  ngOnInit() {
  }

}
