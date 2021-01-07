import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeProduccionAcademicaComponent } from './resume-produccion-academica.component';

describe('ResumeProduccionAcademicaComponent', () => {
  let component: ResumeProduccionAcademicaComponent;
  let fixture: ComponentFixture<ResumeProduccionAcademicaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResumeProduccionAcademicaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumeProduccionAcademicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
