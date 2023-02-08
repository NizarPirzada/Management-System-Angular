import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoneyOutReportComponent } from './money-out-report.component';

describe('MoneyOutReportComponent', () => {
  let component: MoneyOutReportComponent;
  let fixture: ComponentFixture<MoneyOutReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoneyOutReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoneyOutReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
