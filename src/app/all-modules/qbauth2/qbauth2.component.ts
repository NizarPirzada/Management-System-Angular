import { Component, OnInit } from "@angular/core";
import { QbauthService } from "src/app/shared/services/qbauth.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-qbauth2",
  templateUrl: "./qbauth2.component.html",
  styleUrls: ["./qbauth2.component.css"],
})
export class Qbauth2Component implements OnInit {
  constructor(
    private qbauthService: QbauthService,
    private router: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const code: any = this.router.snapshot.queryParamMap.get("code");
    const realmId: any = this.router.snapshot.queryParamMap.get("realmId");
    if (!!code) {
      const data = { code, realmId };
      console.log(data);

      this.qbauthService.sendQueryParams(data).subscribe((data) => {
        const dbResponse: any = data;
        if (
          dbResponse.ResponseData != null &&
          dbResponse.ResponseData.HttpStatusCode == 200
        ) {
          window.opener.location.reload();
          close();
        }
      });
    }
  }
}
