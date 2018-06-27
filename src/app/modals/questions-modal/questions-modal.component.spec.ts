import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionsModalComponent } from './questions-modal.component';

describe('QuestionsModalComponent', () => {
  let component: QuestionsModalComponent;
  let fixture: ComponentFixture<QuestionsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
