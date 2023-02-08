import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminManageAccessComponent } from './admin-manage-access.component';

describe('AdminManageAccessComponent', () => {
  let component: AdminManageAccessComponent;
  let fixture: ComponentFixture<AdminManageAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminManageAccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminManageAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
