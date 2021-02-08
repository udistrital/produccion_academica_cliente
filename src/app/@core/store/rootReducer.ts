import { IAppState } from './app.state';
import { ActionReducerMap } from '@ngrx/store';
import { ListReducer } from './reducers/list.reducer';

export const rootReducer: ActionReducerMap<IAppState> = {
  listGenero: ListReducer.ListReducerGenero,
  listGrupoSanguineo: ListReducer.ListReducerGrupoSanguineo,
  listFactorRh: ListReducer.ListReducerFactorRH,
  listEPS: ListReducer.ListReducerEPS,
  listICFES: ListReducer.ListReducerTipoICFES,
  listEstadoCivil: ListReducer.ListReducerEstadoCivil,
  listGrupoEtnico: ListReducer.ListReducerGrupoEtnico,
  listTipoContacto: ListReducer.ListReducerTipoContacto,
  listTipoDiscapacidad: ListReducer.ListReducerTipoDiscapacidad,
  listTipoIdentificacion: ListReducer.ListReducerTipoIdentificacion,
  listLocalidadesBogota: ListReducer.ListReducerLocalidadesBogota,
  listTipoColegio: ListReducer.ListReducerTipoColegio,
  listSemestresSinEstudiar: ListReducer.ListReducerSemestresSinEstudiar,
  listMediosEnteroUniversidad: ListReducer.ListReducerMediosEnteroUniversidad,
  listSePresentaAUniversidadPor: ListReducer.ListReducerSePresentaAUniversidadPor,
  listTipoInscripcionUniversidad: ListReducer.ListReducerTipoInscripcionUniversidad,
  listTipoDedicacion: ListReducer.ListReducerTipoDedicacion,
  listTipoVinculacion: ListReducer.ListReducerTipoVinculacion,
  listCargo: ListReducer.ListReducerCargo,
  listTipoOrganizacion: ListReducer.ListReducerTipoOrganizacion,
  listDocumentoPrograma: ListReducer.ListReducerDocumentoPrograma,
  listDescuentoDependencia: ListReducer.ListReducerDescuentoDependencia,
}
