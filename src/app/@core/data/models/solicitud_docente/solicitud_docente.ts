import { ProduccionAcademicaPost } from '../produccion_academica/produccion_academica';
import { EstadoTipoSolicitud } from './estado_tipo_solicitud';
import { Observacion } from './observacion';

export class SolicitudDocentePost {
  Id: number;
  ProduccionAcademica: ProduccionAcademicaPost;
  Referencia: any;
  FechaRadicacion: string;
  EstadoTipoSolicitudId: EstadoTipoSolicitud;
  EvolucionEstado: any[];
  Autores: any[];
  Observaciones: Observacion[];
  Invitaciones: any[];
  TerceroId: number;
  Solicitantes: any[];
}
