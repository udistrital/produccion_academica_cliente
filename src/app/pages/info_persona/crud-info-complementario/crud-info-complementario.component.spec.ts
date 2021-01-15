import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudInfoComplementarioComponent } from './crud-info-complementario.component';

describe('CrudInfoComplementarioComponent', () => {
  let component: CrudInfoComplementarioComponent;
  let fixture: ComponentFixture<CrudInfoComplementarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrudInfoComplementarioComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrudInfoComplementarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
