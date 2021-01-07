import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListInvitacionesComponent } from './list-invitaciones.component';

describe('ListInvitacionesComponent', () => {
  let component: ListInvitacionesComponent;
  let fixture: ComponentFixture<ListInvitacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListInvitacionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListInvitacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
