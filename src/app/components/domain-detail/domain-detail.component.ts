import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';

import { Domain } from '../../objects/domain';

@Component({
  selector: 'app-domain',
  templateUrl: './domain-detail.component.html',
  styleUrls: ['./domain-detail.component.css']
})
export class DomainDetailComponent implements OnInit {
  @Input() domain: Domain;
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();
  @Output() save: EventEmitter<Domain> = new EventEmitter<Domain>();
  @Output() delete: EventEmitter<Domain> = new EventEmitter<Domain>();

  constructor() { }

  ngOnInit() {
  }

  hasId(): boolean {
    return this.domain.id != null && typeof this.domain.id != undefined;
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onSave(): void {
    // console.log("AreaDetail.onSave: " + JSON.stringify(area));
    this.save.emit(this.domain);
  }

  onDelete(): void {
    this.delete.emit(this.domain);
  }

}
