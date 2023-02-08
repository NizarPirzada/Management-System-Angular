import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { CompanyService } from "src/app/shared/services/company.service";
import { UserService } from "src/app/shared/services/user.service";

declare const $: any;

@Component({
  selector: "app-companies",
  templateUrl: "./companies.component.html",
  styleUrls: ["./companies.component.css"],
})
export class CompaniesComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject();
  userRole: string;
  companies: any;

  public editCompanyForm: FormGroup;
  public addCompanyForm: FormGroup;

  editId: any;
  public LogoImage = "../../../assets/img/imageadd.png";
  public LogoFile: any;
  public isLoading = false;
  public isAddFormSubmitted = false;
  public falseState = false;
  public Norecordfound = false;

  constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private companyService: CompanyService, private userService: UserService) {}

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      lengthChange: true,
      searching: false,
      ordering: false,
    
    };

    $("#add_Company").modal({ backdrop: "static", keyboard: false });
    $("#edit_Company").modal({ backdrop: "static", keyboard: false });

    this.loadCompany();

    this.addCompanyForm = this.formBuilder.group({
      Company_Name: ["", [Validators.required]],
      Address_1: ["", [Validators.required]],
      Address_2: "",
      City: ["", [Validators.required]],
      State: ["", [Validators.required,Validators.maxLength(2)]],
      Zip_Code: ["", [Validators.required]],
      Phone: ["", [Validators.required]],
      Fax: "",
      URL: "",
    });

    this.editCompanyForm = this.formBuilder.group({
      Company_Name: ["", [Validators.required]],
      Address_1: ["", [Validators.required]],
      Address_2: "",
      City: ["", [Validators.required]],
      State: ["", [Validators.required,Validators.maxLength(2)]],
      Zip_Code: ["", [Validators.required]],
      Phone: ["", [Validators.required]],
      Fax: "",
      URL: "",
    });
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  getImage(event: any) {
    this.LogoFile = event.target.files[0];
    console.log("your image is : " + this.LogoFile);
  }

  async loadCompany() {
    let response: any;
    this.isLoading = true;
    await this.getUserRole();
    if (this.userRole === "Admin") {
      response = await this.companyService.getAllCompanies().toPromise();
    } else {
      response = await this.companyService.getUserCompanies().toPromise();
    }
    this.companies = response.ResponseData;
    this.isLoading = false;
    if(this.companies.length ==0 ){
      this.Norecordfound==true;
    }

    // Calling the DT trigger to manually render the table
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
     
    
    });
  }

  addCompany() {
    this.isAddFormSubmitted = true;

    if (this.addCompanyForm.value.Company_Name == "" || this.addCompanyForm.value.Address_1 == "" || this.addCompanyForm.value.City == "" || this.addCompanyForm.value.State == "" || this.addCompanyForm.value.State.length > 2 || this.addCompanyForm.value.Phone == "") {
      console.log(" error found");
      this.toastr.error("Please fill in the required input fields", "Form not submitted");

    } else {
      const state = this.addCompanyForm.value.State.toUpperCase();
      let obj = {
        CompanyId: 0,
        CompanyName: this.addCompanyForm.value.Company_Name,
        Address_1: this.addCompanyForm.value.Address_1,
        Address_2: this.addCompanyForm.value.Address_2,
        City: this.addCompanyForm.value.City,
        State: state,
        Zip_Code: this.addCompanyForm.value.Zip_Code,
        Phone: this.addCompanyForm.value.Phone,
        Fax: this.addCompanyForm.value.Fax,
        URL: this.addCompanyForm.value.URL,
      };
      console.log(obj);
      this.companyService.updateCompany(obj).subscribe(
        (res) => {
          this.loadCompany();
          $("#add_Company").modal("hide");
          this.toastr.success("Company added sucessfully...!", "Success");
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }


  editCompany() {
    if (this.editCompanyForm.valid) {
      const state = this.editCompanyForm.value.State.toUpperCase();
      let obj = {
        CompanyId: this.editId,
        CompanyName: this.editCompanyForm.value.Company_Name,
        Address_1: this.editCompanyForm.value.Address_1,
        Address_2: this.editCompanyForm.value.Address_2,
        City: this.editCompanyForm.value.City,
        State: state,
        Zip_Code: this.editCompanyForm.value.Zip_Code,
        Phone: this.editCompanyForm.value.Phone,
        Fax: this.editCompanyForm.value.Fax,
        URL: this.editCompanyForm.value.URL,
      };
      console.log(obj);
      this.companyService.updateCompany(obj).subscribe(
        (res) => {
          this.loadCompany();
          $("#edit_Company").modal("hide");
          this.toastr.success("Company Updated sucessfully...!", "Success");
          window.location.reload();
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

  edit(value) {
    console.log(value);
    this.editCompanyForm.patchValue(value);
    this.editId = value.Company_Information_ID;
    console.log(this.editId);
  }

  FalseState(event: any) {
    const length = event;
    if (!length) {
      this.falseState = false;
    } else if (length.length > 2) {
      this.falseState = true;
    } else {
      this.falseState = false;
    }
  }

  closeModel() {
    this.addCompanyForm.reset();
    this.isAddFormSubmitted = false;
  }

  async getUserRole() {
    const response: any = await this.userService.getUserRole().toPromise();
    this.userRole = response.ResponseData[0].RoleName;
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  keyPress(event: any) {
    const pattern = /[0-9\+\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
}
