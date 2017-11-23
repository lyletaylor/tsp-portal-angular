import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

//import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';

import { GraphService } from '../../services/graph-service.service';

import { Area } from '../../objects/area'

const ActiveAreas = gql`
  query ActiveAreas {
    Area {
      uuid
      name
    }
  }
`;

interface QueryResponse{
  Area
  loading
}

@Component({
  selector: 'app-areas-editor',
  templateUrl: './areas-editor.component.html',
  styleUrls: ['./areas-editor.component.css']
})
export class AreasEditorComponent implements OnInit {
  private itemType = "Area";

  areas: Area[] = [];
  selectedArea: Area;
  data: any;
  createNewState: boolean = false;

  constructor(
    private graphService: GraphService,
    private apollo: Apollo
  ) { }

  ngOnInit() {
//     this.apollo.watchQuery<QueryResponse>({
//       query: ActiveAreas
//     }).subscribe(({data}) => {
//       alert(JSON.stringify(data));
// //      this.loading = data.loading;
//       this.data = data.Area;
//     });    
     this.getAreas();
  }

  areaSort(a: Area, b: Area) {
    return a.name.localeCompare(b.name);
  }

  createNew(): void {
    this.selectedArea = null; //{ properties: {name: '', description: '', status: "Active"} } as Area;
    this.createNewState = true;
  }

  getAreas(): void {
    //this.graphService.getItems(this.itemType).then(areas => this.areas = areas as Area[]);
    this.apollo.query({query: ActiveAreas})
      .toPromise()
      .then(result => {console.log(JSON.stringify(result.data["Area"], null, 2)); this.areas = result.data["Area"].slice() as Area[];})
      .catch(err => console.log(err));
  };

  getSelectedArea(): string {
    return this.selectedArea ? this.selectedArea.uuid : null;
  }

  isSelectedArea(area) {
    return this.selectedArea && area.uuid == this.selectedArea.uuid;
  }

  selectArea(area: Area) {
    this.selectedArea = area;
    this.createNewState = false;
  }

  onCancel(): void {
    this.selectedArea = null;
    this.createNewState = false;
  }

  onDelete(area: Area): void {
    this.selectedArea = null;
    this.createNewState = false;
    this.removeFromApolloCache(area);
    this.getAreas();
  }

  onSave(area: Area): void {
    if (this.createNewState) {
      this.selectedArea = area;
      this.createNewState = false;
    }
    this.updateApolloCache(area);
    this.getAreas();      
  }

  updateApolloCache(area: Area) : void {
    const data = this.apollo.getClient()
      .readQuery({query: ActiveAreas});

    let items = data["Area"].filter(item => item.uuid != area.uuid);

    var elem =  {
      uuid: area.uuid,
      name: area.name,
      __typename: "Area"
    };

    this.apollo.getClient().writeQuery({
      query: ActiveAreas,
      data: {
        Area: [...items, elem],
      },
    });
  }

  removeFromApolloCache(area: Area) : void {
    const data = this.apollo.getClient().readQuery({query: ActiveAreas});
    this.apollo.getClient().writeQuery({
      query: ActiveAreas,
      data: {
        Area: data["Area"].filter(item => item.uuid != area.uuid),
      },
    });
  }
}
