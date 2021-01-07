import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewEvaluacionComponent } from './review-evaluacion.component';

describe('ReviewEvaluacionComponent', () => {
  let component: ReviewEvaluacionComponent;
  let fixture: ComponentFixture<ReviewEvaluacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewEvaluacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewEvaluacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
