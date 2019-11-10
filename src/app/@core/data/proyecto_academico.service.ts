import { Injectable } from '@angular/core';
import { RequestManager } from '../../managers/requestManager';

@Injectable({
  providedIn: 'root',
})

export class ProyectoAcademicoService {

  constructor(private requestManager: RequestManager) {
    this.requestManager.setPath('PROYECTO_ACADEMICO_SERVICE');
  }

  get(endpoint) {
    return this.requestManager.get(endpoint);
  }

  post(endpoint, element) {
    return this.requestManager.post(endpoint, element);
  }

  put(endpoint, element) {
    return this.requestManager.put(endpoint, element);
  }

  delete(endpoint, element) {
    return this.requestManager.delete(endpoint, element.Id);
  }
}
