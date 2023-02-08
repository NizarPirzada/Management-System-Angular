import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { ProductService } from "src/app/shared/services/product.service";

declare const $: any;

@Component({
  selector: "app-product",
  templateUrl: "./product.component.html",
  styleUrls: ["./product.component.css"],
})
export class ProductComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject();
  public productData: any[];

  url: any = "designation";

  public tempId: any;
  public editId: any;
  public searchdata: any;
  public addProductForm: FormGroup;
  public editProductForm: FormGroup;
  public SearcCode = "";
  public Norecordfound = false;
  public HistoryData: any;
  public LoopHistoryData: any;
  public findResult = "none";
  public isLoading = false;
  limit: number = 15;
  currentpage: number = 0;

  constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private productService: ProductService) {}

  ngOnInit() {
    $("#add_product").modal({ backdrop: "static", keyboard: false });
    $("#edit_product").modal({ backdrop: "static", keyboard: false });

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

    this.loadProducts();

    this.addProductForm = this.formBuilder.group({
      UserId: ["", [Validators.required]],
      ProductId: ["", [Validators.required]],
      Code: ["", [Validators.required]],
      Description: ["", [Validators.required]],
      Price: ["", [Validators.required]],
    });

    this.editProductForm = this.formBuilder.group({
      UserId: ["", [Validators.required]],
      ProductId: ["", [Validators.required]],
      Code: ["", [Validators.required]],
      Description: ["", [Validators.required]],
      Price: ["", [Validators.required]],
    });
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  // Get product list  Api Call
  loadProducts() {
    this.isLoading = true;
    this.productService.getAllProducts().subscribe((data: any) => {
      this.productData = data.ResponseData;
      this.isLoading = false;

      // Calling the DT trigger to manually render the table
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.dtTrigger.next();
      });
    });
  }

  // Add product  Modal Api Call
  addProduct() {
    if (this.addProductForm.value.Code == "" || this.addProductForm.value.Code == null || this.addProductForm.value.Description == "" || this.addProductForm.value.Description == null || this.addProductForm.value.Price == "" || this.addProductForm.value.Price == null) {
      this.toastr.error("Please fill in the required input fields", "Form not submitted");
    } else {
      const productValues = {
        ProductId: 0,
        Code: this.addProductForm.value.Code,
        Description: this.addProductForm.value.Description,
        Price: this.addProductForm.value.Price,
      };
      this.productService.getProductDetailByCode(productValues.Code).subscribe((res) => {
        console.log("this is res");
        console.log(res);
        console.log("this is res length");
        console.log(res.ResponseData.length);

        if (res.ResponseData.length == 0) {
          this.productService.addProduct(productValues).subscribe(
            (res) => {
              this.loadProducts();
              this.toastr.success("Product added sucessfully...!", "Success");
              $("#add_product").modal("hide");
            },

            (err) => {}
          );
        } else {
          this.toastr.error("Product Code is already in use.");
        }
      });
    }
  }

  editProduct() {
    if (this.editProductForm.value.Code == "" || this.editProductForm.value.Description == "" || this.editProductForm.value.Price == "") {
      this.toastr.error("Please fill in the required input fields", "Form not submitted");
    } else {
      let obj = {
        ProductId: this.editId,
        Code: this.editProductForm.value.Code,
        Description: this.editProductForm.value.Description,
        Price: this.editProductForm.value.Price,
      };

      this.productService.addProduct(obj).subscribe(
        (res) => {
          this.loadProducts();
          $("#edit_product").modal("hide");
          this.toastr.success("product Updated sucessfully...!", "Success");
          this.findResult = "none";
        },
        (err) => {}
      );
    }
  }

  // To Get The timesheet Edit Id And Set Values To Edit Modal Form
  edit(productData) {
    this.editProductForm.patchValue(productData);
    if (this.findResult == "block") {
      this.editId = productData.Product_ID;
    } else {
      this.editId = productData.ID;
    }
  }

  // Delete timedsheet Modal Api Call
  deleteProduct() {}

  closeModel() {
    this.addProductForm.reset();
    this.editProductForm.reset();
  }

  searchProductbycode(code) {
    this.SearcCode = code;
  }

  SearchData() {
    this.isLoading = true;
    this.searchProductbycode(this.SearcCode);

    if (this.SearcCode == "") {
      this.loadProducts();
      this.dtOptions.info=true;
      this.dtOptions.paging=true;
      this.Norecordfound = false;
      this.findResult = "none";
    } else {
      this.productService.getProductDetailByCode(this.SearcCode).subscribe((data) => {
        this.searchdata = data;
        this.productData = this.searchdata.ResponseData;

        if (this.productData.length <= 0) {
          $(".dataTables_paginate").hide();
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
      });
    }
  }

  getHistory(id) {
    this.productService.getHistoryById(id).subscribe((data) => {
      this.HistoryData = data;
      this.LoopHistoryData = this.HistoryData.ResponseData;
      console.log(this.LoopHistoryData);
    });
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
