import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicsEditorComponent } from './topics-editor.component';

describe('TopicsEditorComponent', () => {
  let component: TopicsEditorComponent;
  let fixture: ComponentFixture<TopicsEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopicsEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicsEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
