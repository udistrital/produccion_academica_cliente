import { ProduccionAcademicaPost } from '../produccion_academica/produccion_academica';
import { EstadoTipoSolicitud } from './estado_tipo_solicitud';

export class SolicitudDocentePost {
  ProduccionAcademica: ProduccionAcademicaPost
  Referencia: any;
  EstadoTipoSolicitudId: EstadoTipoSolicitud;
  Autores: any[];
  Observaciones: any[];
}
