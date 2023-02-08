import { AfterViewInit, Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { InvoiceService } from "src/app/shared/services/invoice.service";

declare const $: any;

@Component({
  selector: "app-manage-invoices",
  templateUrl: "./manage-invoices.component.html",
  styleUrls: ["./manage-invoices.component.css"],
})
export class ManageInvoicesComponent implements OnInit, AfterViewInit {
  invoices: any[];

  isLoading = false;
  noRecordFound = false;

  invoiceID: number = 0;
  status: boolean = false;

  filter: number = 1;
  startDateFilter: Date = new Date();
  endDateFilter: Date = new Date();
  paidFilter: number = 1;
  fundedFilter: number = null;

  currentPage: number = 0;
  pageSize: number = 10;
  totalRecords: number | null = 0;
  totalPages: number = 1;
  hasPrevious: boolean = false;
  hasNext: boolean = false;
  showSum: number = 10;

  constructor(private router: Router, private toastr: ToastrService, private invoiceService: InvoiceService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    $(".cal-icon").on("click", function (e) {
      $(e.target).find(".datetimepicker").click();
    });
  }

  onFilterChange(value: number) {
    value == 1 ? ((this.paidFilter = 1), (this.fundedFilter = null)) : value == 2 ? ((this.paidFilter = 2), (this.fundedFilter = null)) : value == 3 ? ((this.paidFilter = 3), (this.fundedFilter = null)) : value == 4 ? ((this.paidFilter = null), (this.fundedFilter = 1)) : value == 5 ? ((this.paidFilter = null), (this.fundedFilter = 0)) : ((this.paidFilter = null), (this.fundedFilter = null));

    this.getInvoices();
  }

  getInvoices() {
    this.isLoading = true;

    if (this.startDateFilter > this.endDateFilter) {
      this.noRecordFound = false;
      this.isLoading = false;
      this.toastr.error("Please select start date less than the end date!");
      return;
    }

    const payload: {} = {
      paid: this.paidFilter,
      funded: this.fundedFilter,
      startDate: new Date(Date.UTC(this.startDateFilter.getFullYear(), this.startDateFilter.getMonth(), this.startDateFilter.getDate())).toISOString(),
      endDate: new Date(Date.UTC(this.endDateFilter.getFullYear(), this.endDateFilter.getMonth(), this.endDateFilter.getDate())).toISOString(),
      offset: this.currentPage * this.pageSize,
      limit: this.pageSize,
    };

    this.invoiceService.getInvoices(payload).subscribe((response) => {
      const data: any = response.ResponseData;
      this.invoices = data?.Data;
      this.totalRecords = data?.RecordsCount;

      console.log({ ...this.invoices });

      if (!!this.invoices) {
        this.noRecordFound = false;
      } else {
        this.noRecordFound = true;
      }
      this.isLoading = false;

      // For custom pagination ...
      if (!!this.totalRecords) {
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        this.hasNext = this.currentPage < this.totalPages ? true : false;
        this.hasPrevious = this.currentPage > 1 ? true : false;
      }
    });
  }
  changeTicketPage(pgIndex) {
    this.currentPage = pgIndex;
    this.getInvoices();
    this.showSum = this.currentPage * this.pageSize + this.pageSize;
  }

  viewInvoice(jobID: number, jobProductID: number, invoiceID: number) {
    const payload: { jobID: number; jobProductID: number; invoiceID: number; startDate: string; endDate: string } = {
      jobID: jobID,
      jobProductID: jobProductID,
      invoiceID: invoiceID,
      startDate: "",
      endDate: "",
    };

    const encodedData: string = btoa(JSON.stringify(payload));

    // Converts the route into a string that can be used with the window.open() function
    const url = this.router.serializeUrl(this.router.createUrlTree([`/viewinvoice/${encodedData}`]));
    window.open(url, "_blank");
  }

  openConfirmationModal(invoiceID: number, status: boolean) {
    this.invoiceID = invoiceID;
    this.status = status;
  }

  markAsVoidHandler() {
    this.isLoading = true;
    this.invoiceService.updateVoidStatus(this.invoiceID, this.status).subscribe({
      next: (response) => {
        if (response.Status == 200) {
          this.toastr.success("Void status updated!", "Success");
        } else {
          this.toastr.error(response.Message, "Error");
        }
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {
        this.invoiceID = 0;
        this.status = false;

        this.getInvoices();
      },
    });
  }

  markAsFundedHandler() {
    this.isLoading = true;
    this.invoiceService.updateFundedStatus(this.invoiceID, this.status).subscribe({
      next: (response) => {
        if (response.Status == 200) {
          this.toastr.success("Funded status updated!", "Success");
        } else {
          this.toastr.error(response.Message, "Error");
        }
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {
        this.invoiceID = 0;
        this.status = false;

        this.getInvoices();
      },
    });
  }

  cancel() {
    this.invoiceID = 0;
    this.status = false;

    this.getInvoices();
  }
}
