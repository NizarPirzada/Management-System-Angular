import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeePayrollSheetComponent } from './employee-payroll-sheet.component';

describe('EmployeePayrollSheetComponent', () => {
  let component: EmployeePayrollSheetComponent;
  let fixture: ComponentFixture<EmployeePayrollSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeePayrollSheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeePayrollSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
