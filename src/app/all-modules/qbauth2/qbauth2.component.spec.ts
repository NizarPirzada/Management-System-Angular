import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Qbauth2Component } from './qbauth2.component';

describe('Qbauth2Component', () => {
  let component: Qbauth2Component;
  let fixture: ComponentFixture<Qbauth2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Qbauth2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Qbauth2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
