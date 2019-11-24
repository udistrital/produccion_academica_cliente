import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../../environments/environment';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RequestManager } from '../../managers/requestManager';

const httpOptions = {
    headers: new HttpHeaders({
        'Accept': 'application/json',
    }),
}

const path = environment.DOCUMENTO_SERVICE;

@Injectable()
export class DocumentoService {
    constructor(private requestManager: RequestManager) {
        this.requestManager.setPath('DOCUMENTO_SERVICE');
      }
      get(endpoint) {
        this.requestManager.setPath('DOCUMENTO_SERVICE');
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
