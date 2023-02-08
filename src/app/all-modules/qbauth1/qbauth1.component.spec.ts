import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Qbauth1Component } from './qbauth1.component';

describe('Qbauth1Component', () => {
  let component: Qbauth1Component;
  let fixture: ComponentFixture<Qbauth1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Qbauth1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Qbauth1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
