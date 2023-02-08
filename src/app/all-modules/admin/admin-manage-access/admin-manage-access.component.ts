import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CompanyService } from "src/app/shared/services/company.service";
import { UserService } from "src/app/shared/services/user.service";

declare const $: any;

@Component({
  selector: "app-admin-manage-access",
  templateUrl: "./admin-manage-access.component.html",
  styleUrls: ["./admin-manage-access.component.css"],
})
export class AdminManageAccessComponent implements OnInit, OnDestroy {
  userRole: string;
  users: any[];
  companies: any[];
  companyUsers: any[];
  selectedCompany: number;
  isLoadingUsers: boolean = true;
  isLoadingCompanyUsers: boolean = true;

  constructor(
    private router: Router,
    private companyService: CompanyService,
    private userService: UserService
  ) {
    this.getUserRole();
    this.getAllCompanies();
  }

  getUserRole() {
    this.userService.getUserRole().subscribe((data) => {
      const response: any = data;
      const userRole: string = response.ResponseData[0].RoleName;

      if (userRole !== "Admin") {
        this.router.navigate(["/"]);
      }
    });
  }

  getUsersByCompany(companyID: number) {
    this.isLoadingCompanyUsers = true;
    this.userService.getUsersByCompany(companyID).subscribe((data) => {
      const response: any = data;
      this.companyUsers = response.ResponseData;
      this.isLoadingCompanyUsers = false;
    });
  }

  getUsersNotInCompany(companyID: number) {
    this.isLoadingUsers = true;
    this.userService.getUsersNotInCompany(companyID).subscribe((data) => {
      const response: any = data;
      this.users = response.ResponseData;
      this.isLoadingUsers = false;
    });
  }

  getAllCompanies() {
    this.companyService.getAllCompanies().subscribe((data) => {
      const response: any = data;
      this.companies = response.ResponseData;
      this.selectedCompany = parseInt(this.companies[0].Company_Information_ID);
      this.getUsersByCompany(this.selectedCompany);
    });
  }

  addUsersToCompany(companyID: number, users: number[]) {
    this.userService.addUsersToCompany(companyID, users).subscribe((data) => {
      let response: any = data;
      response = response.ResponseData[0];
      if (parseInt(response.Status) === 1) {
        this.closeAddUsersToCompanyModal();
        this.getUsersByCompany(this.selectedCompany);
      }
    });
  }

  removeUserFromCompany(companyID: number, userID: number) {
    this.userService
      .removeUserFromCompany(companyID, userID)
      .subscribe((data) => {
        let response: any = data;
        response = response.ResponseData[0];
        if (parseInt(response.Status) === 1) {
          this.getUsersByCompany(this.selectedCompany);
        }
      });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  onCompanyChange(companyID: number) {
    this.selectedCompany = companyID;
    this.getUsersByCompany(this.selectedCompany);
  }

  openAddUsersToCompanyModal() {
    const companyName = this.companies.find(
      (c) => c.Company_Information_ID == this.selectedCompany
    )?.CompanyName;

    const title = !!companyName ? `Add users to ${companyName}` : `Add users`;
    $("#addUsersToCompanyModal .modal-title").text(title);
    $("#addUsersToCompanyModal").modal("show");
    this.getUsersNotInCompany(this.selectedCompany);
  }

  closeAddUsersToCompanyModal() {
    $("#addUsersToCompanyModal").modal("hide");
  }

  addUsersToCompanyFormSubmitHandler() {
    let selectedUsers: number[] = $('[name="UserSelection[]"]:checked')
      .map(function () {
        return parseInt($(this).val());
      })
      .get();

    if (selectedUsers.length > 0) {
      this.addUsersToCompany(this.selectedCompany, selectedUsers);
    }
  }

  removeUserFromCompanyButtonClickHandler(userID: number) {
    const companyID: number = this.selectedCompany;
    this.removeUserFromCompany(companyID, userID);
  }
}
