import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { CustomerService } from "src/app/shared/services/customer.service";

declare const $: any;

@Component({
  selector: "app-customer",
  templateUrl: "./customer.component.html",
  styleUrls: ["./customer.component.css"],
})
export class CustomerComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject();

  public customerData: any;
  public loopCustomerData: any;
  public tempId: any;
  public editId: any;
  public customerEditId: any;
  public rows = [];
  public srch = [];
  public addCustomerForm: FormGroup;
  public editCustomerForm: FormGroup;
  public InactiveCustomer: any;
  public SearchResultByCustomerID = "";
  public EditCustomerData: any;
  public Norecordfound = false;
  public HistoryData: any;
  public LoopHistoryData: any;
  public findResult = "none";
  public isLoading = false;
  public isAddFormSubmitted = false;
  public statee: "";
  public falseState = false;

  constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private customerService: CustomerService) {}

  ngOnInit() {
    $("#add_customer").modal({ backdrop: "static", keyboard: false });
    $("#edit_customer").modal({ backdrop: "static", keyboard: false });

    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      lengthChange: true,
      searching: false,
      ordering: false,
     
    };

    this.loadCustomers();

    this.addCustomerForm = this.formBuilder.group({
      UserId: ["", [Validators.required]],
      CustomerId: ["", [Validators.required]],
      Code: ["", [Validators.required]],
      Description: ["", [Validators.required]],
      Address_1: ["", [Validators.required]],
      Address_2: "",
      City: ["", [Validators.required]],
      State: ["", [Validators.required,Validators.maxLength(2)]],
      Zip_Code: ["", [Validators.required]],
      Phone: ["", [Validators.required]],
      Fax: "",
      IsInActive: ["", [Validators.required]],
    });

    this.editCustomerForm = this.formBuilder.group({
      UserId: ["", [Validators.required]],
      CustomerId: ["", [Validators.required]],
      Code: ["", [Validators.required]],
      Description: ["", [Validators.required]],
      Address_1: ["", [Validators.required]],
      Address_2: "",
      City: ["", [Validators.required]],
      State: ["", [Validators.required,Validators.maxLength(2)]],
      Zip_Code: ["", [Validators.required]],
      Phone: ["", [Validators.required]],
      Fax: "",
      IsInActive: ["", [Validators.required]],
    });
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  // Get customer list  Api Call
  loadCustomers() {
    this.isLoading = true;
    this.customerService.getAllCustomers().subscribe((data) => {
      console.log(data);
      this.customerData = data;
      this.loopCustomerData = this.customerData.ResponseData;
      this.isLoading = false;

      // Calling the DT trigger to manually render the table
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.dtTrigger.next();
       
        
      });
    });
  }

  // Get All customer with Inactive api list
  loadCustomersWithInactive() {
    this.isLoading = true;
    this.customerService.getAllCustomersWithInactive().subscribe((data) => {
      console.log(data);
      this.customerData = data;
      this.loopCustomerData = this.customerData.ResponseData;
      this.isLoading = false;

      // Calling the DT trigger to manually render the table
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.dtTrigger.next();
      
       
      });
    });
  }

  // Show all customer and active customer Checkbox
  ShowAllCustomer(event: any) {
    this.InactiveCustomer = event.currentTarget.checked;
    console.log(this.InactiveCustomer);

    if (this.InactiveCustomer == true) {
      console.log("All Customer With Inactive ");
      this.loadCustomersWithInactive();
    } else {
      console.log("All Active Customer ");
      this.loadCustomers();
    }
  }

  // Search result by Customer Code
  searchCustomerById(id) {
    this.SearchResultByCustomerID = id;
  }

  SearchData() {
    this.isLoading = true;
    this.searchCustomerById(this.SearchResultByCustomerID);
    if (this.SearchResultByCustomerID == "") {
      this.loadCustomers();
      this.Norecordfound = false;
      this.dtOptions.info=true;
      this.dtOptions.paging=true;
      this.findResult = "none";
    } else {
      this.customerService.getCustomerBycode(this.SearchResultByCustomerID).subscribe(
        (res) => {
          console.log(res);
          this.customerData = res;
          this.loopCustomerData = this.customerData.ResponseData;
          if (this.loopCustomerData.length <= 0) {
            console.log(" customer not found");
            this.Norecordfound = true;
            this.dtOptions.info=false;
            this.dtOptions.paging=false;
            this.isLoading = false;
          } else {
            this.Norecordfound = false;
            this.dtOptions.info=true;
            this.dtOptions.paging=true;
            this.findResult = "block";
            this.isLoading = false;
          }

          // Calling the DT trigger to manually render the table
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger.next();
           
         
          });
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

  FalseState(event) {
    const length = event;
    this.statee = event;

    if (length.length > 2) {
      this.falseState = true;
    } else if (length == "") {
      this.falseState = false;
    } else {
      this.falseState = false;
    }
  }

  // Add customer  Modal Api Call
  addCustomer() {
    console.log("eee");
    this.isAddFormSubmitted = true;
console.log(this.addCustomerForm)
    if (this.addCustomerForm.value.Code == "" || this.addCustomerForm.value.Code == null || this.addCustomerForm.value.Description == "" || this.addCustomerForm.value.Address_1 == "" || this.addCustomerForm.value.Phone == "" || this.addCustomerForm.value.Zip_Code == "" || this.addCustomerForm.value.City == "" || this.addCustomerForm.value.State == "" || this.addCustomerForm.value.State.length > 2) {
      this.toastr.error( "Please fill in the required input fields" , "Form not submitted");
     
    } else {
      var IsActive = Boolean(this.addCustomerForm.value.IsInActive);
      const state = this.addCustomerForm.value.State.toUpperCase();

      const customerValues = {
        CustomerId: 0,
        Code: this.addCustomerForm.value.Code,
        Description: this.addCustomerForm.value.Description,
        Address_1: this.addCustomerForm.value.Address_1,
        Address_2: this.addCustomerForm.value.Address_2,
        City: this.addCustomerForm.value.City,
        State: state,
        Zip_Code: this.addCustomerForm.value.Zip_Code,
        Phone: this.addCustomerForm.value.Phone,
        Fax: this.addCustomerForm.value.Fax,
        PaymentTerms: "",
        IsInActive: IsActive,
      };

      console.log({ ...customerValues });
      console.log(customerValues.Code);

this.customerService.getCustomerBycode(customerValues.Code).subscribe((res)=>{
  console.log("this is res")
  console.log(res)
  console.log("this is res length")
  console.log(res.ResponseData.length)

  if(res.ResponseData.length==0){
    this.customerService.addCustomer(customerValues).subscribe(
      (res) => {
        console.log(res);
        this.loadCustomers();
        this.toastr.success("Customer added sucessfully...!", "Success");
        $("#add_customer").modal("hide");
        this.addCustomerForm.reset();
      },
      (err) => {
        console.log(err);
      }
    );
  }
  else{
    this.toastr.error("Customer Code is already in use.")
  }
})



    
    }
  }

  editCustomer() {
    if (this.editCustomerForm.value.Code == "" || this.editCustomerForm.value.Code == null || this.editCustomerForm.value.Description == "" || this.editCustomerForm.value.Address_1 == "" || this.editCustomerForm.value.Phone == "" || this.editCustomerForm.value.Zip_Code == "" || this.editCustomerForm.value.City == "" || this.editCustomerForm.value.State == "" || this.editCustomerForm.value.State.length > 2) {
      // this.toastr.error( "Please fill in the required input fields" , "Form not submitted");
    } else {
      var IsActive = Boolean(this.editCustomerForm.value.IsInActive);
      const state = this.editCustomerForm.value.State.toUpperCase();
      const customerValues = {
        CustomerId: this.customerEditId,
        Code: this.editCustomerForm.value.Code,
        Description: this.editCustomerForm.value.Description,
        Address_1: this.editCustomerForm.value.Address_1,
        Address_2: this.editCustomerForm.value.Address_2,
        City: this.editCustomerForm.value.City,
        State: state,
        Zip_Code: this.editCustomerForm.value.Zip_Code,
        Phone: this.editCustomerForm.value.Phone,
        Fax: this.editCustomerForm.value.Fax,
        PaymentTerms: "",
        IsInActive: IsActive,
      };

      this.customerService.addCustomer(customerValues).subscribe(
        (res) => {
          console.log(res);
          this.loadCustomers();
          this.toastr.success("Customer updated sucessfully...!", "Success");
          $("#edit_customer").modal("hide");
          this.editCustomerForm.reset();
          this.findResult = "none";
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

  // To Get The timesheet Edit Id And Set Values To Edit Modal Form
  edit(value) {
    console.log(this.loopCustomerData);
    this.customerEditId = value;
    this.customerService.getCustomerById(this.customerEditId).subscribe((data) => {
      console.log(data);
      this.customerData = data;
      this.EditCustomerData = this.customerData.ResponseData;
      this.editCustomerForm.controls["Code"].setValue(this.EditCustomerData[0].Code);
      this.editCustomerForm.controls["Description"].setValue(this.EditCustomerData[0].Description);
      this.editCustomerForm.controls["Address_1"].setValue(this.EditCustomerData[0].Address_1);
      this.editCustomerForm.controls["Address_2"].setValue(this.EditCustomerData[0].Address_2);
      this.editCustomerForm.controls["City"].setValue(this.EditCustomerData[0].City);
      this.editCustomerForm.controls["Zip_Code"].setValue(this.EditCustomerData[0].Zip_Code);
      this.editCustomerForm.controls["Phone"].setValue(this.EditCustomerData[0].Phone);
      this.editCustomerForm.controls["State"].setValue(this.EditCustomerData[0].State.toUpperCase());
      this.editCustomerForm.controls["Fax"].setValue(this.EditCustomerData[0].Fax);
      this.editCustomerForm.controls["IsInActive"].setValue(this.EditCustomerData[0].Is_InActive);
    });
  }

  // Clear form
  closeModel() {
    this.isAddFormSubmitted = false;
    this.addCustomerForm.reset();
    this.editCustomerForm.reset();
  }

  // Delete timedsheet Modal Api Call
  deleteCustomer() {}

  getHistory(id) {
    console.log("given id is " + id);
    this.customerService.getHistoryById(id).subscribe((data) => {
      console.log(data);
      this.HistoryData = data;
      this.LoopHistoryData = this.HistoryData.ResponseData;
    });
  }

  onChange(event: Event) {
    console.log((event.target as HTMLInputElement).value);
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
