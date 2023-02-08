import { LoginComponent } from './../login/login/login.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllModulesComponent } from './all-modules.component';
import { CustomerComponent } from './_customers/customer.component';
import { DriverComponent1 } from './_drivers/driver.component';
import { DriverTypeComponent } from './_drivertypes/driver_types.component';
import { InvoiceComponent } from './_invoices/invoice.component';
import { JobComponent } from './_jobs/job.component';
import { PaymentComponent } from './_payments/payment.component';
import { ProductComponent } from './_products/product.component';
import { TicketComponent } from './_tickets/ticket.component';
import { TruckComponent } from './_trucks/truck.component';
import { CompaniesComponent } from './_companies/companies.component';
import { ManageInvoicesComponent } from './manage-invoices/manage-invoices.component';
import { Qbauth1Component } from './qbauth1/qbauth1.component';
import { Qbauth2Component } from './qbauth2/qbauth2.component';
import { CreatePaymentComponent } from './create-payment/create-payment.component';
import { AdminManageAccessComponent } from './admin/admin-manage-access/admin-manage-access.component';
import { TruckHirePaymentsComponent } from './reports/truck-hire-payments/truck-hire-payments.component';
import { TruckHirePaymentComponent } from './reports/truck-hire-payment/truck-hire-payment.component';
import { MoneyOutReportComponent } from './money-out-report/money-out-report.component';
import { CreatePaymentsComponent } from './payments/create-payments/create-payments.component';
import { EmployeePayrollSheetComponent } from './employee-payroll-sheet/employee-payroll-sheet.component';
import { ViewInvoiceComponent } from './view-invoice/view-invoice.component';

const routes: Routes = [
  // {
  //   path: '',
  //   redirectTo: 'login',
  //   pathMatch: 'full'
  // },
  {
    path: '',
    component: AllModulesComponent,
    children: [
      // custom routs via components start
      {
        path: 'admin/manage-access', component: AdminManageAccessComponent
      },
      {
        path: 'report/truck-hire-payments', component: TruckHirePaymentsComponent
      },
      {
        path: 'report/truck-hire-payment/:id', component: TruckHirePaymentComponent
      },
      {
        path: 'report/money-out', component: MoneyOutReportComponent
      },
      {
        path: 'payments/create-payments', component: CreatePaymentsComponent
      },
      {
        path: 'drivers', component: DriverComponent1
      },
      {
        path: 'drivertypes', component: DriverTypeComponent
      },
      {
        path: 'products', component: ProductComponent
      },
      {
        path: 'customers', component: CustomerComponent
      },
      {
        path: 'jobs', component: JobComponent
      },
      {
        path: 'tickets', component: TicketComponent
      },
      {
        path: 'trucks', component: TruckComponent
      },
      {
        path: 'company', component: CompaniesComponent
      },
      {
        path: 'invoice', component: InvoiceComponent
      },
      {
        path: 'manageinvoice', component: ManageInvoicesComponent
      },
      {
        path: 'viewinvoice/:id', component: ViewInvoiceComponent
      },
      {
        path: 'qbauth1', component: Qbauth1Component
      },
      {
        path: 'qbauth2' , component : Qbauth2Component
      },
      {
        path: 'mark-payments' , component : PaymentComponent
      },
      {
        path: 'createpayments' , component : CreatePaymentComponent
      },
      {
        path: 'payroll-sheet/:id', component: EmployeePayrollSheetComponent
      },
      {
        path: '', component: InvoiceComponent // to be replaced with dashboard when ready
      },
      {
        path: 'payments', component: PaymentComponent
      },
      {
        path: 'login', component: LoginComponent
      },
      // custom routs via components end

      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
      },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllModulesRoutingModule { }
