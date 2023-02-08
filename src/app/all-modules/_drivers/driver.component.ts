import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { DriverService } from "src/app/shared/services/driver.service";
import { DatePipe } from "@angular/common";

declare const $: any;

@Component({
  selector: "app-driver",
  templateUrl: "./driver.component.html",
  styleUrls: ["./driver.component.css"],
})
export class DriverComponent1 implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject();

  lstDriver: any[];
  url: any = "designation";
  myDate = new Date();
 

  public tempId: any;
  public editId: any;
  public InactiveDriver: any;
  public addDriverForm: FormGroup;
  public editdriverForm: FormGroup;
  public getDriverById = "";
  public HistoryData: any;
  public LoopHistoryData: any;
  public isLoading = false;
  public driverEditdata: any;
  public driverEditLoopData: any;
  public editDriverID: any;
  public findResult = "none";
  public falseState = false;
  public Norecordfound = false;
  hireDate: any;
  hireDateFilter: string;
  public isAddFormSubmitted = false;


  constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private driverService: DriverService, private pipe: DatePipe) {
    this.hireDateFilter = this.pipe.transform(new Date(), "MM-dd-yyyy");
    
  }

  ngOnInit() {
    $("#add_driver").modal({ backdrop: "static", keyboard: false });
    $("#edit_driver").modal({ backdrop: "static", keyboard: false });

    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      lengthChange: true,
      searching: false,
      ordering: false,
     
    };

    this.Loaddriver();

    this.addDriverForm = this.formBuilder.group({
      FullName: ["", [Validators.required]],
      Driver_Type_ID: ["", [Validators.required]],
      Code: ["", [Validators.required]],
      Hire_Date: ["", [Validators.required]],
      Percentage: ["", [Validators.required]],
      Address1: ["", [Validators.required]],
      Address2: "",
      City: ["", [Validators.required]],
      State: ["", [Validators.required,Validators.maxLength(2)]],
      Zip_Code: ["", [Validators.required]],
      Phone: ["", [Validators.required]],
      Fax: "",
      Is_InActive: ["", [Validators.required]],
    });

    this.editdriverForm = this.formBuilder.group({
      FullName: ["", [Validators.required]],
      Driver_Type_ID: ["", [Validators.required]],
      Code: ["", [Validators.required]],
      Hire_Date: ["", [Validators.required]],
      Percentage: ["", [Validators.required]],
      Address1: ["", [Validators.required]],
      Address2: ["", [Validators.required]],
      City: ["", [Validators.required]],
      State: ["", [Validators.required,Validators.maxLength(2)]],
      Zip_Code: ["", [Validators.required]],
      Phone: ["", [Validators.required]],
      Fax: "",
      Is_InActive: ["", [Validators.required]],
    });
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  // Get driver list  Api Call
  Loaddriver() {
    this.isLoading = true;
    this.driverService.getAllDrivers().subscribe((data: any) => {
      this.lstDriver = data.ResponseData;
      this.isLoading = false;
      this.findResult = "none";

      // Calling the DT trigger to manually render the table
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.dtTrigger.next();
    
      
      });
    });
  }

  //Get All Driver with Inactive Api Call
  LoaddriverwithInactive() {
    this.isLoading = true;
    this.driverService.GetAllDriverWithInactive().subscribe((data: any) => {
      this.lstDriver = data.ResponseData;
      this.isLoading = false;

      // Calling the DT trigger to manually render the table
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.dtTrigger.next();
        if(this.lstDriver.length<=0){
          this.dtOptions.language.emptyTable='No Record Found';
        }
     
      });
    });
  }

  searchDriverById(event) {
    this.getDriverById = event;
  }

  ShowAllDriver(event: any) {
    this.InactiveDriver = event.currentTarget.checked;

    if (this.InactiveDriver == true) {
      this.LoaddriverwithInactive();
    } else {
      this.Loaddriver();
    }
  }

  SearchData() {
    this.isLoading = true;
    this.searchDriverById(this.getDriverById);

    if (this.getDriverById == "") {
      this.Loaddriver();
      this.Norecordfound = false;
      this.dtOptions.info=true;
      this.dtOptions.paging=true;
      this.findResult = "none";
    } else {
      this.driverService.getDriverDetailByCode(this.getDriverById).subscribe(
        (res) => {
          this.lstDriver = res.ResponseData;
          if (this.lstDriver.length <= 0) {
            this.Norecordfound = true;
            this.dtOptions.info=false;
            this.dtOptions.paging=false;
          } else {
            this.Norecordfound = false;
            this.dtOptions.info=true;
            this.dtOptions.paging=true;
            this.findResult = "block";
          }
          this.isLoading = false;

          // Calling the DT trigger to manually render the table
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger.next();
        
           
          });
        },
        (err) => {}
      );
    }
  }
  addDriverDate(val) {
    this.hireDate = this.pipe.transform(val, "MM-dd-yyyy");
  }

  // Add driver  Modal Api Call
  adddriver() {
    this.isAddFormSubmitted = true;
    var driverTypeID = Number(this.addDriverForm.value.Driver_Type_ID);
    var driverPercentage = Number(this.addDriverForm.value.Percentage);
    var IsActive = Boolean(this.addDriverForm.value.Is_InActive);
    const state = this.addDriverForm.value.State.toUpperCase();
    const HireDate:Date = this.addDriverForm.value.Hire_Date;
    console.log(HireDate);
    console.log(this.addDriverForm.value.Hire_Date)
   
    const adDriver = {
      Id: 0,
      UserId: "",
      DriverID: 0,
      DriverTypeID: driverTypeID,
      Code: this.addDriverForm.value.Code,
      FullName: this.addDriverForm.value.FullName,
      HireDate: new Date(Date.UTC(HireDate.getFullYear(), HireDate.getMonth(), HireDate.getDate())).toISOString(),
      Percentage: driverPercentage,
      Address1: this.addDriverForm.value.Address1,
      Address2: this.addDriverForm.value.Address2,
      City: this.addDriverForm.value.City,
      State: state,
      ZipCode: this.addDriverForm.value.Zip_Code,
      Phone: this.addDriverForm.value.Phone,
      Fax: this.addDriverForm.value.Fax,
      IsInactive: IsActive,
    };
    console.log(adDriver.Code)

    if (this.addDriverForm.value.Code == "" || this.addDriverForm.value.Percentage == "" ||  this.addDriverForm.value.FullName == "" ||  this.addDriverForm.value.Address1 == "" || this.addDriverForm.value.Phone == "" || this.addDriverForm.value.Zip_Code == "" || this.addDriverForm.value.City == "" || this.addDriverForm.value.State == "" || this.addDriverForm.value.State.length > 2)
     {
      this.toastr.error("Please fill in the required input fields", "Form not submitted");
    } else {
this.driverService.getDriverDetailByCode(adDriver.Code).subscribe((res)=>{

  console.log("this is res")
  console.log(res)
  console.log("this is res length")
  console.log(res.ResponseData.length)

  if(res.ResponseData.length==0){
    this.driverService.addDriver(adDriver).subscribe((data) => {
      this.toastr.success("Driver added sucessfully...!", "Success");
      $("#add_driver").modal("hide");
      this.addDriverForm.reset();
      this.Loaddriver();
    });
  }
  else{
    this.toastr.error("Driver Code is already in use.")
  }
})

     
    }
  }

  editdriver() {
    if (this.editdriverForm.value.Code == "" || this.editdriverForm.value.Percentage == "" || this.editdriverForm.value.FullName == "" || this.editdriverForm.value.Address1 == "" || this.editdriverForm.value.Phone == "" || this.editdriverForm.value.Zip_Code == "" || this.editdriverForm.value.City == "" || this.editdriverForm.value.State == "" || this.editdriverForm.value.State.length > 2) {
       this.toastr.error( "Please fill in the required input fields" , "Form not submitted");
    } else {
      var driverTypeID = Number(this.editdriverForm.value.Driver_Type_ID);
      var driverPercentage = Number(this.editdriverForm.value.Percentage);
      var IsActive = Boolean(this.editdriverForm.value.Is_InActive);
      const HireDate = this.editdriverForm.value.Hire_Date;
      console.log(HireDate);
      console.log(this.editdriverForm.value.Hire_Date);
    

      const state = this.editdriverForm.value.State.toUpperCase();
      const adDriver = {
        Id: 0,
        UserId: "",
        DriverID: this.editDriverID,
        DriverTypeID: driverTypeID,
        Code: this.editdriverForm.value.Code,
        FullName: this.editdriverForm.value.FullName,
        HireDate: new Date(Date.UTC(HireDate.getFullYear(), HireDate.getMonth(), HireDate.getDate())).toISOString(),
        Percentage: driverPercentage,
        Address1: this.editdriverForm.value.Address1,
        Address2: this.editdriverForm.value.Address2,
        City: this.editdriverForm.value.City,
        State: state,
        ZipCode: this.editdriverForm.value.Zip_Code,
        Phone: this.editdriverForm.value.Phone,
        Fax: this.editdriverForm.value.Fax,
        IsInactive: IsActive,
      };

      console.log({ ...adDriver });

      this.driverService.addDriver(adDriver).subscribe((data) => {
        this.toastr.success("Driver Updated sucessfully...!", "Success");
        $("#edit_driver").modal("hide");
        this.Loaddriver();
      });
    }
  }

  // To Get The timesheet Edit Id And Set Values To Edit Modal Form
  edit(driverId) {
    this.editDriverID = driverId;
    this.driverService.getDriverDetailByDriverId(driverId).subscribe((data) => {
      this.driverEditdata = data;
      this.driverEditLoopData = this.driverEditdata.ResponseData;
      this.editdriverForm.controls["Code"].setValue(this.driverEditLoopData[0].Code);
      this.editdriverForm.controls["FullName"].setValue(this.driverEditLoopData[0].Full_Name);
      this.editdriverForm.controls["Address1"].setValue(this.driverEditLoopData[0].Address_1);
      this.editdriverForm.controls["Address2"].setValue(this.driverEditLoopData[0].Address_2);
      this.editdriverForm.controls["City"].setValue(this.driverEditLoopData[0].City);
      this.editdriverForm.controls["Zip_Code"].setValue(this.driverEditLoopData[0].Zip_Code);
      this.editdriverForm.controls["Phone"].setValue(this.driverEditLoopData[0].Phone);
      this.editdriverForm.controls["State"].setValue(this.driverEditLoopData[0].State.toUpperCase());
      this.editdriverForm.controls["Fax"].setValue(this.driverEditLoopData[0].Fax);
      this.editdriverForm.controls["Percentage"].setValue(this.driverEditLoopData[0].Percentage);
      this.editdriverForm.controls["Is_InActive"].setValue(this.driverEditLoopData[0].Is_Inactive);
      this.editdriverForm.controls["Hire_Date"].setValue(new Date(`${this.pipe.transform(this.driverEditLoopData[0].Hire_Date, "MM/dd/yyyy")}`));
      this.editdriverForm.controls["Driver_Type_ID"].setValue(this.driverEditLoopData[0].Driver_Type_ID);
    });
  }

  // Delete timedsheet Modal Api Call
  deletedriver() {}

  adsddriver() {
    const urlParams = `driverID=0&driverTypeID=${this.addDriverForm.value.Driver_Type_ID}&code=${this.addDriverForm.value.Code}
     &fullName=${this.addDriverForm.value.FullName}&hireDate=${this.addDriverForm.value.Hire_Date}&percentage=${this.addDriverForm.value.Percentage}
     &address1=${this.addDriverForm.value.Address1}&address2=${this.addDriverForm.value.Address2}&city=${this.addDriverForm.value.City}
     &state=${this.addDriverForm.value.State}&zipCode=${this.addDriverForm.value.Zip_Code}&phone=${this.addDriverForm.value.Phone}
     &fax=${this.addDriverForm.value.Fax}&IsInactive=${this.addDriverForm.value.Is_InActive}`;
    this.driverService.adsdDriver(urlParams, this.addDriverForm.value).subscribe(
      (res) => {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
        });
        this.toastr.success("Driver added sucessfully...!", "Success");
        $("#add_driver").modal("hide");
        this.addDriverForm.reset();
        this.Loaddriver();
      },
      (err) => {}
    );
  }

  getHistory(id) {
    this.driverService.getHistoryById(id).subscribe((data) => {
      this.HistoryData = data;
      this.LoopHistoryData = this.HistoryData.ResponseData;
    });
  }

  FalseState(event) {
    const length = event;

    if (length.length > 2) {
      this.falseState = true;
    } else if (length == "") {
      this.falseState = false;
    } else {
      this.falseState = false;
    }
  }

  closeModel() {
    this.addDriverForm.reset();
    this.editdriverForm.reset();
    this.isAddFormSubmitted=false;
    // this.hireDate = this.pipe.transform(this.myDate, "MM-dd-yyyy");
    this.addDriverForm.controls["Hire_Date"].setValue(new Date());

    

  }

  //get Driver Details for edit form
  getDriverDetailById(id) {
    this.driverService.getDriverDetailByDriverId(id).subscribe(
      (res) => {
        this.editdriverForm.patchValue(res.ResponseData[0]);
        // this.editdriverForm.controls.Hire_Date.setValue(this.pipe.transform(res.ResponseData[0].Hire_Date, "yyyy-MM-dd"));
        this.editdriverForm.controls["Hire_Date"].setValue(new Date(`${this.pipe.transform(res.ResponseData[0].Hire_Date, "MM/dd/yyyy")}`));

      },
      (err) => {}
    );
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  keyPress(event: any) {
    const pattern = /[0-9\+\ % \.]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
}
