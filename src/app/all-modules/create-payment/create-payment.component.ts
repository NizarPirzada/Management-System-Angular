import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { DataTableDirective } from "angular-datatables";
import { InvoiceService } from "src/app/shared/services/invoice.service";
import { TicketService } from "src/app/shared/services/ticket.service";
import { ToastrService } from "ngx-toastr";
import { ReportService } from "src/app/shared/services/report.service";

declare const $: any;

@Component({
  selector: "app-create-payment",
  templateUrl: "./create-payment.component.html",
  styleUrls: ["./create-payment.component.css"],
})
export class CreatePaymentComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  driverTypeFilter: number;
  startDateFilter: Date = new Date();
  endDateFilter: Date = new Date();

  tickets: any[];
  payrollDetails: any[];
  truckTotal: number;
  priceTotal: number;
  isLoading: boolean = false;
  isLoadingPayrollDetails: boolean = true;
  noRecordFound: boolean = false;

  constructor(private router: Router, private toastr: ToastrService, private invoiceService: InvoiceService, private ticketService: TicketService, private reportService: ReportService) {}

  ngOnInit() {
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      lengthChange: true,
      searching: false,
      ordering: false,
      language: {
        emptyTable: " ",
      },
    };
  }

  ngAfterViewInit(): void {
    $(".cal-icon").on("click", function (e) {
      $(e.target).find(".datetimepicker").click();
    });

    this.dtTrigger.next();
  }

  getPayableTickets() {
    this.isLoading = true;
    this.noRecordFound = false;

    if (this.endDateFilter < this.startDateFilter) {
      this.noRecordFound = false;
      this.isLoading = false;
      this.toastr.error("'Please select start date less than the end date");
      return;
    }

    let payload = {
      driverType: this.driverTypeFilter,
      startDate: new Date(Date.UTC(this.startDateFilter.getFullYear(), this.startDateFilter.getMonth(), this.startDateFilter.getDate())).toISOString(),
      endDate: new Date(Date.UTC(this.endDateFilter.getFullYear(), this.endDateFilter.getMonth(), this.endDateFilter.getDate())).toISOString(),
    };

    this.ticketService.getPayableTickets(payload).subscribe({
      next: (response) => {
        this.tickets = response.ResponseData;
        this.dtOptions.info = true;
        this.dtOptions.paging = true;
      },
      error: (error) => {
        this.tickets = [];
        console.log(error);
      },
      complete: () => {
        if (this.tickets.length > 0) {
          this.noRecordFound = false;
          this.dtOptions.info = true;
          this.dtOptions.paging = true;
        } else {
          this.noRecordFound = true;
          this.dtOptions.info = false;
          this.dtOptions.paging = false;
        }
        this.isLoading = false;

        // Calling the DT trigger to manually render the table
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger.next();
        });
      },
    });
  }

  previewPayment(driverID: number): void {
    const payload: any = {
      driverID: driverID,
      startDate: new Date(Date.UTC(this.startDateFilter.getFullYear(), this.startDateFilter.getMonth(), this.startDateFilter.getDate())).toISOString(),
      endDate: new Date(Date.UTC(this.endDateFilter.getFullYear(), this.endDateFilter.getMonth(), this.endDateFilter.getDate())).toISOString(),
    };

    const encodedData: string = btoa(JSON.stringify(payload));

    // Converts the route into a string that can be used with the window.open() function
    const url = this.router.serializeUrl(this.router.createUrlTree([`/payroll-sheet/${encodedData}`]));
    window.open(url, "_blank");
  }

  createPayment(driverID: number) {
    let payload = {
      driverId: driverID,
      driverType: this.driverTypeFilter,
      startDate: new Date(Date.UTC(this.startDateFilter.getFullYear(), this.startDateFilter.getMonth(), this.startDateFilter.getDate())).toISOString(),
      endDate: new Date(Date.UTC(this.endDateFilter.getFullYear(), this.endDateFilter.getMonth(), this.endDateFilter.getDate())).toISOString(),
    };

    if (this.driverTypeFilter === 1) {
      this.invoiceService.createPayment(payload).subscribe({
        next: (response) => {
          this.toastr.success("Payroll generated sucessfully...!", "Success");
          this.getPayableTickets();
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {
          console.log("API call completed!");
        },
      });
    } else if (this.driverTypeFilter === 2) {
      this.invoiceService.createBill(payload).subscribe({
        next: (response) => {
          this.toastr.success("Bill generated sucessfully...!", "Success");
          this.getPayableTickets();
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {
          console.log("API call completed!");
        },
      });
    }
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
}
