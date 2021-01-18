import { Injectable } from '@angular/core';
import { RequestManager } from '../../managers/requestManager';

@Injectable({
  providedIn: 'root',
})
export class EvaluacionDocenteService {
  constructor(private requestManager: RequestManager) {
    this.requestManager.setPath('EVALUACION_DOCENTE_SERVICE');
  }
  get(endpoint) {
    this.requestManager.setPath('EVALUACION_DOCENTE_SERVICE');
    return this.requestManager.get(endpoint);
  }
  post(endpoint, element) {
    this.requestManager.setPath('EVALUACION_DOCENTE_SERVICE');
    return this.requestManager.post(endpoint, element);
  }
  put(endpoint, element) {
    this.requestManager.setPath('EVALUACION_DOCENTE_SERVICE');
    return this.requestManager.put(endpoint, element);
  }
  delete(endpoint, element) {
    this.requestManager.setPath('EVALUACION_DOCENTE_SERVICE');
    return this.requestManager.delete(endpoint, element.Id);
  }
}
