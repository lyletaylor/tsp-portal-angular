import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainsEditorComponent } from './domains-editor.component';

describe('DomainsEditorComponent', () => {
  let component: DomainsEditorComponent;
  let fixture: ComponentFixture<DomainsEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DomainsEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DomainsEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
