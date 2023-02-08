import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AllModulesRoutingModule } from './all-modules-routing.module';
import { AllModulesComponent } from './all-modules.component';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Api Interaction
import { InMemoryWebApiModule } from 'angular-in-memory-web-api'

// Perfect Scrollbar
import { PerfectScrollbarModule, PerfectScrollbarConfigInterface, PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';

import { AllModulesService } from './all-modules.service';

// DataTable
import { DataTablesModule } from 'angular-datatables';

// DatePipe
import { DatePipe } from '@angular/common';

// Api All Modules Database
import { AllModulesData } from 'src/assets/all-modules-data/all-modules-data';
import { DriverComponent1 } from './_drivers/driver.component';
import { ProductComponent } from './_products/product.component';
import { DriverTypeComponent } from './_drivertypes/driver_types.component';
import { CustomerComponent } from './_customers/customer.component';
import { JobComponent } from './_jobs/job.component';
import { TicketComponent } from './_tickets/ticket.component';
import { TruckComponent } from './_trucks/truck.component';
import { InvoiceComponent } from './_invoices/invoice.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PaymentComponent } from './_payments/payment.component';
import { CompaniesComponent } from './_companies/companies.component';
import { ManageInvoicesComponent } from './manage-invoices/manage-invoices.component';
import { Qbauth1Component } from './qbauth1/qbauth1.component';
import { Qbauth2Component } from './qbauth2/qbauth2.component';
import { ReadyForPaymentComponent } from './ready-for-payment/ready-for-payment.component';
import { CreatePaymentComponent } from './create-payment/create-payment.component';
import { AdminManageAccessComponent } from './admin/admin-manage-access/admin-manage-access.component';
import { TruckHirePaymentsComponent } from './reports/truck-hire-payments/truck-hire-payments.component';
import { TruckHirePaymentComponent } from './reports/truck-hire-payment/truck-hire-payment.component';
import { MoneyOutReportComponent } from './money-out-report/money-out-report.component';
import { CreatePaymentsComponent } from './payments/create-payments/create-payments.component';
import { EmployeePayrollSheetComponent } from './employee-payroll-sheet/employee-payroll-sheet.component';
import { ViewInvoiceComponent } from './view-invoice/view-invoice.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {};

@NgModule({
  declarations: [
    AllModulesComponent,
    HeaderComponent,
    SidebarComponent,
    DriverComponent1,
    ProductComponent,
    DriverTypeComponent,
    CustomerComponent,
    JobComponent,
    TicketComponent,
    TruckComponent,
    InvoiceComponent,
    PaymentComponent,
    CompaniesComponent,
    ManageInvoicesComponent,
    Qbauth1Component,
    Qbauth2Component,
    ReadyForPaymentComponent,
    CreatePaymentComponent,
    AdminManageAccessComponent,
    TruckHirePaymentsComponent,
    TruckHirePaymentComponent,
    MoneyOutReportComponent,
    CreatePaymentsComponent,
    EmployeePayrollSheetComponent,
    ViewInvoiceComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    InMemoryWebApiModule.forRoot(AllModulesData),
    PerfectScrollbarModule,
    AllModulesRoutingModule,
    BsDatepickerModule.forRoot(),
    DataTablesModule,
  ],
  providers: [
    AllModulesService,
    DatePipe,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
  ]
})
export class AllModulesModule { }
