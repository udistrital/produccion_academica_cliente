import { PersonaService } from '../../data/persona.service';
import { Injectable } from '@angular/core';
import { IAppState } from '../app.state';
import { Store } from '@ngrx/store';
import { REDUCER_LIST } from '../reducer.constants';
import { CoreService } from '../../data/core.service';
import { TercerosService } from '../../../@core/data/terceros.service';
import { IdiomaService } from '../../data/idioma.service';
import { UbicacionService } from '../../data/ubicacion.service';
import { EnteService } from '../../data/ente.service';
import { ExperienciaService } from '../../data/experiencia.service';
import { DocumentoProgramaService } from '../../data/documento_programa.service';
import { CIDCService } from '../../data/cidc.service';
@Injectable()
export class ListService {

  constructor(
    private personaService: PersonaService,
    private idiomaService: IdiomaService,
    private coreService: CoreService,
    private tercerosService: TercerosService,
    private ubicacionService: UbicacionService,
    private experienciaService: ExperienciaService,
    private cidcService: CIDCService,
    // private producccionAcademicaService: ProduccionAcademicaService,
    private enteService: EnteService,
    private documentoProgramaService: DocumentoProgramaService,
    private store: Store<IAppState>) {

  }


  public findGenero() {
    this.store.select(REDUCER_LIST.Genero).subscribe(
      (list: any) => {
        if (!list || list.length === 0) {
          this.tercerosService.get('info_complementaria/?query=GrupoInfoComplementariaId.Id:6')
            .subscribe(
              (result: any[]) => {
                this.addList(REDUCER_LIST.Genero, result);
              },
              error => {
                this.addList(REDUCER_LIST.Genero, []);
              },
            );
        }
      },
    );
  }

  public findGrupoSanguineo() {
    this.store.select(REDUCER_LIST.Sanguineo).subscribe(
      (list: any) => {
        if (!list || list.length === 0) {
          this.tercerosService.get('info_complementaria/?query=GrupoInfoComplementariaId.Id:7')
            .subscribe(
              (result: any[]) => {
                this.addList(REDUCER_LIST.Sanguineo, result);
              },
              error => {
                this.addList(REDUCER_LIST.Sanguineo, []);
              },
            );
        }
      },
    );
  }

  public findFactorRh() {
    this.store.select(REDUCER_LIST.RH).subscribe(
      (list: any) => {
        if (!list || list.length === 0) {
          this.tercerosService.get('info_complementaria/?query=GrupoInfoComplementariaId.Id:8')
            .subscribe(
              (result: any[]) => {
                this.addList(REDUCER_LIST.RH, result);
              },
              error => {
                this.addList(REDUCER_LIST.RH, []);
              },
            );
        }
      },
    );
  }

  public findClasificacionNivelIdioma() {
    this.store.select(REDUCER_LIST.ClasificacionNivelIdioma).subscribe(
      (list: any) => {
        if (!list || list.length === 0) {
          this.idiomaService.get('clasificacion_nivel_idioma/?query=Activo:true&limit=0')
            .subscribe(
              (result: any[]) => {
                this.addList(REDUCER_LIST.ClasificacionNivelIdioma, result);
              },
              error => {
                this.addList(REDUCER_LIST.ClasificacionNivelIdioma, []);
              },
            );
        }
      },
    );
  }

  public findEstadoCivil() {
    this.store.select(REDUCER_LIST.EstadoCivil).subscribe(
      (list: any) => {
        if (!list || list.length === 0) {
          this.tercerosService.get('info_complementaria/?query=GrupoInfoComplementariaId.Id:2')
            .subscribe(
              (result: any[]) => {
                this.addList(REDUCER_LIST.EstadoCivil, result);
              },
              error => {
                this.addList(REDUCER_LIST.EstadoCivil, []);
              },
            );
        }
      },
    );
  }

  public findGrupoEtnico() {
    this.store.select(REDUCER_LIST.GrupoEtnico).subscribe(
      (list: any) => {
        if (!list || list.length === 0) {
          this.tercerosService.get('info_complementaria/?query=GrupoInfoComplementariaId.Id:3')
            .subscribe(
              (result: any[]) => {
                this.addList(REDUCER_LIST.GrupoEtnico, result);
              },
              error => {
                this.addList(REDUCER_LIST.GrupoEtnico, []);
              },
            );
        }
      },
    );
  }

