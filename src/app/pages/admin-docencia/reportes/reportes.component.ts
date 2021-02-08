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

  reportType: number;
  cambiotab: number;
  isReportPares: boolean;
  isReportAny: boolean;
  urlReport: string;
  urlReportComplete: string;

  fechaInicio: Date;
  fechaFinal: Date;
  fechaCorte: Date;

  constructor(public translate: TranslateService) {
    this.urlReport = environment.SPAGOBI.URL + environment.SPAGOBI.CONTEXT + environment.SPAGOBI.ROLE +
    environment.SPAGOBI.CON + environment.SPAGOBI.LAN + environment.SPAGOBI.HOST +
    environment.SPAGOBI.DFORMAT + environment.SPAGOBI.CONTROLLER + environment.SPAGOBI.USER +
    environment.SPAGOBI.EXECUTION + environment.SPAGOBI.CROSS + environment.SPAGOBI.ENVIRONMENT;
  }

  ngOnInit() {
  }

  activePop(option: number) {
    this.reportType = option;
    if (this.reportType === 0)
      this.isReportPares = true;
    else
      this.isReportAny = true;
  }

  closePop() {
    this.isReportPares = false;
    this.isReportAny = false;
  }

  generateLinks() {
    if ((this.reportType === 0 && (this.fechaInicio === undefined || this.fechaFinal === undefined)) ||
      (this.reportType !== 0 && this.fechaCorte === undefined)) {
      Swal({
        type: 'warning',
        title: 'ERROR',
        text: this.translate.instant('evaluacion.alerta_llenar_campos_evaluador'),
        confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
      });
    } else {
      switch (this.reportType) {
        case 0:
          this.urlReportComplete = this.urlReport +
          '&document=864&documentName=docenReportePares&fechaInicio_description=&fechaFinal_description=&outputType=XLS' +
          '&fechaInicio=' + this.fechaInicio.toISOString().split('T')[0] +
          '&fechaFinal=' + this.fechaFinal.toISOString().split('T')[0];
          break;
        case 1:
          this.urlReportComplete = this.urlReport +
          '&document=865&documentName=docenReporteTitulos&fechaReporte_description=&outputType=XLS' +
          '&fechaReporte=' + this.fechaCorte.toISOString().split('T')[0];
          break;
        case 2:
          this.urlReportComplete = this.urlReport +
          '&document=866&documentName=docenReporteCategori&fechaReporte_description=&outputType=XLS' +
          '&fechaReporte=' + this.fechaCorte.toISOString().split('T')[0];
          break;
        case 3:
          this.urlReportComplete = this.urlReport +
          '&document=867&documentName=docenReporteTotPunto&fechaReporte_description=&outputType=XLS' +
          '&fechaReporte=' + this.fechaCorte.toISOString().split('T')[0];
          break;
        default:
          break;
      }
      const a = document.createElement('a');
      a.href = this.urlReportComplete;
      a.click();
      this.closePop();
      this.fechaCorte = null;
      this.fechaInicio = null;
      this.fechaFinal = null;
    }
  }
}
