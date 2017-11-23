import { Component, OnInit } from '@angular/core';

import 'rxjs/add/operator/switchMap';

import { GraphService } from '../../services/graph-service.service';

import { Topic } from '../../objects/topic'

@Component({
  selector: 'app-topics-editor',
  templateUrl: './topics-editor.component.html',
  styleUrls: ['./topics-editor.component.css']
})
export class TopicsEditorComponent implements OnInit {
  private itemType = "Topic";

  topics: Topic[] = [];
  selectedTopic: Topic;

  constructor(
    private graphService: GraphService
  ) { }

  ngOnInit() {
    this.getTopics();
  }

  topicSort(a: Topic, b: Topic) {
    return a.properties.name.localeCompare(b.properties.name);
  }

  createNew(): void {
    this.selectedTopic = { properties: {name: '', description: '', status: "Active" } } as Topic;
  }

  getTopics(): void {
    // this.topicService.getTopics().then(topics => this.topics = topics);
    this.graphService.getItems(this.itemType).then(topics => this.topics = topics as Topic[]);
  };

  getSelectedTopic(): Topic {
    return this.selectedTopic;
  //  return this.selectedTopic ? { ... this.selectedTopic } : null;
  }

  onCancel(): void {
    this.selectedTopic = null as Topic;;
  }

  onDelete(topic: Topic): void {
    this.selectedTopic = null;
    this.graphService.deleteItem(this.itemType, topic.id)
    .then(() => this.getTopics())
    .catch(err => alert("err: " + err));
  }

  onSave(topic: Topic): void {
    if (topic.id != null && typeof topic.id != 'undefined') {
      this.graphService.updateItem(this.itemType, topic)
      .then(() => this.getTopics())
      .catch(err => alert("err: " + err));
    } else {
      // console.log("TopicsEditor.onSave: " + JSON.stringify(topic));
      this.graphService.addItem(this.itemType, topic)
        .then(() => this.getTopics())
        .catch(err => alert("err: " + err));
    }
    this.selectedTopic = null;
  }

  select(topic: Topic) {
    this.selectedTopic = topic;
  }
}
