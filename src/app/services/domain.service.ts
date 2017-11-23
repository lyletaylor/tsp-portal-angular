import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Domain } from '../objects/domain';

@Injectable()
export class DomainService {
  //private apiUrl = 'api/domains'; Mock web api
  private apiUrl = 'api/items/Domain';
  private headers = new Headers({
    'Content-Type': 'application/json'
  });

  constructor(private http: Http) { }

  addDomain(domain: Domain): Promise<Domain> {
    console.log("DomainService.addDomain: " + JSON.stringify(domain));
    return this.http
      .post(this.apiUrl, JSON.stringify(domain), {headers: this.headers})
      .toPromise()
      .then(res => res.json() as Domain)
      .catch(this.handleError);
  }

  deleteDomain(id: number): Promise<any> {
    var url = `${this.apiUrl}/${id}`;
    return this.http.delete(url)
      .toPromise()
      .then(() => null)
      .catch(this.handleError);
  }

  getDomain(id: number): Promise<Domain> {
    var url = `${this.apiUrl}/${id}`;
    return this.http.get(url)
      .toPromise()
      .then((res) => res.json() as Domain)
      .catch(this.handleError);
  }

  getDomains(): Promise<Domain[]> {
    return this.http.get(this.apiUrl)
      .toPromise()
      .then(response => response.json().items as Domain[])
      .catch(this.handleError);
  }

  updateDomain(domain: Domain): Promise<Domain> {
    var url = `${this.apiUrl}/${domain.id}`;
    return this.http
      .put(this.apiUrl, JSON.stringify(domain), {headers: this.headers})
      .toPromise()
      .then(res => res.json() as Domain)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occured', error);
    return Promise.reject(error.message || error);
  }

}
