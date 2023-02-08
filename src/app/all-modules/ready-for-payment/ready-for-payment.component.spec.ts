import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadyForPaymentComponent } from './ready-for-payment.component';

describe('ReadyForPaymentComponent', () => {
  let component: ReadyForPaymentComponent;
  let fixture: ComponentFixture<ReadyForPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReadyForPaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadyForPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
