import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSolicitudComponent } from './new-solicitud.component';

describe('NewSolicitudComponent', () => {
  let component: NewSolicitudComponent;
  let fixture: ComponentFixture<NewSolicitudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewSolicitudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