  public findIdioma() {
    this.store.select(REDUCER_LIST.Idioma).subscribe(
      (list: any) => {
        if (!list || list.length === 0) {
          this.idiomaService.get('idioma/?query=Activo:true&limit=0')
            .subscribe(
              (result: any[]) => {
                this.addList(REDUCER_LIST.Idioma, result);
              },
              error => {
                this.addList(REDUCER_LIST.Idioma, []);
              },
            );
        }
      },
    );
  }

  public findLineaInvestigacion() {
    this.store.select(REDUCER_LIST.LineaInvestigacion).subscribe(
      (list: any) => {
        if (!list || list.length === 0) {
          // this.coreService.get('linea_investigacion/?query=Activo:true&limit=0')
          this.cidcService.get('research_focus')
            .subscribe(
              (result: any[]) => {
                this.addList(REDUCER_LIST.LineaInvestigacion, result);
              },
              error => {
                this.addList(REDUCER_LIST.LineaInvestigacion, []);
              },
            );
        }
      },
    );
  }

  public findPais() {
    this.store.select(REDUCER_LIST.Pais).subscribe(
      (list: any) => {
        if (!list || list.length === 0) {
          this.ubicacionService.get('lugar/?query=TipoLugar.Nombre:PAIS,Activo:true&limit=0') // TODO: filtrar pais
            .subscribe(
              (result: any[]) => {
                this.addList(REDUCER_LIST.Pais, result);
              },
              error => {
                this.addList(REDUCER_LIST.Pais, []);
              },
            );
        }
      },
    );
  }

  public findCiudad() {
    this.store.select(REDUCER_LIST.Ciudad).subscribe(
      (list: any) => {
        if (!list || list.length === 0) {
          this.ubicacionService.get('lugar/?query=Activo:true&limit=0') // TODO: filtrar ciudad
            .subscribe(
              (result: any[]) => {
                this.addList(REDUCER_LIST.Ciudad, result);
              },
              error => {
                this.addList(REDUCER_LIST.Ciudad, []);
              },
            );
        }
      },
    );
  }

  public findLugar() {
    this.store.select(REDUCER_LIST.Lugar).subscribe(
      (list: any) => {
        if (!list || list.length === 0) {
          this.ubicacionService.get('lugar/?query=Activo:true&limit=0')
            .subscribe(
              (result: any[]) => {
                this.addList(REDUCER_LIST.Lugar, result);
              },
              error => {
                this.addList(REDUCER_LIST.Lugar, []);
              },
            );
        }
      },
    );
  }

  public findNivelIdioma() {
    this.store.select(REDUCER_LIST.NivelIdioma).subscribe(
      (list: any) => {
        if (!list || list.length === 0) {
          this.idiomaService.get('valor_nivel_idioma/?query=Activo:true&limit=0')
            .subscribe(
              (result: any[]) => {
                this.addList(REDUCER_LIST.NivelIdioma, result);
              },
              error => {
                this.addList(REDUCER_LIST.NivelIdioma, []);
              },
            );
        }
      },
    );
  }


  public findTipoContacto() {
    this.store.select(REDUCER_LIST.TipoContacto).subscribe(
      (list: any) => {
        if (!list || list.length === 0) {
          this.enteService.get('tipo_contacto/?query=Activo:true&limit=0')
            .subscribe(
              (result: any[]) => {
                this.addList(REDUCER_LIST.TipoContacto, result);
              },
              error => {
                this.addList(REDUCER_LIST.TipoContacto, []);
              },
            );
        }
      },
    );
  }

  public findTipoDiscapacidad() {
    this.store.select(REDUCER_LIST.TipoDiscapacidad).subscribe(
      (list: any) => {
        if (!list || list.length === 0) {
          this.tercerosService.get('info_complementaria/?query=GrupoInfoComplementariaId.Id:1')
            .subscribe(
              (result: any[]) => {
                this.addList(REDUCER_LIST.TipoDiscapacidad, result);
              },
              error => {
                this.addList(REDUCER_LIST.TipoDiscapacidad, []);
              },
            );
        }
      },
    );
  }

