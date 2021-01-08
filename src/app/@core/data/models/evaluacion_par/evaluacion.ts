import { TipoEvaluacion } from './tipo_evaluacion';

export class EvaluacionDocentePost {
  id: string;
  tipo_evaluacion_id: TipoEvaluacion;
  nombre: string;
  descripcion: string;
  estructura_evaluacion: any;
  resultado: any;
  estado: any;
  respuestas_por_fecha: any[];
}
