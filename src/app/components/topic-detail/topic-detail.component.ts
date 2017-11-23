import { Component, Input, Output, OnInit, OnChanges, EventEmitter } from '@angular/core';

//import { TopicService } from '../../services/topic.service';

import { Topic } from '../../objects/topic'

@Component({
  selector: 'app-topic',
  templateUrl: './topic-detail.component.html',
  styleUrls: ['./topic-detail.component.css']
})
export class TopicDetailComponent implements OnInit, OnChanges {
  @Input() topic: Topic;
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();
  @Output() save: EventEmitter<Topic> = new EventEmitter<Topic>();
  @Output() delete: EventEmitter<Topic> = new EventEmitter<Topic>();

  constructor(
//    private topicService: TopicService
  ) { }

  ngOnInit() {
  }

  ngOnChanges() {
    //  console.log("TopicDetail prop changed: topic: " + JSON.stringify(this.topic));    
  }

  hasId(): boolean {
    return this.topic.id != null && typeof this.topic.id != undefined;
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onSave(): void {
    // console.log("TopicDetail.onSave: " + JSON.stringify(topic));
    this.save.emit(this.topic);
  }

  onDelete(): void {
    this.delete.emit(this.topic);
  }
}
