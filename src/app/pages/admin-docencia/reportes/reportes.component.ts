import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'ngx-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss'],
})
export class ReportesComponent implements OnInit {

  cambiotab: number;
  isReportPares: boolean;
  isReportTitulos: boolean;
  isReportCambios: boolean;
  isReportPuntos: boolean;
  urlReportPares: string;
  urlReportTitulos: string;
  urlReportCambios: string;
  urlReportPuntos: string;

  fechaInicio: Date;
  fechaFinal: Date;

  constructor(public translate: TranslateService) { }

  ngOnInit() {
  }

  closePop() {
    this.isReportPares = false;
    this.isReportTitulos = false;
    this.isReportCambios = false;
    this.isReportPuntos = false;
  }

  generateLinks() {
    if (this.fechaInicio === undefined || this.fechaFinal === undefined) {
      Swal({
        type: 'warning',
        title: 'ERROR',
        text: this.translate.instant('evaluacion.alerta_llenar_campos_evaluador'),
        confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
      });
    } else {
      this.urlReportPares = `${environment.SPAGOBIURL}&fechaFinal=${this.fechaFinal.toISOString().split('T')[0]}&documentName=docenReportePares&fechaInicio=${this.fechaInicio.toISOString().split('T')[0]}&fechaInicio_description=&SBI_EXECUTION_ROLE=%2Fspagobi%2Fadmin&SBI_COUNTRY=ES&fechaFinal_description=&document=864&SBI_LANGUAGE=es&SBI_HOST=https%3A%2F%2Fintelligentia.udistrital.edu.co%3A8443&dateformat=DD-MM-YYYY&SBI_SPAGO_CONTROLLER=%2Fservlet%2FAdapterHTTP&user_id=sergio_orjuela&SBI_EXECUTION_ID=27df545a5d2611eba42cad9b403e2696&isFromCross=false&SBI_ENVIRONMENT=DOCBROWSER&outputType=XLS`;

      const a = document.createElement('a');
      a.href = this.urlReportPares;
      a.click();
      this.closePop();
    }
  }
}
