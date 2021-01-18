import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeListEvaluacionesComponent } from './resume-list-evaluaciones.component';

describe('ResumeListEvaluacionesComponent', () => {
  let component: ResumeListEvaluacionesComponent;
  let fixture: ComponentFixture<ResumeListEvaluacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResumeListEvaluacionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumeListEvaluacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
