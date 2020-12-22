import { EstadoTipoSolicitud } from "./estado_tipo_solicitud";
import { SolicitudDocentePost } from "./solicitud_docente";

export class PaqueteSolicitudPost {
  Nombre: string;
  NumeroComite: string;
  FechaComite: string;
  Solicitudes: SolicitudDocentePost[];
  EstadoTipoSolicitudId: EstadoTipoSolicitud;
}