import { Component, OnInit } from "@angular/core";
import { QbauthService } from "src/app/shared/services/qbauth.service";

@Component({
  selector: "app-qbauth1",
  templateUrl: "./qbauth1.component.html",
  styleUrls: ["./qbauth1.component.css"],
})
export class Qbauth1Component implements OnInit {
  constructor(private qbauthService: QbauthService) {}

  ngOnInit(): void {}
  connectToQuickBook() {
    this.qbauthService.getQbAuthData().subscribe((data) => {
      const dbResponse: any = data;
      const qbInfo: any = dbResponse.ResponseData;
      const url: string = qbInfo?.AuthUrl;
      if (!!url) {
        window.open(url, "ModalPopUp", "width=700," + "height=900");
      }
    });
  }
}
