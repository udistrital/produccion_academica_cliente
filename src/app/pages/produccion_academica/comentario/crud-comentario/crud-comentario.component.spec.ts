import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudComentarioComponent } from './crud-comentario.component';

describe('CrudComentarioComponent', () => {
  let component: CrudComentarioComponent;
  let fixture: ComponentFixture<CrudComentarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrudComentarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrudComentarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
