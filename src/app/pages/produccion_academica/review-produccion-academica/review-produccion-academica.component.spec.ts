import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewProduccionAcademicaComponent } from './review-produccion-academica.component';

describe('ReviewProduccionAcademicaComponent', () => {
  let component: ReviewProduccionAcademicaComponent;
  let fixture: ComponentFixture<ReviewProduccionAcademicaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewProduccionAcademicaComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewProduccionAcademicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
