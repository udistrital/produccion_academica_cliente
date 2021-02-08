import { TipoDiscapacidad } from '../data/models/informacion/tipo_discapacidad';
import { TipoContacto } from '../data/models/informacion/tipo_contacto';
import { GrupoEtnico } from '../data/models/informacion/grupo_etnico';
import { EstadoCivil } from '../data/models/informacion/estado_civil';
import { Genero } from '../data/models/informacion/genero';
import { TipoIdentificacion } from '../data/models/informacion/tipo_identificacion';
import { InfoComplementaria } from '../data/models/terceros/info_complementaria';
// import { TipoPublicacionLibro } from '../data/models/tipo_publicacion_libro';

export interface IAppState {
  listGenero: Genero[],
  listEstadoCivil: EstadoCivil[],
  listGrupoSanguineo: Genero[] ,
  listFactorRh: Genero [],
  listICFES: Genero [],
  listEPS: Genero [],
  listGrupoEtnico: GrupoEtnico[],
  listTipoContacto: TipoContacto[],
  listTipoDiscapacidad: TipoDiscapacidad[],
  listTipoIdentificacion: TipoIdentificacion[],
  listLocalidadesBogota: InfoComplementaria[],
  listTipoColegio: InfoComplementaria[],
  listSemestresSinEstudiar: InfoComplementaria[],
  listMediosEnteroUniversidad: InfoComplementaria[],
  listSePresentaAUniversidadPor: InfoComplementaria[],
  listTipoInscripcionUniversidad: InfoComplementaria[],
  listTipoDedicacion: InfoComplementaria[],
  listTipoVinculacion: InfoComplementaria[],
  listCargo: InfoComplementaria[],
  listTipoOrganizacion: InfoComplementaria[],
  listDocumentoPrograma: any[],
  listDescuentoDependencia: any[],
  // listTipoPublicacionLibro: TipoPublicacionLibro[],
}
