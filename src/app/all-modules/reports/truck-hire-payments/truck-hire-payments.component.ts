import { DatePipe } from "@angular/common";
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { ReportService } from "src/app/shared/services/report.service";
import * as html2pdf from "html2pdf.js";

declare var $: any;

@Component({
  selector: "app-truck-hire-payments",
  templateUrl: "./truck-hire-payments.component.html",
  styleUrls: ["./truck-hire-payments.component.css"],
})
export class TruckHirePaymentsComponent implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  isLoadingData: boolean = true;

  truckHirePayments: any[] = [];

  truckHirePayment: any[] = [];
  truckTotal: number = 0;
  ticketTotal: number = 0;

  pipe: DatePipe = new DatePipe("en-US");
  today: Date;
  defaultStartDate: Date;
  defaultEndDate: Date;
  startDateFilter: string;
  endDateFilter: string;
  invoiceIdFilter: string;
  Norecordfound: boolean = false;

  constructor(private reportService: ReportService, private router: Router, private toastr: ToastrService) {
    this.today = new Date();
    this.defaultStartDate = new Date(new Date().setMonth(new Date().getMonth() - 1));
    this.defaultEndDate = new Date();
    this.startDateFilter = this.pipe.transform(this.defaultStartDate, "MM-dd-yyyy");
    this.endDateFilter = this.pipe.transform(this.defaultEndDate, "MM-dd-yyyy");
    this.invoiceIdFilter = null;
  }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      lengthChange: false,
      searching: false,
      ordering: false,
      language: {
        emptyTable: " ",
      },
    };

    const startDate: Date = new Date(this.startDateFilter);
    const endDate: Date = new Date(this.endDateFilter);
    const data: {} = { ...this.getFilterParameters() };
    this.getTruckHireReports(data);
  }

  ngAfterViewInit(): void {
    $(".cal-icon").on("click", function (e) {
      $(e.target).find(".datetimepicker").click();
    });
    
    this.dtTrigger.next();
  }

  getFilterParameters(): {} {
    const startDate: Date = new Date(this.startDateFilter);
    const endDate: Date = new Date(this.endDateFilter);
    const data: {} = {
      invoiceID: this.invoiceIdFilter,
      startDate: new Date(Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())).toISOString(),
      endDate: new Date(Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate())).toISOString(),
    };
    return data;
  }

  setInvoiceIdFilter(value: any) {
    if (!!value) {
      this.invoiceIdFilter = value;
    } else {
      this.invoiceIdFilter = null;
    }

    $(".floating")
      .on("focus blur", function (e) {
        $(this)
          .parents(".form-focus")
          .toggleClass("focused", e.type === "focus" || this.value.length > 0);
      })
      .trigger("blur");
  }

  setStartDateFilter(value: any) {
    this.startDateFilter = this.pipe.transform(value, "MM-dd-yyyy");
    $(".floating")
      .on("focus blur", function (e) {
        $(this)
          .parents(".form-focus")
          .toggleClass("focused", e.type === "focus" || this.value.length > 0);
      })
      .trigger("blur");
  }

  setEndDateFilter(value: any) {
    this.endDateFilter = this.pipe.transform(value, "MM-dd-yyyy");
    $(".floating")
      .on("focus blur", function (e) {
        $(this)
          .parents(".form-focus")
          .toggleClass("focused", e.type === "focus" || this.value.length > 0);
      })
      .trigger("blur");
  }

  async paymentReportPdfHandler(invoiceID: number) {
    await this.getTruckHireReport(invoiceID);

    $("#truckHirePaymentModal").modal("show");

    this.generatePDF();
  }

  async paymentReportPrintHandler(invoiceID: number) {
    await this.getTruckHireReport(invoiceID);

    $("#truckHirePaymentModal").modal("show");
  }

  paymentReportViewHandler(invoiceID: number) {
    this.router.navigate([`report/truck-hire-payment/${invoiceID}`]);
  }

  generatePDF() {
    var worker = html2pdf()
      .set({
        html2canvas: { scale: 2 },
      })
      .from($("#printSection")[0])
      .toPdf()
      .save("report");
  }

  getFilteredTruckHireReports() {
    this.isLoadingData = true;
    
    if (this.startDateFilter > this.endDateFilter) {
      this.Norecordfound = false;
      this.isLoadingData = false;
      this.toastr.error("Please select start date less than the end date!");
      return;
    }
    const data: {} = { ...this.getFilterParameters() };

    this.getTruckHireReports(data);
  }

  async getTruckHireReport(invoiceID: number) {
    this.isLoadingData = true;
    const response: any = await this.reportService.truckHireReport(invoiceID).toPromise();
    this.truckHirePayment = response.ResponseData;
    this.truckHirePayment.forEach((item: any) => {
      this.truckTotal += item.Quantity;
      this.ticketTotal += item.Line_Item_Total;
    });
    console.log({ ...this.truckHirePayment });
    this.isLoadingData = false;
  }

  getTruckHireReports(data: {}) {
    this.isLoadingData = true;

    this.reportService.truckHireReports(data).subscribe((data) => {
      const dbResponse: any = data;
      this.truckHirePayments = dbResponse.ResponseData;
     
      this.isLoadingData = false;
      if (this.truckHirePayments.length == 0) {
        this.Norecordfound = true;
        this.dtOptions.info = false;
        this.dtOptions.paging = false;
      }
      else{
        this.Norecordfound = false;
        this.dtOptions.info = true;
        this.dtOptions.paging = true;
      }
      // Calling the DT trigger to manually render the table
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.dtTrigger.next();
      });

      console.log({ ...this.truckHirePayments });
    });
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
}
