import { AfterViewInit, Component, OnInit } from "@angular/core";
import { DatePipe } from "@angular/common";
import { ReportService } from "src/app/shared/services/report.service";
import * as html2pdf from "html2pdf.js";

declare const $: any;

@Component({
  selector: "app-money-out-report",
  templateUrl: "./money-out-report.component.html",
  styleUrls: ["./money-out-report.component.css"],
})
export class MoneyOutReportComponent implements OnInit, AfterViewInit {
  pipe: DatePipe = new DatePipe("en-US");
  startDateFilter: string;
  endDateFilter: string;

  isLoading: boolean = true;
  showLoader: boolean = false;
  Norecordfound:boolean=false;
  customersReportData: any[];
  companyTruckReportData: any[];
  twoWeekPayTruckReportData: any[];
  regularPayTruckReportData: any[];

  customersTotal: number;
  companyTruckTotal: number;
  twoWeekPayTruckTotal: number;
  regularPayTruckTotal: number;

  constructor(private reportService: ReportService) {
    this.startDateFilter = this.pipe.transform(new Date(), "MM-dd-yyyy");
    this.endDateFilter = this.pipe.transform(new Date(), "MM-dd-yyyy");
  }

  ngOnInit(): void {
    window.addEventListener("afterprint", function (event) {
      $("body").children(".printing").remove();
      $(".main-wrapper").show();
    });
  }

  ngAfterViewInit(): void {
    $(".cal-icon").on("click", function (e) {
      $(e.target).find(".datetimepicker").click();
    });
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

  getFilterParameters(): {} {
    const startDate: Date = new Date(this.startDateFilter);
    const endDate: Date = new Date(this.endDateFilter);
    const data: {} = {
      startDate: new Date(Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())).toISOString(),
      endDate: new Date(Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate())).toISOString(),
    };
    return data;
  }

  getMoneyOutReport() {
    this.isLoading = true;
    this.showLoader = true;

    const data = { ...this.getFilterParameters() };
    this.reportService.moneyOutReport(data).subscribe((response) => {
      this.customersReportData = response.ResponseData[0];
      this.companyTruckReportData = response.ResponseData[1].filter((i) => i.TruckTypeID == 1);
      this.twoWeekPayTruckReportData = response.ResponseData[1].filter((i) => i.TruckTypeID == 2);
      this.regularPayTruckReportData = response.ResponseData[1].filter((i) => i.TruckTypeID == 3);

      this.customersTotal = 0;
      for (const obj of this.customersReportData) {
        this.customersTotal += obj.TotalAmount;
      }

      this.companyTruckTotal = 0;
      for (const obj of this.companyTruckReportData) {
        this.companyTruckTotal += obj.Rate;
      }

      this.twoWeekPayTruckTotal = 0;
      for (const obj of this.twoWeekPayTruckReportData) {
        this.twoWeekPayTruckTotal += obj.Rate;
      }

      this.regularPayTruckTotal = 0;
      for (const obj of this.regularPayTruckReportData) {
        this.regularPayTruckTotal += obj.Rate;
      }

      this.isLoading = false;
      this.showLoader = false;
      if(response.ResponseData.length = 0){
        this.Norecordfound=true;
      }

      console.log(this.customersReportData, this.companyTruckReportData, this.twoWeekPayTruckReportData, this.regularPayTruckReportData);
    });
  }

  exportToPdfHandler() {
    var worker = html2pdf()
      .set({
        html2canvas: { scale: 2 },
      })
      .from($(".printSection")[0])
      .toPdf()
      .save("report");
  }

  printReportHandler() {
    $(".main-wrapper").hide();
    $(".printSection").clone().removeClass("printSection").addClass("printing").prependTo("body");

    setTimeout(() => {
      window.print();
    }, 10);
  }
}
