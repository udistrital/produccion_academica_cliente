import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEvaluacionesComponent } from './list-evaluaciones.component';

describe('ListEvaluacionesComponent', () => {
  let component: ListEvaluacionesComponent;
  let fixture: ComponentFixture<ListEvaluacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListEvaluacionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEvaluacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
