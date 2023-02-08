import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckHirePaymentsComponent } from './truck-hire-payments.component';

describe('TruckHirePaymentsComponent', () => {
  let component: TruckHirePaymentsComponent;
  let fixture: ComponentFixture<TruckHirePaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TruckHirePaymentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TruckHirePaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
