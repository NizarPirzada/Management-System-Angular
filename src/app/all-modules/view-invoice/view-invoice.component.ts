import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { InvoiceService } from "src/app/shared/services/invoice.service";
import * as html2pdf from "html2pdf.js";

@Component({
  selector: "app-view-invoice",
  templateUrl: "./view-invoice.component.html",
  styleUrls: ["./view-invoice.component.css"],
})
export class ViewInvoiceComponent implements OnInit, OnDestroy {
  data: any[] = [];
  invoiceTotal: number = 0;
  isLoading: boolean = true;
  noRecordFound: boolean = true;

  private routeSub: Subscription;

  constructor(private route: ActivatedRoute, private invoiceService: InvoiceService) {}

  ngOnInit(): void {
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
      const payload: { jobID: number; jobProductID: number; invoiceID: number; startDate: string; endDate: string } = JSON.parse(atob(encodedData));
      this.generateInvoiceDetails(payload);
    });
  }

  generateInvoiceDetails(payload: { jobID: number; jobProductID: number; invoiceID: number; startDate: string; endDate: string }): void {
    debugger;
    this.isLoading = true;
    this.invoiceService.generateInvoiceDetails(payload.jobID, payload.jobProductID, payload.invoiceID, payload.startDate, payload.endDate).subscribe({
      next: (response) => {
        this.data = response.ResponseData;

        this.invoiceTotal = 0;
        this.data.forEach((item: any) => {
          this.invoiceTotal += item.TotalAmount;
        });

        this.noRecordFound = false;
      },
      error: (error) => {
        this.noRecordFound = true;
        console.error(error);
      },
      complete: () => {
        this.isLoading = false;
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

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }
}
