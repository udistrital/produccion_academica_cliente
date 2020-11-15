import { TipoLugar } from '../data/models/lugar/tipo_lugar';
import { TipoDiscapacidad } from '../data/models/informacion/tipo_discapacidad';
import { TipoContacto } from '../data/models/informacion/tipo_contacto';
import { NivelIdioma } from '../data/models/idioma/nivel_idioma';
import { Lugar } from '../data/models/lugar/lugar';
import { Idioma } from '../data/models/idioma/idioma';
import { GrupoEtnico } from '../data/models/informacion/grupo_etnico';
import { EstadoCivil } from '../data/models/informacion/estado_civil';
import { ClasificacionNivelIdioma } from '../data/models/idioma/clasificacion_idioma';
import { Genero } from '../data/models/informacion/genero';
import { TipoIdentificacion } from '../data/models/informacion/tipo_identificacion';
import { InfoComplementaria } from '../data/models/terceros/info_complementaria';
// import { TipoPublicacionLibro } from '../data/models/tipo_publicacion_libro';

export interface IAppState {
  listGenero: Genero[],
  listClasificacionNivelIdioma: ClasificacionNivelIdioma[],
  listEstadoCivil: EstadoCivil[],
  listGrupoSanguineo: Genero[] ,
  listFactorRh: Genero [],
  listICFES: Genero [],
  listEPS: Genero [],
  listGrupoEtnico: GrupoEtnico[],
  listIdioma: Idioma[],
  listPais: Lugar[],
  listCiudad: Lugar[],
  listLugar: Lugar[],
  listNivelIdioma: NivelIdioma[],
  listTipoContacto: TipoContacto[],
  listTipoDiscapacidad: TipoDiscapacidad[],
  listTipoLugar: TipoLugar[],
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
