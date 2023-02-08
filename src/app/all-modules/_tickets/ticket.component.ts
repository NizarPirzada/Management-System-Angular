import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { DataTableDirective } from "angular-datatables";
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";
import { CustomerService } from "src/app/shared/services/customer.service";
import { DriverService } from "src/app/shared/services/driver.service";
import { JobService } from "src/app/shared/services/job.service";
import { ProductService } from "src/app/shared/services/product.service";
import { TicketService } from "src/app/shared/services/ticket.service";
import { TruckService } from "src/app/shared/services/truck.service";

declare const $: any;

@Component({
  selector: "app-ticket",
  templateUrl: "./ticket.component.html",
  styleUrls: ["./ticket.component.css"],
})
export class TicketComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject();

  lstTicket: any[];
  url: any = "designation";
  endDate: any = this.datePipe.transform(new Date().addDays(1), "MM-dd-yyyy");
  myDate = new Date();
  currentDate = this.datePipe.transform(this.myDate, "MM-dd-yyyy");
  datemodel: any;
  ticketId: number = 40440;
  ticketCheck: number;
  Quantity: number;
  TruckId: number;
  DriverId: number;
  ticketDeleteId: number;
  ticketEditId: number;
  searchValue: any;
  invoiced: boolean = false;
  isTicketEditable: boolean = false;

  public tempId: any;
  public editId: any;
  public rows = [];
  public srch = [];
  public customerOption: any;
  public addTicketForm: FormGroup;
  public editTicketForm: FormGroup;
  public addInvoiceForm: FormGroup;
  public Animationf = "";
  public Animationtrue = false;
  public driverData: any;
  public truckData: any;
  public customerData: any;
  public loopCustomerData: any;
  public loopDriverData: any;
  public loopTruckData: any;
  public jobData: any;
  public loopJobData: any;
  public productData: any;
  public loopProductData: any;
  public ticketData: any;
  public loopTicketData: any;
  public priceData: any;
  public loopPriceData: any;
  public ticketLineData: any;
  public loopTicketLineData: any;
  public ticketEditData: any;
  public loopEditTicketData: any;
  public ticketNotPaidJob: any;
  public loopTicketNotPaidJob: any;
  public ticketNotPaidTicketNum: any;
  public loopTicketNotPaidTicketNum: any;
  public getproductbyjobproductid: any;
  public addnewTicketvalue = false;
  public Searchticketbynumber: any;
  public Norecordfound = false;
  public HistoryData: any;
  public LoopHistoryData: any;
  public isLoading = false;
  public searchJobid: any;
  public singleTruckData: any;
  public singleDriverData: any;
  public loopSingleDriverData: any;
  public TicketSummary: any;
  public ticketSummaryData: any[] = [
    { name: "Invoice Count", counts: "", perc: "" },
    { name: "Paid Count", counts: "", perc: "" },
    { name: "Ready for Payment Count", counts: "", perc: "" },
    { name: "Ticket Count", counts: "", perc: "" },
  ];

  totalRecords = 0;
  totalpages = 1;
  currentpage: any = 0;
  limit: any = 10;
  showList: number = 10;
  showSum: number = 10;

  constructor(private datePipe: DatePipe, private formBuilder: FormBuilder, private toastr: ToastrService, private ticketService: TicketService, private customerService: CustomerService, private driverService: DriverService, public truckService: TruckService, public jobService: JobService, public productService: ProductService) {}
  public NewTicketcount = 0;
  public InoviceCreatecount = 0;
  public PaymentCreateCount = 0;
  public PaidCount = 0;
  public box1valuecount = 0;
  public box2valuecount = 0;
  public box3valuecount = 0;
  public box4valuecount = 0;
  public QueryCode: any;
  public resdata: any;
  box1valueCounter: any;

  box2valueCounter: any;

  box3valueCounter: any;

  box4valueCounter: any;

  ticketvalueCounter: any;

  inovicevalueCounter: any;

  paymentvalueCounter: any;

  paidvalueCounter: any;
  TicketCountBar: any;
  InvoiceCountBar: any;
  PaidCountBar: any;
  RFPCountBar: any;

  ngOnInit() {
    $("#add_ticket").modal({ backdrop: "static", keyboard: false });
    $("#edit_ticket").modal({ backdrop: "static", keyboard: false });

    this.addTicketForm = this.formBuilder.group({
      customer_ID: ["", [Validators.required]],
      job_ID: ["", [Validators.required]],
      invoice_ID: [""],
      product_ID: ["", [Validators.required]],
      code: ["", [Validators.required]],
      creation_Date: ["", [Validators.required]],
      driver_name: ["", [Validators.required]],
      truck_name: ["", [Validators.required]],
      quantity: ["", [Validators.required]],
      price: ["", [Validators.required]],
      driver_price: ["", [Validators.required]],
      Ticket_Line_Item_ID: ["0", [Validators.required]],
    });

    this.editTicketForm = this.formBuilder.group({
      Code: ["", [Validators.required]],
      Customer_Description: ["", [Validators.required]],
      Job_Description: ["", [Validators.required]],
      Ticket_Description: ["", [Validators.required]],
      Product_Description: ["", [Validators.required]],
      Total: ["", [Validators.required]],
      Total_Due: ["", [Validators.required]],
      Creation_Date: ["", [Validators.required]],
      driver_name: ["", [Validators.required]],
      truck_name: ["", [Validators.required]],
      quantity: ["", [Validators.required]],
      price: ["", [Validators.required]],
      driver_price: ["", [Validators.required]],
      Ticket_Line_Item_ID: ["0", [Validators.required]],
      Ticket_ID: ["0", [Validators.required]],
    });

    this.Searchticketbynumber = "";
    this.loadTickets(this.endDate, this.invoiced);

    this.addInvoiceForm = this.formBuilder.group({
      number: ["", [Validators.required]],
      quickbooks_Invoice_Number: [""],
      total_Due: ["", [Validators.required]],
      pO_Number: ["", [Validators.required]],
      paid_Check_Number: ["", [Validators.required]],
      creation_Date: ["", [Validators.required]],
      is_Ready_For_Truck_Hire_Payment: [false, [Validators.required]],
    });

    this.getAllCustomerData();
    this.getAllDriversData();
    this.getAllTruckData();
    this.getTicketSummaryData();
  }

  getTicketSummaryData() {
    this.ticketService.getTicketSummary().subscribe((data) => {
      this.ticketSummaryData = data.ResponseData;

      this.box1valueCounter = setInterval(() => {
        this.box1valuecount++;
        if (this.box1valuecount >= this.ticketSummaryData[3].perc) {
          clearInterval(this.box1valueCounter);
        }
      }, 8);
      this.box2valueCounter = setInterval(() => {
        this.box2valuecount++;
        if (this.box2valuecount >= this.ticketSummaryData[0].perc) {
          clearInterval(this.box2valueCounter);
        }
      }, 8);
      this.box3valueCounter = setInterval(() => {
        this.box3valuecount++;
        if (this.box3valuecount >= this.ticketSummaryData[1].perc) {
          clearInterval(this.box3valueCounter);
        }
      }, 8);

      this.box4valueCounter = setInterval(() => {
        this.box4valuecount++;
        if (this.box4valuecount >= this.ticketSummaryData[2].perc) {
          clearInterval(this.box4valueCounter);
        }
      }, 8);
      this.ticketvalueCounter = setInterval(() => {
        this.NewTicketcount++;
        if (this.NewTicketcount >= this.ticketSummaryData[3].counts) {
          clearInterval(this.ticketvalueCounter);
        }
      }, 8);
      this.inovicevalueCounter = setInterval(() => {
        this.InoviceCreatecount++;
        if (this.InoviceCreatecount >= this.ticketSummaryData[0].counts) {
          clearInterval(this.inovicevalueCounter);
        }
      }, 8);
      this.paymentvalueCounter = setInterval(() => {
        this.PaymentCreateCount++;
        if (this.PaymentCreateCount >= this.ticketSummaryData[2].counts) {
          clearInterval(this.paymentvalueCounter);
        }
      }, 8);
      this.paidvalueCounter = setInterval(() => {
        this.PaidCount++;
        if (this.PaidCount >= this.ticketSummaryData[1].counts) {
          clearInterval(this.paidvalueCounter);
        }
      }, 8);
    });
  }

  onTruckChangeInEditModal(truckID: number) {
    this.truckService.getTruckDetailByTruckId(truckID).subscribe((response) => {
      const truckDetails: any = response.ResponseData[0];
      this.editTicketForm.controls.driver_name.setValue(`${truckDetails.Default_Driver_ID}`);
    });
  }

  dataChanged($event) {
    this.limit = $event;
    this.loadTickets(this.endDate, this.invoiced);
    this.showSum = parseInt(this.currentpage) * parseInt(this.limit) + parseInt(this.limit);
  }

  //Get all Customer Data
  getAllCustomerData() {
    this.customerService.getAllCustomers().subscribe((data) => {
      this.customerData = data;
      this.loopCustomerData = this.customerData.ResponseData;
    });
  }

  //Get all Drivers Data
  getAllDriversData() {
    this.driverService.getAllDrivers().subscribe((data) => {
      this.driverData = data;
      this.loopDriverData = this.driverData.ResponseData;
    });
  }

  //Get all Truck Data
  getAllTruckData() {
    this.truckService.getAllTrucks().subscribe((data) => {
      this.truckData = data;
      this.loopTruckData = this.truckData.ResponseData;
    });
  }

  //Get Job by customer id
  async getJobByCustomerID(id: number): Promise<void> {
    if (!!id) {
      const response: any = await this.jobService.getJobById(id).toPromise();
      this.loopJobData = response?.ResponseData;
    } else {
      this.loopJobData = [];
      this.loadTickets(this.currentDate, this.invoiced);
    }
  }

  setJobForAddTicket(): void {
    if (this.loopJobData?.length > 0) {
      this.addTicketForm.controls.job_ID.setValue(`${this.loopJobData[0].ID}`);
    } else {
      this.addTicketForm.controls.job_ID.setValue(``);
      this.addTicketForm.controls.product_ID.setValue(``);
      this.addTicketForm.controls.price.setValue(``);
      this.addTicketForm.controls.driver_price.setValue(``);
    }
  }

  setJobForEditTicket(): void {
    if (this.loopJobData?.length > 0) {
      this.editTicketForm.controls.Job_Description.setValue(`${this.loopJobData[0].ID}`);
    } else {
      this.editTicketForm.controls.Job_Description.setValue(``);
      this.editTicketForm.controls.Product_Description.setValue(``);
      this.editTicketForm.controls.price.setValue(``);
      this.editTicketForm.controls.driver_price.setValue(``);
    }
  }

  getDriverByTruckID(id: number) {
    this.truckService.getTruckDetailByTruckId(id).subscribe((data) => {
      this.singleTruckData = data;
      const value = this.singleTruckData.ResponseData;
      this.addTicketForm.controls.driver_name.setValue(`${value[0].Default_Driver_ID}`);
    });
  }

  //Get Product by job id
  async getProductByJobID(id: number): Promise<void> {
    const response: any = await this.productService.getProductById(id).toPromise();
    this.loopProductData = response?.ResponseData;
  }

  setProductForAddTicket(): void {
    if (this.loopProductData?.length > 0) {
      this.addTicketForm.controls.product_ID.setValue(`${this.loopProductData[0].ID}`);
      this.addTicketForm.controls.price.setValue(`${this.loopProductData[0].Price}`);
      this.addTicketForm.controls.driver_price.setValue(`${this.loopProductData[0].Driver_Price}`);
    } else {
      this.addTicketForm.controls.product_ID.setValue(``);
      this.addTicketForm.controls.price.setValue(``);
      this.addTicketForm.controls.driver_price.setValue(``);
    }
  }

  setProductForEditTicket(): void {
    if (this.loopProductData?.length > 0) {
      this.editTicketForm.controls.Product_Description.setValue(`${this.loopProductData[0].ID}`);
      this.editTicketForm.controls.price.setValue(`${this.loopProductData[0].Price}`);
      this.editTicketForm.controls.driver_price.setValue(`${this.loopProductData[0].Driver_Price}`);
    } else {
      this.editTicketForm.controls.Product_Description.setValue(``);
      this.editTicketForm.controls.price.setValue(``);
      this.editTicketForm.controls.driver_price.setValue(``);
    }
  }

  //Get Prices by product id
  getPricesByProductID(id: number) {
    this.productService.getJobProductDetail(id).subscribe((data) => {
      this.priceData = data;
      this.loopPriceData = this.priceData.ResponseData;
      this.addTicketForm.controls.price.setValue(`${this.loopPriceData[0].Price}`);
      this.addTicketForm.controls.driver_price.setValue(`${this.loopPriceData[0].Driver_Price}`);
    });
  }

  //Get tickets line item detail by ticket id
  getTicketsLineItemByTicketID(ticketCheck) {
    this.ticketService.getTicketsLineItemByTicketId(ticketCheck).subscribe((data) => {
      this.ticketLineData = data;
      this.loopTicketLineData = this.ticketLineData.ResponseData;
    });
  }

  //Get tickets detail by ticket id
  async getTicketsDetailByTicketID(ticketEditId) {
    const response: any = await this.ticketService.getTicketsDetailByTicketId(ticketEditId).toPromise();
    this.loopEditTicketData = response?.ResponseData;
  }

  setTicketDetailsForEditTicket(): void {
    this.editTicketForm.controls.Ticket_ID.setValue(`${this.loopEditTicketData[0].Ticket_ID}`);
    this.editTicketForm.controls.Customer_Description.setValue(`${this.loopEditTicketData[0].Customer_ID}`);
    this.editTicketForm.controls.Job_Description.setValue(`${this.loopEditTicketData[0].Job_ID}`);
    this.editTicketForm.controls.Product_Description.setValue(`${this.loopEditTicketData[0].Job_Product_ID}`);
    this.editTicketForm.controls.Code.setValue(`${this.loopEditTicketData[0].Code}`);
    this.editTicketForm.controls.Creation_Date.setValue(this.datePipe.transform(this.loopEditTicketData[0].Creation_Date, "MM-dd-yyyy"));
  }

  async getJobProductDetailById(id: number): Promise<void> {
    const response: any = await this.productService.getJobProductDetail(id).toPromise();
    this.loopProductData = response?.ResponseData;
  }

  setJobProductDetailForEditTicket(): void {
    this.editTicketForm.controls.price.setValue(`${this.loopProductData[0].Price}`);
    this.editTicketForm.controls.driver_price.setValue(`${this.loopProductData[0].Driver_Price}`);
  }

  // Get ticket list of not invoiced
  loadTickets(endDate, invoiced: boolean = false) {
    this.isLoading = true;
    this.ticketService.getAllTickets(endDate, this.currentpage * this.limit, this.limit, invoiced).subscribe((data) => {
      this.ticketData = data;
      this.loopTicketData = this.ticketData.ResponseData?.Data;
      if (this.loopTicketData?.length > 0) {
        this.totalRecords = this.ticketData.ResponseData?.RecordsCount;
        if (!this.totalRecords) {
          this.totalRecords = 0;
          this.totalpages = 0;
        } else {
          this.totalpages = Math.ceil((this.totalRecords ?? 1) / this.limit);
        }
        this.Norecordfound = false;
        this.isLoading = false;
        return;
      }
      this.Norecordfound = true;
      this.isLoading = false;
    });
  }

  changeTicketPage(pgIndex) {
    this.currentpage = pgIndex;
    this.loadTickets(this.currentDate, this.invoiced);
    this.showSum = parseInt(this.currentpage) * parseInt(this.limit) + parseInt(this.limit);
  }

  isShowPage(pgindex) {
    if (this.currentpage < 4 && pgindex < 4) return true;
    else if (this.currentpage > 3 && this.currentpage - pgindex < 4 && this.currentpage - pgindex > -1) return true;
    else return false;
  }

  //Get Tickets not paid by job
  getTicketsNotPaidByJobID(jobId) {
    this.isLoading = true;
    this.searchJobid = jobId;
    this.ticketService.getTicketsNotPaidByJobId(jobId).subscribe((data) => {
      this.ticketNotPaidJob = data;
      this.loopTicketNotPaidJob = this.ticketNotPaidJob.ResponseData;
      this.loopTicketData = this.loopTicketNotPaidJob;
      if (this.loopTicketData.length <= 0) {
        this.Norecordfound = true;
        this.isLoading = false;
        this.totalRecords = 0;
        this.totalpages = 0;
      } else {
        this.Norecordfound = false;
        this.isLoading = false;
        this.totalRecords = this.loopTicketData.length;
        this.showSum = this.loopTicketData.length;
      }
    });
  }

  //Get Tickets not paid by ticket number
  getTicketsNotPaidByTicketNum(ticketNum) {
    this.ticketService.getTicketsNotPaidByTicketNumber(ticketNum).subscribe((data) => {
      this.ticketNotPaidTicketNum = data;
      this.loopTicketNotPaidTicketNum = this.ticketNotPaidTicketNum.ResponseData;
    });
  }

  searchTicket(jobValue) {
    this.Searchticketbynumber = jobValue;
  }

  SearchData() {
    this.isLoading = true;

    if (this.Searchticketbynumber == "") {
      this.loadTickets(this.endDate, this.invoiced);
      this.Norecordfound = false;
      this.showSum = this.showList;
    } else {
      this.searchTicket(this.Searchticketbynumber);

      this.ticketService.getTicketsNotPaidByTicketNumber(this.Searchticketbynumber).subscribe((data) => {
        this.ticketData = data;
        this.loopTicketData = this.ticketData.ResponseData;
        if (this.loopTicketData.length <= 0) {
          this.Norecordfound = true;
          this.isLoading = false;
          this.totalRecords = 0;
          this.totalpages = 0;
        } else {
          this.Norecordfound = false;
          this.isLoading = false;
          this.totalRecords = this.loopTicketData.length;
          this.showSum = this.loopTicketData.length;
        }
      });
    }
  }

  searchJob(id: number) {
    if (!!id) {
      this.getTicketsNotPaidByJobID(id);
    } else {
      this.loadTickets(this.currentDate, this.invoiced);
    }
  }

  addNewTicket() {
    this.addnewTicketvalue = false;
    this.ticketCheck = null;
    this.loopTicketLineData = null;
    this.addTicketForm.controls.code.reset();
    // this.addTicketForm.reset();
    // this.Animationtrue = true;
    // this.Animationf = "animationRight";
    // setTimeout(() => {
    //   this.Animationtrue = false;
    //   this.Animationf = "";
    // }, 4000);

    $(".code").focus();
  }

  // Add ticket  -> return ticket ID
  addTicketDate(val) {
    this.currentDate = this.datePipe.transform(val, "MM-dd-yyyy");
  }

  addTicket(saveAndClose: boolean = false) {
    if (this.addTicketForm.value.job_ID == "" || this.addTicketForm.value.job_ID == null || this.addTicketForm.value.product_ID == "" || this.addTicketForm.value.product_ID == null || this.addTicketForm.value.code == "" || this.addTicketForm.value.code == null || this.addTicketForm.value.driver_name == "" || this.addTicketForm.value.driver_name == null || this.addTicketForm.value.truck_name == "" || this.addTicketForm.value.truck_name == null || this.addTicketForm.value.quantity == "" || this.addTicketForm.value.quantity == null || this.addTicketForm.value.driver_price == "" || this.addTicketForm.value.driver_price == null || this.addTicketForm.value.price == "" || this.addTicketForm.value.price == null) {
      this.toastr.error("Please fill in the required input fields", "Form not submitted");
    } else {
      const ticketLineItemID: number = +this.editTicketForm.value.Ticket_Line_Item_ID;
      if (!!ticketLineItemID) {
        this.editTicketLineItemOnAddTicketModal();
      } else {
        if (this.ticketCheck == null) {
          const ticketNumber = this.addTicketForm.value.code;
          this.ticketService.getTicketsNotPaidByTicketNumber(ticketNumber).subscribe({
            next: (response) => {
              const data: any = response.ResponseData;
              // Based on Eric's feedback
              if (data.length > 0) {
                this.toastr.error("A ticket with same Code already exists!", "Error");
                return;
              }

              const ticketValues = {
                TicketId: 0,
                JobId: this.addTicketForm.value.job_ID,
                JobProductId: this.addTicketForm.value.product_ID,
                Code: ticketNumber,
                Description: "",
                CreationDate: this.currentDate,
              };

              this.ticketService.addTicket(ticketValues).subscribe((response) => {
                this.ticketCheck = response.ResponseData;
                this.Animationf = "";
                this.Animationtrue = false;
                this.toastr.success("Ticket added sucessfully...!", "Success");

                this.addTicketLineItem(saveAndClose);
              });
            },
            error: (error) => {
              console.error(error);
            },
            complete: () => {},
          });
        } else {
          this.addTicketLineItem();
          this.getTicketsLineItemByTicketID(this.ticketCheck);
        }
      }
    }
  }

  // Add ticket line item -> return ticket line item ID
  addTicketLineItem(saveAndClose: boolean = false) {
    var driverId = Number(this.addTicketForm.value.driver_name);
    var truckId = Number(this.addTicketForm.value.truck_name);
    var quant = Number(this.addTicketForm.value.quantity);

    const ticketLineValues = {
      TicketLineItemId: 0,
      TicketId: this.ticketCheck,
      // TickedId: 0,
      DriverId: driverId,
      TruckId: truckId,
      Quantity: quant,
      PricePerUnit: this.addTicketForm.value.price,
      DriverPrice: this.addTicketForm.value.driver_price,
    };
    this.ticketService.addTicketLineItem(ticketLineValues).subscribe(
      (res) => {
        this.toastr.success("Ticket Line Item added sucessfully...!", "Success");

        // this.addTicketForm.controls["truck_name"].reset();
        // this.addTicketForm.controls["driver_name"].reset();
        this.addTicketForm.controls["quantity"].reset();
        this.addnewTicketvalue = true;

        if (!!saveAndClose) {
          this.addNewTicket();
        } else {
          this.getTicketsLineItemByTicketID(this.ticketCheck);
        }
      },
      (err) => {
        console.error(err);
      }
    );
  }

  async edit(id: number, qbInvoiceNumber: string) {
    this.ticketEditId = id;

    this.isTicketEditable = false;
    if (!qbInvoiceNumber) {
      this.isTicketEditable = true;
    }

    // this.editTicketForm.controls["truck_name"].reset();
    this.editTicketForm.controls["driver_name"].reset();
    this.editTicketForm.controls["quantity"].reset();
    this.editTicketForm.controls["Ticket_Line_Item_ID"].reset();

    await this.getTicketsDetailByTicketID(id);

    const customerID: number = parseInt(this.loopEditTicketData[0].Customer_ID);
    await this.getJobByCustomerID(customerID);
    this.setJobForEditTicket();

    const jobID: number = parseInt(this.loopEditTicketData[0].Job_ID);
    await this.getProductByJobID(jobID);
    this.setProductForEditTicket();

    this.setTicketDetailsForEditTicket();

    this.getTicketsLineItemByTicketID(id);
  }

  editTicket() {
    if (this.ticketEditId == null) {
      const ticketValues = {
        TicketId: 0,
        JobId: this.editTicketForm.value.Job_Description,
        JobProductId: this.editTicketForm.value.Product_Description,
        Code: this.editTicketForm.value.Code,
        Description: "",
        CreationDate: this.editTicketForm.value.Creation_Date,
      };
      this.ticketService.addTicket(ticketValues).subscribe(
        (res) => {
          this.editTicketLineItem();
          // this.loadTickets(this.endDate, this.invoiced);
          this.toastr.success("Ticket updated sucessfully...!", "Success");
          this.getTicketsLineItemByTicketID(this.ticketEditId);
        },
        (err) => {
          console.error(err);
        }
      );
    } else {
      this.editTicketLineItem();
    }
  }

  // Edit ticket line item -> return ticket line item ID
  editTicketLineItem() {
    if (this.editTicketForm.value.truck_name == "" || this.editTicketForm.value.truck_name == null || this.editTicketForm.value.driver_name == "" || this.editTicketForm.value.driver_name == null || this.editTicketForm.value.quantity == "" || this.editTicketForm.value.quantity == null || this.editTicketForm.value.driver_price == "" || this.editTicketForm.value.driver_price == null || this.editTicketForm.value.price == "" || this.editTicketForm.value.price == null) {
      this.toastr.error("Please fill in the required input fields", "Form not submitted");
    } else {
      var driverId = +this.editTicketForm.value.driver_name;
      var truckId = +this.editTicketForm.value.truck_name;
      var quant = +this.editTicketForm.value.quantity;

      const ticketLineItemID: number = +this.editTicketForm.value.Ticket_Line_Item_ID;

      const ticketLineValues = {
        TicketLineItemId: ticketLineItemID,
        TicketId: this.ticketEditId,
        DriverId: driverId,
        TruckId: truckId,
        Quantity: quant,
        PricePerUnit: this.editTicketForm.value.price,
        DriverPrice: this.editTicketForm.value.driver_price,
      };

      this.ticketService.addTicketLineItem(ticketLineValues).subscribe(
        (res) => {
          this.toastr.success("Ticket Line Item added sucessfully...!", "Success");
          this.getTicketsLineItemByTicketID(this.ticketEditId);
          this.editTicketForm.controls["truck_name"].reset();
          this.editTicketForm.controls["driver_name"].reset();
          this.editTicketForm.controls["quantity"].reset();
          this.editTicketForm.controls["Ticket_Line_Item_ID"].reset();
        },
        (err) => {
          console.error(err);
        }
      );
    }
  }

  editTicketLineItemOnAddTicketModal() {
    if (this.addTicketForm.value.truck_name == "" || this.addTicketForm.value.truck_name == null || this.addTicketForm.value.driver_name == "" || this.addTicketForm.value.driver_name == null || this.addTicketForm.value.quantity == "" || this.addTicketForm.value.quantity == null || this.addTicketForm.value.driver_price == "" || this.addTicketForm.value.driver_price == null || this.addTicketForm.value.price == "" || this.addTicketForm.value.price == null) {
      this.toastr.error("Please fill in the required input fields", "Form not submitted");
    } else {
      var driverId = +this.addTicketForm.value.driver_name;
      var truckId = +this.addTicketForm.value.truck_name;
      var quant = +this.addTicketForm.value.quantity;

      const ticketLineItemID: number = +this.addTicketForm.value.Ticket_Line_Item_ID;

      const ticketLineValues = {
        TicketLineItemId: ticketLineItemID,
        TicketId: this.ticketEditId,
        DriverId: driverId,
        TruckId: truckId,
        Quantity: quant,
        PricePerUnit: this.addTicketForm.value.price,
        DriverPrice: this.addTicketForm.value.driver_price,
      };

      this.ticketService.addTicketLineItem(ticketLineValues).subscribe(
        (res) => {
          this.toastr.success("Ticket Line Item updated sucessfully...!", "Success");
          this.getTicketsLineItemByTicketID(this.ticketEditId);
          this.addTicketForm.controls["truck_name"].reset();
          this.addTicketForm.controls["driver_name"].reset();
          this.addTicketForm.controls["quantity"].reset();
          this.addTicketForm.controls["Ticket_Line_Item_ID"].reset();
        },
        (err) => {
          console.error(err);
        }
      );
    }
  }

  addInvoice() {
    if (this.addInvoiceForm.valid) {
      this.addInvoiceForm["id"] = 5;

      this.ticketService.addInvoice(this.addInvoiceForm.value).subscribe(
        (res) => {
          this.toastr.success("Invoice added sucessfully...!", "Success");
          $("#add_invoice").modal("hide");
          this.addInvoiceForm.reset();
          this.loadTickets(this.endDate, this.invoiced);
        },
        (err) => {
          console.error(err);
        }
      );
    }
  }

  // To Get The timesheet Edit Id And Set Values To Edit Modal Form
  openInvoiceModal(ticketData) {
    console.log(ticketData);
  }

  openDeleteTicketModalHandler(ticketID: number): void {
    this.ticketDeleteId = ticketID;
  }

  // Delete timedsheet Modal Api Call
  deleteTicket() {
    this.ticketService.deleteTicket(this.ticketDeleteId).subscribe({
      next: (response) => {
        const data: any = response.ResponseData;
        this.toastr.success("Ticket deleted!", "Success");
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {
        this.closeModal();
      },
    });
  }

  setTicketLineItemDetails(ticket: any) {
    this.addTicketForm.controls.truck_name.setValue(`${ticket.Truck_ID}`);
    this.addTicketForm.controls.driver_name.setValue(`${ticket.Driver_ID}`);
    this.addTicketForm.controls.price.setValue(`${ticket.Price_Per_Unit}`);
    this.addTicketForm.controls.driver_price.setValue(`${ticket.Driver_Price_Per_Unit}`);
    this.addTicketForm.controls.quantity.setValue(`${ticket.Quantity}`);
    this.addTicketForm.controls.Ticket_Line_Item_ID.setValue(`${ticket.Ticket_Line_Item_ID}`);

    this.editTicketForm.controls.truck_name.setValue(`${ticket.Truck_ID}`);
    this.editTicketForm.controls.driver_name.setValue(`${ticket.Driver_ID}`);
    this.editTicketForm.controls.price.setValue(`${ticket.Price_Per_Unit}`);
    this.editTicketForm.controls.driver_price.setValue(`${ticket.Driver_Price_Per_Unit}`);
    this.editTicketForm.controls.quantity.setValue(`${ticket.Quantity}`);
    this.editTicketForm.controls.Ticket_Line_Item_ID.setValue(`${ticket.Ticket_Line_Item_ID}`);

    this.ticketEditId = ticket.Ticket_ID;
  }

  closeModal() {
    this.addTicketForm.reset();
    this.editTicketForm.reset();
    this.addnewTicketvalue = false;
    this.loopTicketLineData = null;
    this.ticketDeleteId = null;
    this.ticketCheck = null;
    this.currentDate = this.datePipe.transform(this.myDate, "MM-dd-yyyy");
    this.Animationf = "";

    this.loadTickets(this.endDate, this.invoiced);
  }

  getHistory(id) {
    this.ticketService.getHistoryById(id).subscribe((data) => {
      this.HistoryData = data;
      this.LoopHistoryData = this.HistoryData.ResponseData;
    });
  }

  ticketFilterHandler() {
    this.loadTickets(this.endDate, this.invoiced);
  }

  updateTicket(): void {
    const creationDate: Date = this.editTicketForm.value.Creation_Date;
    const creationDateISO: string = new Date(Date.UTC(creationDate.getFullYear(), creationDate.getMonth(), creationDate.getDate())).toISOString();
    const ticketValues = {
      TicketId: +this.ticketEditId,
      JobId: +this.editTicketForm.value.Job_Description,
      JobProductId: +this.editTicketForm.value.Product_Description,
      Code: `${this.editTicketForm.value.Code}`,
      Description: "",
      CreationDate: creationDateISO,
    };

    this.ticketService.addTicket(ticketValues).subscribe((response) => {
      this.ticketCheck = response.ResponseData;
      this.toastr.success("Ticket updated successfully!", "Success");
    });
  }

  async addTicketCustomerChangeHandler(id: number): Promise<void> {
    await this.getJobByCustomerID(id);
    this.setJobForAddTicket();

    const jobID: number = parseInt(this.loopJobData[0].ID);
    await this.getProductByJobID(jobID);
    this.setProductForAddTicket();
  }

  async editTicketCustomerChangeHandler(id: number): Promise<void> {
    await this.getJobByCustomerID(id);
    this.setJobForEditTicket();

    const jobID: number = parseInt(this.loopJobData[0].ID);
    await this.getProductByJobID(jobID);
    this.setProductForEditTicket();
  }

  async addTicketJobChangeHandler(id: number): Promise<void> {
    await this.getProductByJobID(id);
    this.setProductForAddTicket();
  }

  async editTicketJobChangeHandler(id: number): Promise<void> {
    await this.getProductByJobID(id);
    this.setProductForEditTicket();
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
