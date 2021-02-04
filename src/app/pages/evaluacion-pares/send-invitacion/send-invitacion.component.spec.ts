import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendInvitacionComponent } from './send-invitacion.component';

describe('SendInvitacionComponent', () => {
  let component: SendInvitacionComponent;
  let fixture: ComponentFixture<SendInvitacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendInvitacionComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendInvitacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
