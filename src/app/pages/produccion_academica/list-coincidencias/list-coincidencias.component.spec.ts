import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCoincidenciasComponent } from './list-coincidencias.component';

describe('ListCoincidenciasComponent', () => {
  let component: ListCoincidenciasComponent;
  let fixture: ComponentFixture<ListCoincidenciasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListCoincidenciasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCoincidenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