  public findEPS() {
    this.store.select(REDUCER_LIST.EPS).subscribe(
      (list: any) => {
        if (!list || list.length === 0) {
          this.tercerosService.get('tercero_tipo_tercero/?query=TipoTerceroId.Id:3&limit=0')
            .subscribe(
              (result: any[]) => {
                for (let i = 0; i < result.length; i++) {
                  result[i] = result[i]['TerceroId']
                }
                this.addList(REDUCER_LIST.EPS, result);
              },
              error => {
                this.addList(REDUCER_LIST.EPS, []);
              },
            );
        }
      },
    );
  }

  public findTipoLugar() {
    this.store.select(REDUCER_LIST.TipoLugar).subscribe(
      (list: any) => {
        if (!list || list.length === 0) {
          this.ubicacionService.get('tipo_lugar/?query=Activo:true&limit=0')
            .subscribe(
              (result: any[]) => {
                this.addList(REDUCER_LIST.TipoLugar, result);
              },
              error => {
                this.addList(REDUCER_LIST.TipoLugar, []);
              },
            );
        }
      },
    );
  }

  public findTipoIdentificacion() {
    this.store.select(REDUCER_LIST.TipoIdentificacion).subscribe(
      (list: any) => {
        if (!list || list.length === 0) {
          this.tercerosService.get('tipo_documento/?query=Activo:true&limit=0')
            .subscribe(
              (result: any[]) => {
                this.addList(REDUCER_LIST.TipoIdentificacion, result);
              },
              error => {
                this.addList(REDUCER_LIST.TipoIdentificacion, []);
              },
            );
        }
      },
    );
  }

  public findGrupoInvestigacion() {
    this.store.select(REDUCER_LIST.GrupoInvestigacion).subscribe(
      (list: any) => {
        if (!list || list.length === 0) {
          // this.coreService.get('grupo_investigacion/?query=Activo:true&limit=0')
          this.cidcService.get('research_group')
            .subscribe(
              (result: any[]) => {
                this.addList(REDUCER_LIST.GrupoInvestigacion, result);
              },
              error => {
                this.addList(REDUCER_LIST.GrupoInvestigacion, []);
              },
            );
        }
      },
    );
  }

  public findPeriodoAcademico() {
    this.store.select(REDUCER_LIST.PeriodoAcademico).subscribe(
      (list: any) => {
        if (!list || list.length === 0) {
          this.coreService.get('periodo/?query=Activo:true&limit=0')
            .subscribe(
              (result: any[]) => {
                console.info('Entro')
                console.info(result)
                this.addList(REDUCER_LIST.PeriodoAcademico, result);
              },
              error => {
                this.addList(REDUCER_LIST.PeriodoAcademico, []);
              },
            );
        }
      },
    );
  }

  public findLocalidadesBogota() {
    this.store.select(REDUCER_LIST.LocalidadesBogota).subscribe(
      (list: any) => {
        if (!list || list.length === 0) {
          this.ubicacionService.get('lugar?limit=0&query=TipoLugar__Id:3')
            .subscribe(
              (result: any[]) => {
                this.addList(REDUCER_LIST.LocalidadesBogota, result);
              },
              error => {
                this.addList(REDUCER_LIST.LocalidadesBogota, []);
              },
            );
        }
      },
    );
  }

  public findTipoColegio() {
    this.store.select(REDUCER_LIST.TipoColegio).subscribe(
      (list: any) => {
        if (!list || list.length === 0) {
          this.tercerosService.get('info_complementaria?limit=0&query=GrupoInfoComplementariaId__CodigoAbreviacion:Grupo_13')
            .subscribe(
              (result: any[]) => {
                this.addList(REDUCER_LIST.TipoColegio, result);
              },
              error => {
                this.addList(REDUCER_LIST.TipoColegio, []);
              },
            );
        }
      },
    );
  }

  public findSemestresSinEstudiar() {
    this.store.select(REDUCER_LIST.SemestresSinEstudiar).subscribe(
      (list: any) => {
        if (!list || list.length === 0) {
          this.tercerosService.get('info_complementaria?limit=0&query=GrupoInfoComplementariaId__CodigoAbreviacion:Grupo_14')
            .subscribe(
              (result: any[]) => {
                this.addList(REDUCER_LIST.SemestresSinEstudiar, result);
              },
              error => {
                this.addList(REDUCER_LIST.SemestresSinEstudiar, []);
              },
            );
        }
      },
    );
  }

