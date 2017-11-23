import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class UuidService {
  private apiUrl = 'api/uuid';
//  private apiUrl = 'api/topics'; Mock API URL
  private headers = new Headers({
    'Content-Type': 'application/json'
  });

  constructor(private http: Http) { }

  getUuid(): Promise<String> {
    return this.http.get(this.apiUrl)
      .toPromise()
      .then((res) => res.json().data[0])
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occured', error);
    return Promise.reject(error.message || error);
  }

}
