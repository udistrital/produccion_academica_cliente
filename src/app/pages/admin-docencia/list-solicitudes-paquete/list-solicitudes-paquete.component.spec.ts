import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSolicitudesPaqueteComponent } from './list-solicitudes-paquete.component';

describe('ListSolicitudesPaqueteComponent', () => {
  let component: ListSolicitudesPaqueteComponent;
  let fixture: ComponentFixture<ListSolicitudesPaqueteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListSolicitudesPaqueteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSolicitudesPaqueteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
