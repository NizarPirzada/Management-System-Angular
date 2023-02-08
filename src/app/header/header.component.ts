import { Component, OnInit, OnDestroy } from "@angular/core";
import { DomSanitizer, SafeResourceUrl, SafeUrl } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { MsalService } from "@azure/msal-angular";
import { CompanyService } from "src/app/shared/services/company.service";
import { QbauthService } from "src/app/shared/services/qbauth.service";
import { GraphApiCallerService } from "../shared/services/graph-api-caller.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isQuickbookConnected: boolean;
  quickbookTimeout: any;

  userName: string;
  userImage: SafeResourceUrl;

  companyData: any;
  loopCompanyData: any;
  selectedCompany: number;

  constructor(private companyService: CompanyService, private qbauthService: QbauthService, private router: Router, private authService: MsalService, private graphApiCallerService: GraphApiCallerService, private sanitizer: DomSanitizer) {
    const activeAccount = this.authService.instance.getActiveAccount();
    this.userName = activeAccount?.name;
    //this.userName = 'user';
    this.getQbAuthData();
  }

  ngOnInit() {
    this.getUserImage();
    this.loadCompany();
  }

  getUserImage() {
    this.graphApiCallerService.getUserProfileImage().subscribe({
      next: (response) => {
        const urlCreator = window.URL || window.webkitURL;
        this.userImage = this.sanitizer.bypassSecurityTrustUrl(urlCreator.createObjectURL(response));
      },
      error: (error) => {
        console.log(error);
        this.userImage = this.sanitizer.bypassSecurityTrustUrl("assets/img/user.jpg");
      },
    });
  }

  async onCompanyChange(companyID: number) {
    this.selectedCompany = companyID;

    const response: any = await this.companyService.setCompanyAsActive(companyID).toPromise();
    window.location.reload();
  }

  getQbAuthData() {
    // Fail-safe check to stop fuction from calling again while in execution...
    clearTimeout(this.quickbookTimeout);

    this.qbauthService.getQbAuthData().subscribe((data) => {
      const dbResponse: any = data;
      const quickbookData: any = dbResponse.ResponseData;
      const url: string = quickbookData?.authUrl;
      if (!!url) {
        window.open(url, "ModalPopUp", "width=700," + "height=900");
        this.isQuickbookConnected = false;
      } else {
        this.isQuickbookConnected = true;
      }

      // Recursion every 5 minutes...
      this.quickbookTimeout = setTimeout(() => this.getQbAuthData(), 300000);
    });
  }

  loadCompany() {
    this.companyService.getUserCompanies().subscribe((data) => {
      console.log(data);
      this.companyData = data;
      this.loopCompanyData = this.companyData.ResponseData;
      this.selectedCompany = this.loopCompanyData.find((c) => c.StatusId === 1).Company_Information_ID;
    });
  }

  onSubmit() {
    this.router.navigate(["/pages/search"]);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(["/login"]);
  }

  // This might be redundant ...
  ngOnDestroy(): void {
    clearTimeout(this.quickbookTimeout);
  }
}
