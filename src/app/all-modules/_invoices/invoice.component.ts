import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { InvoiceService } from "src/app/shared/services/invoice.service";

declare const $: any;

@Component({
  selector: "app-invoice",
  templateUrl: "./invoice.component.html",
  styleUrls: ["./invoice.component.css"],
})
export class InvoiceComponent implements AfterViewInit, OnInit, OnDestroy {
  mydate = new Date();
  current_date: any;

  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject();

  invoices: any[];
  invoiceDetails: any[];
  selectedRecords: any = [];
  invoiceTotal: number = 0;
  disableCreateInvoiceButton: boolean = true;
  noRecordFound: boolean = false;
  isLoading: boolean = false;
  isLoadingInvoiceDetails: boolean = true;
  fromDateFilter: Date = new Date();
  toDateFilter: Date = new Date();
  generateInvoiceStartDate: string;
  generateInvoiceEndDate: string;

  constructor(private router: Router, private toastr: ToastrService, private invoiceService: InvoiceService) {}

  ngOnInit() {
    this.dtOptions = {
      pagingType: "simple_numbers",
      pageLength: 10,
      lengthChange: false,
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

  onSelectRow(e, jobId, productId) {
    let obj = {
      JobID: jobId,
      JobProductID: productId,
      StartDate: new Date(Date.UTC(this.fromDateFilter.getFullYear(), this.fromDateFilter.getMonth(), this.fromDateFilter.getDate())).toISOString(),
      EndDate: new Date(Date.UTC(this.toDateFilter.getFullYear(), this.toDateFilter.getMonth(), this.toDateFilter.getDate())).toISOString(),
    };

    if (e.target.checked) {
      this.selectedRecords.push(obj);
      this.disableCreateInvoiceButton = false;
    } else {
      this.selectedRecords = this.selectedRecords.filter((x) => x.JobID !== jobId);

      if (this.selectedRecords == "") {
        this.disableCreateInvoiceButton = true;
      }
    }
  }

  openIvoiceHandler(jobID: number, jobProductID: number): void {
    const payload: { jobID: number; jobProductID: number; invoiceID: number; startDate: string; endDate: string } = {
      jobID: jobID,
      jobProductID: jobProductID,
      invoiceID: 0,
      startDate: this.generateInvoiceStartDate,
      endDate: this.generateInvoiceEndDate,
    };

    const encodedData: string = btoa(JSON.stringify(payload));

    // Converts the route into a string that can be used with the window.open() function
    const url = this.router.serializeUrl(this.router.createUrlTree([`/viewinvoice/${encodedData}`]));
    window.open(url, "_blank");
  }

  // Get ticket list  Api Call
  loadTickets() {
    this.dtOptions.info = true;
    this.dtOptions.paging = true;
    this.isLoading = true;
    if (this.toDateFilter < this.fromDateFilter) {
      this.noRecordFound = false;
      this.isLoading = false;
      this.toastr.error("'Please select start date less than the end date");
      return;
    }

    const startDate = new Date(Date.UTC(this.fromDateFilter.getFullYear(), this.fromDateFilter.getMonth(), this.fromDateFilter.getDate())).toISOString();
    const endDate = new Date(Date.UTC(this.toDateFilter.getFullYear(), this.toDateFilter.getMonth(), this.toDateFilter.getDate())).toISOString();

    this.invoiceService.getJobListForInvoice(startDate, endDate).subscribe({
      next: (response) => {
        this.invoices = response.ResponseData;
        if (this.invoices.length > 0) {
          this.generateInvoiceStartDate = startDate;
          this.generateInvoiceEndDate = endDate;
          this.noRecordFound = false;
          this.dtOptions.info = true;
          this.dtOptions.paging = true;
        } else if (this.invoices.length == 0) {
          this.noRecordFound = true;
          this.dtOptions.info = false;
          this.dtOptions.paging = false;
        }
      },
      error: (error) => {
        console.error(error);
        this.noRecordFound = true;
      },
      complete: () => {
        this.isLoading = false;
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger.next();
        });
      },
    });
  }

  // create invoice Api Call
  async createInvoice() {
    this.disableCreateInvoiceButton = true;
    if (this.selectedRecords.length != 0) {
      this.isLoading = true;
      for (const record of this.selectedRecords) {
        const response: any = await this.invoiceService.CreateInvoice(record).toPromise();
        console.log(response);

        this.toastr.success("Invoice Created sucessfully...!", "Success");
      }

      this.selectedRecords = [];
      this.loadTickets();
    }
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
}
