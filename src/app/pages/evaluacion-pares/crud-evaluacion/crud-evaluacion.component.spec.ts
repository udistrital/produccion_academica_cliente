import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudEvaluacionComponent } from './crud-evaluacion.component';

describe('CrudEvaluacionComponent', () => {
  let component: CrudEvaluacionComponent;
  let fixture: ComponentFixture<CrudEvaluacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrudEvaluacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrudEvaluacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
