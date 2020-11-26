import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { categoriasList } from './categorias'

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'new-solicitud',
  templateUrl: './new-solicitud.component.html',
  styleUrls: ['./new-solicitud.component.scss'],
})
export class NewSolicitudComponent implements OnInit {
  requestList = categoriasList;

  constructor(private translate: TranslateService, private router: Router) { }

  ngOnInit() {
  }

  goToRequest(requestType) {
    const opt: any = {
      width: '550px',
      title: this.translate.instant('GLOBAL.confirmar'),
      text: this.translate.instant('produccion_academica.certificado_cumplido_estatuto'),
      icon: 'warning',
      buttons: true,
      dangerMode: true,
      showCancelButton: true,
      footer: `<p style="color:#ccc;">
        ${this.translate.instant('produccion_academica.ejemplo_union_pdf')}
        <a href="https://combinepdf.com/es/" target="_blank">https://combinepdf.com/es/</a>
        </p>`,
    };
    Swal(opt)
    .then((willCreate) => {
      if (willCreate.value) {
        this.router.navigate(['pages/produccion_academica/crud-produccion_academica/c' + (requestType + 1)]);
      }
    });
  }

}
