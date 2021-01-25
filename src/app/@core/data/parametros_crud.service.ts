import { Injectable } from '@angular/core';
import {RequestManager} from '../../managers/requestManager';

@Injectable({
  providedIn: 'root',
})
export class ParametrosCrudService {
  constructor(private requestManager: RequestManager) {
    this.requestManager.setPath('PARAMETROS_CRUD_SERVICE');
  }

  get(endpoint) {
    this.requestManager.setPath('PARAMETROS_CRUD_SERVICE');
    return this.requestManager.get(endpoint);
  }

  post(endpoint, element) {
    this.requestManager.setPath('PARAMETROS_CRUD_SERVICE');
    return this.requestManager.post(endpoint, element);
  }

  put(endpoint, element) {
    this.requestManager.setPath('PARAMETROS_CRUD_SERVICE');
    return this.requestManager.put(endpoint, element);
  }

  delete(endpoint, element) {
    this.requestManager.setPath('PARAMETROS_CRUD_SERVICE');
    return this.requestManager.delete(endpoint, element.Id);
  }
}
