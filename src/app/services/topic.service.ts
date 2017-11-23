import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Topic } from '../objects/topic';

@Injectable()
export class TopicService {
  private apiUrl = 'api/items/Topic';
//  private apiUrl = 'api/topics'; Mock API URL
  private headers = new Headers({
    'Content-Type': 'application/json'
  });

  constructor(private http: Http) { }

  addTopic(topic: Topic): Promise<Topic> {
    console.log("TopicService.addTopic: " + JSON.stringify(topic));
    return this.http
      .post(this.apiUrl, JSON.stringify(topic), {headers: this.headers})
      .toPromise()
      .then(res => res.json() as Topic)
      .catch(this.handleError);
  }

  deleteTopic(id: number): Promise<any> {
    var url = `${this.apiUrl}/${id}`;
    return this.http.delete(url)
      .toPromise()
      .then(() => null)
      .catch(this.handleError);
  }

  getTopic(id: number): Promise<Topic> {
    var url = `${this.apiUrl}/${id}`;
    return this.http.get(url)
      .toPromise()
      .then((res) => res.json() as Topic)
      .catch(this.handleError);
  }

  getTopics(): Promise<Topic[]> {
    return this.http.get(this.apiUrl)
      .toPromise()
      .then(response => response.json().items as Topic[])
      .catch(this.handleError);
  }

  updateTopic(topic: Topic): Promise<Topic> {
    var url = `${this.apiUrl}/${topic.id}`;
    return this.http
      .put(this.apiUrl, JSON.stringify(topic), {headers: this.headers})
      .toPromise()
      .then(res => res.json() as Topic)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occured', error);
    return Promise.reject(error.message || error);
  }

}
