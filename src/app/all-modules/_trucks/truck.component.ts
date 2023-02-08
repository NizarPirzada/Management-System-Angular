import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { TruckService } from "src/app/shared/services/truck.service";
import { DriverService } from "src/app/shared/services/driver.service";

declare const $: any;

@Component({
  selector: "app-truck",
  templateUrl: "./truck.component.html",
  styleUrls: ["./truck.component.css"],
})
export class TruckComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject();

  public truckID: any;
  public truckTypes: [];
  public truckData: any;
  public loopTruckData: any;
  public driverData: any;
  public loopDriverData: any;
  public truckDataByTruckId: any;
  public loopTruckDataByTruckId: any;
  public driverDataByDriverId: any;
  public loopDriverDataByDriverId: any;
  public InactiveTruck: any;
  public tempId: any;
  public editId: any;
  public selected: boolean = false;
  public SearcCode = "";
  public DriverID: any;
  public TruckTypeID: any;
  public Norecordfound = false;
  public HistoryData: any;
  public LoopHistoryData: any;
  public findResult = "none";
  public addTruckForm: FormGroup;
  public editTruckForm: FormGroup;
  public isLoading = false;
  public isAddFormSubmitted = false;
  constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private truckService: TruckService, private driverService: DriverService) {}

  ngOnInit() {
    $("#add_truck").modal({ backdrop: "static", keyboard: false });
    $("#edit_truck").modal({ backdrop: "static", keyboard: false });

    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      lengthChange: true,
      searching: false,
      ordering: false,
      processing: true,
    
      language: {
        emptyTable: '',
      },
    };

    this.getTruckTypes();
    this.loadTrucks();
    this.getAllDriversList();

    this.addTruckForm = this.formBuilder.group({
      defaultDriverID: ["", [Validators.required]],
      code: ["", [Validators.required]],
      description: ["", [Validators.required]],
      defaultTruckType: ["", [Validators.required]],
      IsInActive: ["", [Validators.required]],
    });

    this.editTruckForm = this.formBuilder.group({
      truckID: ["", [Validators.required]],
      defaultDriverID: ["", [Validators.required]],
      code: ["", [Validators.required]],
      description: ["", [Validators.required]],
      defaultTruckType: ["", [Validators.required]],
      IsInActive: ["", [Validators.required]],
    });
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  getTruckTypes() {
    this.isLoading = true;
    this.truckService.getTruckTypes().subscribe((data) => {
      const response: any = data;
      this.truckTypes = response.ResponseData;
      this.isLoading = false;
    });
  }

  // Get truck list  Api Call
  loadTrucks() {
    this.isLoading = true;
    this.truckService.getAllTrucks().subscribe((data) => {
      this.truckData = data;
      this.loopTruckData = this.truckData.ResponseData;
      this.isLoading = false;

      // Calling the DT trigger to manually render the table
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.dtTrigger.next();
       
       
      });
    });
  }

  loadTruckwithInactive() {
    this.isLoading = true;
    this.truckService.getAllTruckswithInactive().subscribe((data) => {
      this.truckData = data;
      this.loopTruckData = this.truckData.ResponseData;
      this.isLoading = false;

      // Calling the DT trigger to manually render the table
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.dtTrigger.next();
     
       
      });
    });
  }

  // Show All Truck with Inactive Api Call
  ShowAllTruck(event: any) {
    this.InactiveTruck = event.currentTarget.checked;
    this.isLoading = true;
    if (this.InactiveTruck == true) {
      this.loadTruckwithInactive();
    } else {
      this.loadTrucks();
    }
  }

  // Get truck detail by truck Id  Api Call
  getTruckDetailByTruckID(id) {
    this.truckService.getTruckDetailByTruckId(id).subscribe((data) => {
      this.truckDataByTruckId = data;
      this.loopTruckDataByTruckId = this.truckDataByTruckId.ResponseData;

      // Calling the DT trigger to manually render the table
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.dtTrigger.next();
        if(this.loopTruckDataByTruckId.length<=0){
          this.dtOptions.language.emptyTable='No Record Found';
        }
       
      });

      this.editTruckForm.controls["truckID"].setValue(this.loopTruckDataByTruckId[0].ID);
      this.editTruckForm.controls["defaultDriverID"].setValue(this.loopTruckDataByTruckId[0].Default_Driver_ID);
      this.editTruckForm.controls["code"].setValue(this.loopTruckDataByTruckId[0].Code);
      this.editTruckForm.controls["description"].setValue(this.loopTruckDataByTruckId[0].Description);
      this.editTruckForm.controls["defaultTruckType"].setValue(this.loopTruckDataByTruckId[0].TruckType_id);
      this.editTruckForm.controls["IsInActive"].setValue(this.loopTruckDataByTruckId[0].Is_Inactive);
    });
  }

  //Get all drivers list
  getAllDriversList() {
    this.driverService.getAllDrivers().subscribe((data) => {
      this.driverData = data;
      this.loopDriverData = this.driverData.ResponseData;
    });
  }

  // Add product  Modal Api Call
  addTruck() {
    this.isAddFormSubmitted = true;

    if (this.addTruckForm.value.defaultDriverID == "" || this.addTruckForm.value.defaultDriverID == null || this.addTruckForm.value.description == "" || this.addTruckForm.value.description == null || this.addTruckForm.value.defaultTruckType == "" || this.addTruckForm.value.defaultTruckType == null || this.addTruckForm.value.code == "" || this.addTruckForm.value.code == null) {
      this.toastr.error("Please fill in the required input fields", "Form not submitted");
    } else {
      const truckValue = {
        TruckID: 0,
        TruckTypeID: this.addTruckForm.value.defaultTruckType,
        DefaultDriverID: this.addTruckForm.value.defaultDriverID,
        Code: this.addTruckForm.value.code,
        Description: this.addTruckForm.value.description,
        IsInactive: Boolean(this.addTruckForm.value.IsInActive),
      };


this.truckService.getTruckDetailByCode(truckValue.Code).subscribe((res)=>{
  console.log("this is res");
  console.log(res);
  console.log("this is res length");
  console.log(res.ResponseData.length);
  if(res.ResponseData.length==0){
    this.truckService.addTruck(truckValue).subscribe(
      (res) => {
        this.loadTrucks();
        this.toastr.success("truck added sucessfully...!", "Success");
        $("#add_truck").modal("hide");
        this.addTruckForm.reset();
        this.loadTrucks();
      },
      (err) => {}
    );
  }
  else{
    this.toastr.error("Truck Code is already in use.")
  }
})

     
    }
  }

  updateTruck() {
    if (this.editTruckForm.value.defaultDriverID == "" || this.editTruckForm.value.defaultDriverID == null || this.editTruckForm.value.description == "" || this.editTruckForm.value.description == null || this.editTruckForm.value.code == "" || this.editTruckForm.value.code == null) {
      this.toastr.error("Please fill in the required input fields", "Form not submitted");
    } else {
      const truckValue = {
        TruckID: this.editTruckForm.value.truckID,
        TruckTypeID: this.editTruckForm.value.defaultTruckType,
        DefaultDriverID: this.editTruckForm.value.defaultDriverID,
        Code: this.editTruckForm.value.code,
        Description: this.editTruckForm.value.description,
        IsInactive: this.editTruckForm.value.IsInActive,
      };
      this.truckService.updateTruckByTruckID(truckValue).subscribe(
        (res) => {
          this.loadTrucks();
          this.toastr.success("Truck Updated sucessfully...!", "Success");
          $("#edit_truck").modal("hide");
          this.editTruckForm.reset();
          this.findResult = "none";
          this.loadTrucks();
        },

        (err) => {}
      );
    }
  }

  // To Get The timesheet Edit Id And Set Values To Edit Modal Form
  edit(id) {
    this.getTruckDetailByTruckID(id);
  }

  // Delete timedsheet Modal Api Call
  deleteTruck() {}

  searchTruckbycode(code) {
    this.SearcCode = code;
  }

  SearchData() {
    this.searchTruckbycode(this.SearcCode);

    this.isLoading = true;
    if (this.SearcCode == "") {
      this.loadTrucks();
      this.Norecordfound = false;
      this.dtOptions.info=true;
      this.dtOptions.paging=true;
      this.findResult = "none";
     
    } else {
      this.truckService.getTruckDetailByCode(this.SearcCode).subscribe(
        (res) => {
          this.truckData = res;
          this.loopTruckData = this.truckData.ResponseData;

          if (this.loopTruckData.length <= 0) {
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
            if(this.loopTruckData.length<=0){
              this.dtOptions.language.emptyTable='No Record Found';
            }
           
          });
        },
        (err) => {}
      );
    }
  }

  getHistory(id) {
    this.truckService.getHistoryById(id).subscribe((data) => {
      this.HistoryData = data;
      this.LoopHistoryData = this.HistoryData.ResponseData;
    });
  }

  closeModel() {
    this.isAddFormSubmitted = false;
    this.addTruckForm.reset();
    this.editTruckForm.reset();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
}
