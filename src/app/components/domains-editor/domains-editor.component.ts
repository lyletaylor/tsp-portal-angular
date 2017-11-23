import { Component, OnInit } from '@angular/core';

import 'rxjs/add/operator/switchMap';

import { GraphService } from '../../services/graph-service.service';

import { Domain } from '../../objects/domain'

@Component({
  selector: 'app-domains-editor',
  templateUrl: './domains-editor.component.html',
  styleUrls: ['./domains-editor.component.css']
})
export class DomainsEditorComponent implements OnInit {
  private itemType = 'Domain';

  domains: Domain[] = [];
  selectedDomain: Domain;

  constructor(
    private graphService: GraphService
  ) { }

  ngOnInit() {
    this.getDomains();
  }

  domainSort(a: Domain, b: Domain) {
    return a.properties.name.localeCompare(b.properties.name);
  }

  createNew(): void {
    this.selectedDomain = { properties: {name: '', description: '', status: "Active"} } as Domain;
  }

  getDomains(): void {
    this.graphService.getItems(this.itemType).then(domains => this.domains = domains as Domain[]);
  };

  getSelectedDomain(): Domain {
    return this.selectedDomain;
  //  return this.selectedDomain ? { ... this.selectedDomain } : null;
  }

  onCancel(): void {
    this.selectedDomain = null as Domain;;
  }

  onDelete(domain: Domain): void {
    this.selectedDomain = null;
    this.graphService.deleteItem(this.itemType, domain.id)
    .then(() => this.getDomains())
    .catch(err => alert("err: " + err));
  }

  onSave(domain: Domain): void {
    if (domain.id != null && typeof domain.id != 'undefined') {
      this.graphService.updateItem(this.itemType, domain)
      .then(() => this.getDomains())
      .catch(err => alert("err: " + err));
    } else {
      // console.log("DomainsEditor.onSave: " + JSON.stringify(domain));
      this.graphService.addItem(this.itemType, domain)
        .then(() => this.getDomains())
        .catch(err => alert("err: " + err));
    }
    this.selectedDomain = null;
  }

  select(domain: Domain) {
    this.selectedDomain = domain;
  }}
