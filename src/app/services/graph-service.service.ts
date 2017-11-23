import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class GraphService {
//  private apiUrl = 'api/areas'; mock API url
  private apiUrl = 'api/items';
  private headers = new Headers({
    'Content-Type': 'application/json'
  });

  constructor(private http: Http) { }

  addItem(itemType: string, item: Object): Promise<Object> {
    var url = `${this.apiUrl}/${itemType}`
    return this.http
      .post(url, JSON.stringify(item), {headers: this.headers})
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  deleteItem(itemType: string, id: number): Promise<any> {
    var url = `${this.apiUrl}/${itemType}/${id}`;
    return this.http.delete(url)
      .toPromise()
      .then(() => null)
      .catch(this.handleError);
  }

  getItem(itemType: string, id: number): Promise<Object> {
    var url = `${this.apiUrl}/${itemType}/${id}`;
    return this.http.get(url)
      .toPromise()
      .then((res) => res.json())
      .catch(this.handleError);
  }

  getItems(itemType: string): Promise<Object[]> {
    var url = `${this.apiUrl}/${itemType}`
    return this.http.get(url)
      .toPromise()
      .then(response => response.json().items)
      .catch(this.handleError);
  }

  updateItem(itemType: string, item: Object): Promise<Object> {
    var url = `${this.apiUrl}/${itemType}/${item["id"]}`;
    console.log("Update URL: " + url);
    return this.http
      .put(url, JSON.stringify(item), {headers: this.headers})
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occured', error);
    return Promise.reject(error.message || error);
  }
}
