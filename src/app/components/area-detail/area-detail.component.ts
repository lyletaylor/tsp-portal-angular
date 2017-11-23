import { Component, Input, Output, OnInit, OnChanges, EventEmitter } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

import { AreaService } from '../../services/area.service';

import { Area } from '../../objects/area'


@Component({
  selector: 'app-area',
  templateUrl: './area-detail.component.html',
  styleUrls: ['./area-detail.component.css']
})
export class AreaDetailComponent implements OnInit, OnChanges {
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();
  @Output() save: EventEmitter<Area> = new EventEmitter<Area>();
  @Output() delete: EventEmitter<Area> = new EventEmitter<Area>();

  @Input() 
  set areaId(uuid: string) {
    if (uuid) {
      this.getArea(uuid);
    } else {
      this.area = new Area({});
    }
  }
  
  area: Area = new Area({});

  constructor(
    //private graphService: GraphService,
    private apollo: Apollo,
    private areaService: AreaService
  ) { }

  ngOnInit() {
  }

  ngOnChanges() {
    //  console.log("AreaDetail prop changed: area: " + JSON.stringify(this.area));    
  }

  getArea(uuid): void {
    this.apollo.query({query: gql`
    query { Area(uuid: "${uuid}") { _id, uuid, name, description, status } }`})
    .toPromise()
    .then(result => {
      // We need a copy of the object, beacuse the value returned from Apollo is read-only
      this.area = { ...result.data["Area"][0] } as Area;
    })
    // TODO Handle error if getting Area
    .catch(err => console.log(err));
};

  hasId(): boolean {
    return this.area.uuid != null && typeof this.area.uuid != undefined;
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onSave(): void {
    // console.log("AreaDetail.onSave: " + JSON.stringify(area));
    if (this.area.uuid) {
      this.areaService.updateArea(this.area)
        .then(area => this.save.emit(this.area))
        .catch(err => console.log(err));        
        
      // this.apollo.query({query: gql`
      // mutation { updateArea(uuid: "${this.area.uuid}" name: "${this.area.name}" description:${this.area.description} status:${this.area.status}) {
      //   Area { _id uuid name description status }
      // } }`})
      // .toPromise()
      // .then(result => {
      //   console.log(result);
      //   return;
      //   // We need a copy of the object, beacuse the value returned from Apollo is read-only
      //   // this.area = { ...result.data["Area"][0] } as Area;
      // })
      // TODO Handle error if getting Area
      // .catch(err => console.log(err));        
    } else {
      this.areaService.addArea(this.area)
      .then(area => {
        this.area = area;
        this.save.emit(this.area);
      })
    }
    //this.save.emit(this.area);
  }

  onDelete(): void {
    this.areaService.deleteArea(this.area.uuid)
    .then(() => this.delete.emit(this.area));
  }
}
