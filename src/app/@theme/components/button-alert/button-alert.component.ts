import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'button-alert',
  templateUrl: './button-alert.component.html',
  styleUrls: ['./button-alert.component.scss'],
})
export class ButtonAlertComponent implements ViewCell, OnInit {

  date: Date;
  isExpired: boolean;

  @Input() value: string | number;
  @Input() rowData: any;

  @Output() save: EventEmitter<any> = new EventEmitter();

  constructor(private translate: TranslateService) { this.date = new Date(); }

  ngOnInit() {
    if (this.rowData.EvolucionEstado.length > 0) {
      const expDate = this.rowData.EvolucionEstado[this.rowData.EvolucionEstado.length - 1].FechaLimite;
      const year = expDate.substring(0, 4);
      const month = (parseInt(expDate.substring(5, 7), 10) - 1) + '';
      const day = (parseInt(expDate.substring(8, 10), 10) + 1) + '';
      if (this.rowData.EstadoTipoSolicitudId.EstadoId.Id !== 9)
        this.isExpired = this.calculateDate(year, month, day);
      else
        this.isExpired = false;
    } else
      this.isExpired = false;
  }

  calculateDate(year, month, day) {
    const expDate = new Date(year, month, day);
    const result = expDate.getTime() - this.date.getTime();
    if (result < 0) return true;
    return false;
  }

  showAlertExpDate() {
    const opt: any = {
      width: '550px',
      title: this.translate.instant('produccion_academica.alerta'),
      text: this.translate.instant('produccion_academica.alerta_fecha_expirada'),
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    };
    Swal(opt)
  }

  onClick() {
    this.save.emit(this.rowData);
  }
}
