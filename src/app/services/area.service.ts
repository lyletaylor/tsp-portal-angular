import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { UuidService } from "./uuid.service";

import { Area } from '../objects/area';

@Injectable()
export class AreaService {
//  private apiUrl = 'api/areas'; mock API url
  private apiUrl = 'api/items/Area';
  private headers = new Headers({
    'Content-Type': 'application/json'
  });

  constructor(
    private http: Http,
    private uuidService: UuidService
  ) { }

  addArea(area: Area): Promise<Area> {
    var obj = area.getRemoteObject();

    console.log("AreaService.addArea: " + JSON.stringify(area));
    return this.uuidService.getUuid()
      .then(uuid => {
        obj["properties"].uuid = uuid;

        return this.http
          .post(this.apiUrl, JSON.stringify(obj), {headers: this.headers})
          .toPromise()
          .then(res => this.getArea(res.json().id))
          .catch(this.handleError);  
      })
      .catch(this.handleError);
  }

  deleteArea(uuid: String): Promise<any> {
    var url = `${this.apiUrl}/${uuid}`;
    return this.http.delete(url)
      .toPromise()
      .then(() => null)
      .catch(this.handleError);
  }

  getArea(uuid: String): Promise<Area> {
    var url = `${this.apiUrl}/${uuid}`;
    return this.http.get(url)
      .toPromise()
      .then(res => new Area(res.json().item))
      .catch(this.handleError);
  }

  getAreas(): Promise<Area[]> {
    return this.http.get(this.apiUrl)
      .toPromise()
      .then(response => response.json().items.map(area => new Area(area)) as Area[])
      .catch(this.handleError);
  }

  updateArea(area: Area): Promise<Area> {
    var url = `${this.apiUrl}/${area.uuid}`;
    return this.http
      .put(url, JSON.stringify(new Area(area as Object).getRemoteObject()), {headers: this.headers})
      .toPromise()
      .then(res => new Area(res.json()))
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occured', error);
    return Promise.reject(error.message || error);
  }

}
