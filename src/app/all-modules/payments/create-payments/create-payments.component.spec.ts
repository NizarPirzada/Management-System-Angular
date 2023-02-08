import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePaymentsComponent } from './create-payments.component';

describe('CreatePaymentsComponent', () => {
  let component: CreatePaymentsComponent;
  let fixture: ComponentFixture<CreatePaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePaymentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
