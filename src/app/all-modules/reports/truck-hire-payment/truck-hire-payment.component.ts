import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { ReportService } from "src/app/shared/services/report.service";
import * as html2pdf from "html2pdf.js";

declare var $: any;

@Component({
  selector: "app-truck-hire-payment",
  templateUrl: "./truck-hire-payment.component.html",
  styleUrls: ["./truck-hire-payment.component.css"],
})
export class TruckHirePaymentComponent implements OnInit {
  isLoadingData: boolean = true;
  data: [] = [];
  truckTotal: number = 0;
  ticketTotal: number = 0;
  invoiceID: any;
  private routeSub: Subscription;
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
      this.invoiceID = params["id"];
    });

    this.getTruckHireReport();
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  getTruckHireReport() {
    this.isLoadingData = true;
    this.reportService.truckHireReport(this.invoiceID).subscribe((data) => {
      const dbResponse: any = data;
      this.data = dbResponse.ResponseData;
      this.data.forEach((item: any) => {
        this.truckTotal += item.Quantity;
        this.ticketTotal += item.Line_Item_Total;
      });
      this.isLoadingData = false;
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