  public findMediosEnteroUniversidad() {
    this.store.select(REDUCER_LIST.MediosEnteroUniversidad).subscribe(
      (list: any) => {
        if (!list || list.length === 0) {
          this.tercerosService.get('info_complementaria?limit=0&query=GrupoInfoComplementariaId__CodigoAbreviacion:Grupo_12')
            .subscribe(
              (result: any[]) => {
                this.addList(REDUCER_LIST.MediosEnteroUniversidad, result);
              },
              error => {
                this.addList(REDUCER_LIST.MediosEnteroUniversidad, []);
              },
            );
        }
      },
    );
  }

  public findSePresentaAUniversidadPor() {
    this.store.select(REDUCER_LIST.SePresentaAUniversidadPor).subscribe(
      (list: any) => {
        if (!list || list.length === 0) {
          this.tercerosService.get('info_complementaria?limit=0&query=GrupoInfoComplementariaId__CodigoAbreviacion:Grupo_15')
            .subscribe(
              (result: any[]) => {
                this.addList(REDUCER_LIST.SePresentaAUniversidadPor, result);
              },
              error => {
                this.addList(REDUCER_LIST.SePresentaAUniversidadPor, []);
              },
            );
        }
      },
    );
  }

  public findTipoInscripcionUniversidad() {
    this.store.select(REDUCER_LIST.TipoInscripcionUniversidad).subscribe(
      (list: any) => {
        if (!list || list.length === 0) {
          this.tercerosService.get('info_complementaria?limit=0&query=GrupoInfoComplementariaId__CodigoAbreviacion:Grupo_16')
            .subscribe(
              (result: any[]) => {
                this.addList(REDUCER_LIST.TipoInscripcionUniversidad, result);
              },
              error => {
                this.addList(REDUCER_LIST.TipoInscripcionUniversidad, []);
              },
            );
        }
      },
    );
  }

  public findTipoDedicacion() {
    this.store.select(REDUCER_LIST.TipoDedicacion).subscribe(
      (list: any) => {
        if (!list || list.length === 0) {
          this.experienciaService.get('tipo_dedicacion/?limit=0&query=Activo:true')
            .subscribe(
              (result: any[]) => {
                this.addList(REDUCER_LIST.TipoDedicacion, result);
              },
              error => {
                this.addList(REDUCER_LIST.TipoDedicacion, []);
              },
            );
        }
      },
    );
  }

  public findTipoVinculacion() {
    this.store.select(REDUCER_LIST.TipoVinculacion).subscribe(
      (list: any) => {
        if (!list || list.length === 0) {
          this.experienciaService.get('tipo_vinculacion/?limit=0&query=Activo:true')
            .subscribe(
              (result: any[]) => {
                this.addList(REDUCER_LIST.TipoVinculacion, result);
              },
              error => {
                this.addList(REDUCER_LIST.TipoVinculacion, []);
              },
            );
        }
      },
    );
  }

  public findTipoOrganizacion() {
    this.store.select(REDUCER_LIST.TipoOrganizacion).subscribe(
      (list: any) => {
        if (!list || list.length === 0) {
          this.tercerosService.get('tipo_tercero/?limit=0&query=Activo:true')
            .subscribe(
              (result: any[]) => {
                this.addList(REDUCER_LIST.TipoOrganizacion, result);
              },
              error => {
                this.addList(REDUCER_LIST.TipoOrganizacion, []);
              },
            );
        }
      },
    );
  }

  public findCargo() {
    this.store.select(REDUCER_LIST.Cargo).subscribe(
      (list: any) => {
        if (!list || list.length === 0) {
          this.experienciaService.get('cargo/?limit=0&query=Activo:true')
            .subscribe(
              (result: any[]) => {
                this.addList(REDUCER_LIST.Cargo, result);
              },
              error => {
                this.addList(REDUCER_LIST.Cargo, []);
              },
            );
        }
      },
    );
  }

  public findDocumentoPrograma() {
    this.store.select(REDUCER_LIST.DocumentoPrograma).subscribe(
      (list: any) => {
        if (!list || list.length === 0) {
          this.documentoProgramaService.get('documento_programa/?limit=0&query=Activo:true')
            .subscribe(
              (result: any[]) => {
                this.addList(REDUCER_LIST.DocumentoPrograma, result);
              },
              error => {
                this.addList(REDUCER_LIST.DocumentoPrograma, []);
              },
            );
        }
      },
    );
  }

  private addList(type: string, object: Array<any>) {
    this.store.dispatch({
      type: type,
      payload: object,
    });
  }
}
