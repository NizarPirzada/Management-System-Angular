import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { DatePipe } from "@angular/common";
import { Subject } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { DataTableDirective } from "angular-datatables";
import { InvoiceService } from "src/app/shared/services/invoice.service";

declare const $: any;

@Component({
  selector: "app-payment",
  templateUrl: "./payment.component.html",
  styleUrls: ["./payment.component.css"],
})
export class PaymentComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject();

  invoices: any[];
  isLoading = false;
  noRecordFound = false;

  pipe: DatePipe;
  fromDateFilter: string;
  toDateFilter: string;

  constructor(private toastr: ToastrService, private invoiceService: InvoiceService) {
    this.pipe = new DatePipe("en-US");
    this.fromDateFilter = this.pipe.transform(new Date(), "MM-dd-yyyy");
    this.toDateFilter = this.pipe.transform(new Date(), "MM-dd-yyyy");
  }

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

  // Get ticket list  Api Call
  findInvoices() {
    this.isLoading = true;
    this.noRecordFound = false;

    const startDate = new Date(this.fromDateFilter);
    const endDate = new Date(this.toDateFilter);
    let payload = {
      StartDate: new Date(Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())).toISOString(),
      EndDate: new Date(Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate())).toISOString(),
    };
    if (startDate  > endDate) {
      this.noRecordFound = false;
      this.isLoading = false;
      // alert("'Please select start date less than the end date");
      this.toastr.error("Please select start date less than the end date");
      return;
    }
    this.invoiceService.GetInvoiceByStartEndDate(payload).subscribe(
      (data: any) => {
        this.invoices = data.ResponseData;
        this.dtOptions.info = true;
        this.dtOptions.paging = true;

        if (this.invoices.length <= 0) {
          this.noRecordFound = true;
          this.dtOptions.info = false;
          this.dtOptions.paging = false;
        } else {
          this.noRecordFound = false;
          this.dtOptions.info = true;
          this.dtOptions.paging = true;
        }
        this.isLoading = false;

        // Calling the DT trigger to manually render the table
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger.next();
        });
      },
      (err) => {
        this.isLoading = false;
        this.noRecordFound = true;
      }
    );
  }

  // create invoice Api Call
  markInvoiceReadyForPayment(id: number) {
    console.log(id);
    this.isLoading = true;
    this.invoiceService.setIsReadyForPayment(id).subscribe({
      next: (res) => {
        this.toastr.success("Invoice Marked sucessfully...!", "Success");
      },
      error: (err) => {},
      complete: () => {
        this.isLoading = false;
        this.findInvoices();
      },
    });
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
}
