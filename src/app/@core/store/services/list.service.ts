import { Injectable } from '@angular/core';
import { IAppState } from '../app.state';
import { Store } from '@ngrx/store';
import { REDUCER_LIST } from '../reducer.constants';
import { TercerosService } from '../../../@core/data/terceros.service';
@Injectable()
export class ListService {

  constructor(
    private tercerosService: TercerosService,
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

  private addList(type: string, object: Array<any>) {
    this.store.dispatch({
      type: type,
      payload: object,
    });
  }
}
