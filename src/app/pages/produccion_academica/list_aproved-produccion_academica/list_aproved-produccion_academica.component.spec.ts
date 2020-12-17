/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ListAprovedProduccionAcademicaComponent } from './list_aproved-produccion_academica.component';

describe('ListAprovedProduccionAcademicaComponent', () => {
  let component: ListAprovedProduccionAcademicaComponent;
  let fixture: ComponentFixture<ListAprovedProduccionAcademicaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListAprovedProduccionAcademicaComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAprovedProduccionAcademicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
