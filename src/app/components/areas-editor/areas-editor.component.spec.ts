import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AreasEditorComponent } from './areas-editor.component';

describe('AreasEditorComponent', () => {
  let component: AreasEditorComponent;
  let fixture: ComponentFixture<AreasEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AreasEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AreasEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
