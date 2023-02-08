import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { ReportService } from "src/app/shared/services/report.service";
import * as html2pdf from "html2pdf.js";

declare const $: any;

@Component({
  selector: "app-employee-payroll-sheet",
  templateUrl: "./employee-payroll-sheet.component.html",
  styleUrls: ["./employee-payroll-sheet.component.css"],
})
export class EmployeePayrollSheetComponent implements OnInit, OnDestroy {
  private routeSub: Subscription;

  paymentID: number;
  data: any[];
  truckTotal: number;
  priceTotal: number;
  isLoadingData: boolean = true;

  constructor(private route: ActivatedRoute, private reportService: ReportService) {}

  ngOnInit() {
    /*
    window.addEventListener("beforeprint", function (event) {
      $(".main-wrapper").hide();
      $(".printSection").clone().removeClass("printSection").addClass("printing").prependTo("body");
    });
    */

    window.addEventListener("afterprint", function (event) {
      $("body").children(".printing").remove();
      $(".main-wrapper").show();
    });

    this.routeSub = this.route.params.subscribe((params) => {
      const encodedData: string = params["id"];
      const payload: {} = JSON.parse(atob(encodedData));
      this.getEmployeePayroll(payload);
    });
  }

  getEmployeePayroll(payload: {}) {
    this.isLoadingData = true;

    this.reportService.employeePayroll(payload).subscribe({
      next: (response) => {
        this.data = response.ResponseData;

        this.truckTotal = 0;
        this.priceTotal = 0;
        this.data.forEach((item) => {
          this.truckTotal += item.Quantity;
          this.priceTotal += item.Quantity * item.Price;
        });
        console.log(this.data);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.isLoadingData = false;
      },
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

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
