import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckHirePaymentComponent } from './truck-hire-payment.component';

describe('TruckHirePaymentComponent', () => {
  let component: TruckHirePaymentComponent;
  let fixture: ComponentFixture<TruckHirePaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TruckHirePaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TruckHirePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
