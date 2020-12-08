import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListComentarioComponent } from './list-comentario.component';

describe('ListComentarioComponent', () => {
  let component: ListComentarioComponent;
  let fixture: ComponentFixture<ListComentarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListComentarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListComentarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
