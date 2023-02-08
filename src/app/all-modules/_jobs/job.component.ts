import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { DatePipe } from "@angular/common";
import { CustomerService } from "src/app/shared/services/customer.service";
import { JobService } from "src/app/shared/services/job.service";
import { ProductService } from "src/app/shared/services/product.service";

declare const $: any;

@Component({
  selector: "app-job",
  templateUrl: "./job.component.html",
  styleUrls: ["./job.component.css"],
})
export class JobComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject();

  lstJob: any[];
  url: any = "designation";

  public tempId: any;
  public editId: any;
  public customerData: any;
  public loopCustomerData: any;
  public jobData: any;
  public loopJobData: any;
  public jobDetailByJobId: any;
  public loopJobDetailByJobId: any;
  public productData: any;
  public loopProductData: any;
  public productDetail: any;
  public loopProductDetail: any;
  public productDetailbyjobid: any;
  public loopProductDetailbyjobid: any;
  public selectedjobid: any;
  public IncompleeteJob: any;
  public addJobForm: FormGroup;
  public updateJobForm: FormGroup;
  public editJobForm: FormGroup;
  public addProductForm: FormGroup;
  public addProductJobForm: FormGroup;
  public NewaddedJobId = null;
  public ProductDataByJobID: any;
  public loopProductByJobID: any;
  public singlecustomerData: any;
  public loopsingleCustomer: any;
  public displayproduct = "none";
  public HistoryData: any;
  public LoopHistoryData: any;
  public selectedCustomerId: any;
  public Norecordfound;
  public jobByCode: any;

  myDate = new Date();

  public awardDate = this.pipe.transform(this.myDate, "MM-dd-yyyy");
  public customerDetailById: any;
  public loopcustomerDetailById: any;
  public isLoading = false;

  selectedCustomer: number = 0;
  awardDateFilter: string;
  codeJobData: any[];
  loopCodeJobData: any;

  constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private jobService: JobService, private customerService: CustomerService, private productService: ProductService, private pipe: DatePipe) {
    this.awardDateFilter = this.pipe.transform(new Date(), "MM-dd-yyyy");
  }

  ngOnInit() {
    $("#add_jobs").modal({ backdrop: "static", keyboard: false });
    $("#edit_job").modal({ backdrop: "static", keyboard: false });

    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      lengthChange: true,
      searching: false,
      ordering: false,
      language: {
        emptyTable: " ",
      },
    };

    this.loadCustomers();
    this.GetAllProducts();

    this.addJobForm = this.formBuilder.group({
      Customer_ID: ["", [Validators.required]],
      Code: ["", [Validators.required]],
      Description: ["", [Validators.required]],
      PO_Number: ["", [Validators.required]],
      Is_Complete: "",
      Awarded_Date: ["", [Validators.required]],
      Location: "",
    });

    this.updateJobForm = this.formBuilder.group({
      Customer_ID: ["", [Validators.required]],
      Code: ["", [Validators.required]],
      Description: ["", [Validators.required]],
      PO_Number: ["", [Validators.required]],
      Is_Complete: "",
      Awarded_Date: ["", [Validators.required]],
      Location: "",
    });

    this.addProductForm = this.formBuilder.group({
      Product_Name: ["", [Validators.required]],
      Product_Code: ["", [Validators.required]],
      Product_Description: ["", [Validators.required]],
      Price: ["", [Validators.required]],
      Driver_Price: ["", [Validators.required]],
    });

    this.addProductJobForm = this.formBuilder.group({
      Job_Product_ID: 0,
      Product_Name: "",
      Product_Code: ["", [Validators.required]],
      Product_Description: ["", [Validators.required]],
      Price: ["", [Validators.required]],
      Driver_Price: ["", [Validators.required]],
    });

    this.editJobForm = this.formBuilder.group({
      Customer_ID: ["", [Validators.required]],
      Code: ["", [Validators.required]],
      Description: ["", [Validators.required]],
      PO_Number: ["", [Validators.required]],
      Is_Complete: "",
      Awarded_Date: ["", [Validators.required]],
      Location: "",
    });

    this.addProductJobForm.controls["Product_Name"].setValue(null);
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  onCustomerChange(value: number) {
    if (value == 0) {
      this.Norecordfound = true;
      this.jobData = null;
      this.loopJobData = null;
      return;
    }

    this.getJobByCustomerID(value);
  }

  // Get customer list  Api Call
  loadCustomers() {
    this.customerService.getAllCustomers().subscribe((data) => {
      console.log(data);
      this.customerData = data;
      this.loopCustomerData = this.customerData.ResponseData;
    });
  }

  getCustomerByID(id: number) {
    this.customerService.getCustomerById(id).subscribe((data) => {
      this.customerDetailById = data;
      this.loopcustomerDetailById = this.customerDetailById.ResponseData;
    });
  }

  GetJobByCode() {
    this.isLoading = true;
    console.log(this.jobByCode.length);
    if (this.jobByCode == 0) {
      this.isLoading = false;
      this.Norecordfound = false;
      this.loopJobData = null;
      this.dtOptions.info = false;
      this.dtOptions.paging = false;

      return;
    }
    this.jobService.getJobByCode(this.jobByCode).subscribe((data) => {
      this.jobData = data;
      this.loopJobData = this.jobData.ResponseData;
      this.dtOptions.info = true;
      this.dtOptions.paging = true;

      this.isLoading = false;
      if (this.loopJobData.length <= 0) {
        this.Norecordfound = true;
        this.dtOptions.info = false;
        this.dtOptions.paging = false;
        this.isLoading = false;
      } else {
        this.Norecordfound = false;
        this.dtOptions.info = true;
        this.dtOptions.paging = true;
      }

      // Calling the DT trigger to manually render the table
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.dtTrigger.next();
      });
    });
  }
  //Get Job by customer id
  getJobByCustomerID(id: number) {
    this.isLoading = true;
    this.Norecordfound = false;
    this.selectedCustomerId = id;

    this.jobService.getJobById(id).subscribe((data) => {
      this.jobData = data;
      this.isLoading = false;
      this.loopJobData = this.jobData.ResponseData;
      this.dtOptions.info = true;
      this.dtOptions.paging = true;

      // Calling the DT trigger to manually render the table
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.dtTrigger.next();
      });

      if (this.loopJobData.length > 0) {
        this.dtOptions.info = true;
        this.dtOptions.paging = true;
        this.Norecordfound = false;
      } else {
        this.Norecordfound = true;
        this.dtOptions.info = false;
        this.dtOptions.paging = false;
      }
    });

    this.getCustomerByID(this.selectedCustomerId);
  }

  getCompleteJobByCustomerID(id: number) {
    this.isLoading = true;
    this.jobService.getCompleteJobById(id).subscribe((data) => {
      // Calling the DT trigger to manually render the table
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.dtTrigger.next();
      });

      this.isLoading = false;
    });
  }

  ShowAllJobwithComplete(value) {
    this.isLoading = true;
    this.IncompleeteJob = value.currentTarget.checked;
    console.log(this.IncompleeteJob);

    if (this.IncompleeteJob == true) {
      this.getCompleteJobByCustomerID(this.selectedCustomerId);
    } else {
      this.getJobByCustomerID(this.selectedCustomerId);
    }
  }

  //get job detail by job id
  getJobDetailByJobID(id: number) {
    this.jobService.getJobDetailByJobId(id).subscribe((data) => {
      this.jobDetailByJobId = data;
      this.loopJobDetailByJobId = this.jobDetailByJobId.ResponseData;

      this.updateJobForm.controls.Customer_ID.setValue(`${this.loopJobDetailByJobId[0].Customer_ID}`);
      this.updateJobForm.controls.Code.setValue(`${this.loopJobDetailByJobId[0].Code}`);
      this.updateJobForm.controls.Description.setValue(`${this.loopJobDetailByJobId[0].Description}`);
      this.updateJobForm.controls.PO_Number.setValue(`${this.loopJobDetailByJobId[0].PO_Number}`);
      this.updateJobForm.controls.Location.setValue(`${this.loopJobDetailByJobId[0].Location}`);
      this.updateJobForm.controls.Is_Complete.setValue(this.loopJobDetailByJobId[0].Is_Complete);
      this.updateJobForm.controls.Awarded_Date.setValue(new Date(`${this.pipe.transform(this.loopJobDetailByJobId[0].Awarded_Date, "MM/dd/yyyy")}`));
    });
  }

  //Get Product by job id
  getProductByJobID(id: number) {
    this.productService.getProductById(id).subscribe((data) => {
      this.ProductDataByJobID = data;
      this.loopProductByJobID = this.ProductDataByJobID.ResponseData;
      console.log(this.loopProductByJobID);
    });
  }

  GetAllProducts() {
    this.productService.getAllProducts().subscribe((data) => {
      console.log(data);
      this.productData = data;
      this.loopProductData = this.productData.ResponseData;
    });
  }

  //Get product details by product id
  getProductDetailsByID() {
    let id: any = this.addProductJobForm.value.Product_Name == null ? 0 : this.addProductJobForm.value.Product_Name;
    this.productService.getProductDetailsByProductId(id).subscribe((data) => {
      this.productDetail = data;
      this.loopProductDetail = this.productDetail.ResponseData;

      if (this.loopProductDetail.length > 0) {
        this.addProductJobForm.controls.Product_Code.setValue(`${this.loopProductDetail[0].Code}`);
        this.addProductJobForm.controls.Product_Description.setValue(`${this.loopProductDetail[0].Description}`);
        this.addProductJobForm.controls.Price.setValue(`${this.loopProductDetail[0].Price}`);
      } else {
        this.addProductJobForm.controls.Product_Code.setValue("");
        this.addProductJobForm.controls.Product_Description.setValue("");
        this.addProductJobForm.controls.Price.setValue("");
      }
    });
  }

  addJobDate(val) {
    this.awardDate = this.pipe.transform(val, "MM-dd-yyyy");
  }

  UpdateJobDate(val) {
    this.awardDate = this.pipe.transform(val, "MM-dd-yyyy");
  }

  // Add product  Modal Api Call
  addJob() {
    if (this.NewaddedJobId == null) {
      if (this.addJobForm.value.Customer_ID == null || this.addJobForm.value.Customer_ID == "" || this.addJobForm.value.Code == null || this.addJobForm.value.Code == "" || this.addJobForm.value.Description == null || this.addJobForm.value.Description == "" || this.addJobForm.value.PO_Number == null || this.addJobForm.value.PO_Number == "" || this.addProductJobForm.value.Product_Code == null || this.addProductJobForm.value.Product_Code == "" || this.addProductJobForm.value.Product_Description == null || this.addProductJobForm.value.Product_Description == "" || this.addProductJobForm.value.Price == null || this.addProductJobForm.value.Price == "" || this.addProductJobForm.value.Driver_Price == null || this.addProductJobForm.value.Driver_Price == "") {
        this.toastr.error("Please fill in the required input fields", "Form not submitted");
      } else {
        var IsActive = Boolean(this.addJobForm.value.Is_Complete);
        const AwardDate = this.addJobForm.value.Awarded_Date;

        const payload = {
          JobId: 0,
          Code: this.addJobForm.value.Code,
          Description: this.addJobForm.value.Description,
          CustomerId: this.selectedCustomerId,
          PoNumber: this.addJobForm.value.PO_Number,
          IsComplete: IsActive,
          AwardDate: new Date(Date.UTC(AwardDate.getFullYear(), AwardDate.getMonth(), AwardDate.getDate())).toISOString(),
          Location: this.addJobForm.value.Location,
        };

        this.jobService.addJob(payload).subscribe(
          (res) => {
            console.log(res);
            this.NewaddedJobId = res.ResponseData;
            console.log("New Added job Id is " + this.NewaddedJobId);
            this.toastr.success("Job added sucessfully...!", "Success");
            this.addProductviaJob();
            this.getJobByCustomerID(this.selectedCustomerId);
          },

          (err) => {
            console.log(err);
            this.toastr.error("Job Code is already in use.");
          }
        );
      }
    } else {
      this.addProductviaJob();
    }
  }

  UpdateJob() {
    if (this.updateJobForm.value.Code == null || this.updateJobForm.value.Code == "" || this.updateJobForm.value.Description == null || this.updateJobForm.value.Description == "" || this.updateJobForm.value.Customer_ID == null || this.updateJobForm.value.PO_Number == null || this.updateJobForm.value.PO_Number == "" || this.updateJobForm.value.Awarded_Date == null || this.updateJobForm.value.Awarded_Date == "") {
      this.toastr.error("Please fill in the required input fields", "Form not submitted");
    } else {
      var IsActive = Boolean(this.updateJobForm.value.Is_Complete);
      const AwardDate = this.updateJobForm.value.Awarded_Date;
      const payload = {
        Id: 0,
        UserId: "string",
        ItemId: 0,
        JobId: this.selectedjobid,
        Code: this.updateJobForm.value.Code,
        Description: this.updateJobForm.value.Description,
        CustomerId: this.selectedCustomerId,
        PoNumber: this.updateJobForm.value.PO_Number,
        IsComplete: IsActive,
        AwardDate: new Date(Date.UTC(AwardDate.getFullYear(), AwardDate.getMonth(), AwardDate.getDate())).toISOString(),
        Location: this.updateJobForm.value.Location,
      };
      console.log(payload);
      this.jobService.addJob(payload).subscribe(
        (res) => {
          console.log(res);
          this.toastr.success("Job Updated sucessfully...!", "Success");
          this.getJobByCustomerID(this.selectedCustomerId);
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

  editJob() {
    if (this.editJobForm.valid) {
      let obj = {
        // Product: this.editJobForm.value.Product,
        // departmentName: this.editJobForm.value.DepartmentName,
        // id: this.editId,
      };

      this.jobService.updateJob(obj).subscribe(
        (res) => {
          // this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          //   dtInstance.destroy();
          // });
          $("#edit_job").modal("hide");
          this.toastr.success("Job Updated sucessfully...!", "Success");
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

  addNewJob() {
    console.log("new added job work");
    this.addJobForm.controls["Code"].reset();
    this.NewaddedJobId = null;
    this.loopProductByJobID = null;
  }

  SelectJob(value) {
    this.selectedjobid = value;
    console.log(`Job ID: ${this.selectedjobid}!`);

    this.getProductByJobID(value);
    this.getJobDetailByJobID(value);
  }

  selectJobProduct(id: number) {
    this.productService.getJobProductDetail(id).subscribe({
      next: (response) => {
        const data: any = response?.ResponseData[0];

        this.addProductJobForm.controls.Job_Product_ID.setValue(`${data.Job_Product_ID}`);
        this.addProductJobForm.controls.Product_Name.setValue(data.Product_ID);
        this.addProductJobForm.controls.Product_Code.setValue(`${data.Code}`);
        this.addProductJobForm.controls.Product_Description.setValue(`${data.Description}`);
        this.addProductJobForm.controls.Price.setValue(`${data.Price}`);
        this.addProductJobForm.controls.Driver_Price.setValue(`${data.Driver_Price}`);
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {},
    });
  }

  getID(value) {
    console.log(value);
  }

  // Delete timedsheet Modal Api Call
  deleteJob() {}

  getProductCode() {}

  getProductDesc() {}

  getProductPrice() {}

  getProductDriverPrice() {}

  AddSingleProduct() {
    console.log("single product work");
  }

  closeModel() {
    this.addJobForm.reset();
    this.editJobForm.reset();
    this.updateJobForm.reset();

    this.addProductJobForm.reset();
    this.addProductJobForm.controls.Job_Product_ID.setValue(0);
    this.addProductJobForm.controls.Product_Name.setValue(null);

    this.awardDate = this.pipe.transform(this.myDate, "MM-dd-yyyy");
  }
  addProduct() {
    let id: any = this.addProductJobForm.value.Product_Name == null ? 0 : this.addProductJobForm.value.Product_Name;
    let itemId: any = this.addProductJobForm.value.Job_Product_ID == null ? 0 : this.addProductJobForm.value.Job_Product_ID;
    const payload = {
      JobId: this.selectedjobid,
      ProductId: id,
      ItemId: itemId,
      Code: this.addProductJobForm.value.Product_Code,
      Description: this.addProductJobForm.value.Product_Description,
      Price: this.addProductJobForm.value.Price,
      DriverPrice: this.addProductJobForm.value.Driver_Price,
    };
    console.log({ ...payload });

    this.productService.updateJobProduct(payload).subscribe(
      (res) => {
        console.log(res);
        this.toastr.success("Job added sucessfully...!", "Success");

        this.addProductJobForm.reset();
        this.addProductJobForm.controls.Job_Product_ID.setValue(0);
        this.addProductJobForm.controls.Product_Name.setValue(null);

        this.getProductByJobID(this.selectedjobid);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  addProductviaJob() {
    let id: any = this.addProductJobForm.value.Product_Name == null ? 0 : this.addProductJobForm.value.Product_Name;
    let itemId: any = this.addProductJobForm.value.Job_Product_ID == null ? 0 : this.addProductJobForm.value.Job_Product_ID;
    const payload = {
      JobId: this.NewaddedJobId,
      ProductId: id,
      ItemId: itemId,
      Code: this.addProductJobForm.value.Product_Code,
      Description: this.addProductJobForm.value.Product_Description,
      Price: this.addProductJobForm.value.Price,
      DriverPrice: this.addProductJobForm.value.Driver_Price,
    };

    this.productService.updateJobProduct(payload).subscribe(
      (res) => {
        console.log(res);
        this.toastr.success("Product added sucessfully...!", "Success");
        console.log(" job id  is " + this.NewaddedJobId);
        this.getProductByJobID(this.NewaddedJobId);
        this.addProductJobForm.reset();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  addModelOpen() {
    console.log("model open");
    this.addJobForm.reset();
    this.addProductJobForm.reset();
    this.loopProductByJobID = null;
    this.awardDate = this.pipe.transform(this.myDate, "MM-dd-yyyy");
    this.addJobForm.controls["Customer_ID"].setValue(this.loopcustomerDetailById[0].Code + " - " + this.loopcustomerDetailById[0].Description);
    this.addJobForm.controls["Awarded_Date"].setValue(new Date());
  }

  getHistory(id) {
    console.log("given id is " + id);
    this.jobService.getHistoryById(id).subscribe((data) => {
      console.log(data);
      this.HistoryData = data;
      this.LoopHistoryData = this.HistoryData.ResponseData;
    });
  }

  setDefaultDescription() {
    this.addJobForm.controls.Description.setValue(`${this.addJobForm.controls.Code.value}`);
    return;
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  keyPress(event: any) {
    const pattern = /[0-9\+\.\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
}
