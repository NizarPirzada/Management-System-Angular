import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { DriverService } from "src/app/shared/services/driver.service";

declare const $: any;

@Component({
  selector: "app-drier-type",
  templateUrl: "./driver_types.component.html",
  styleUrls: ["./driver_types.component.css"],
})
export class DriverTypeComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject();
  lstDriverType: any[];
  public tempId: any;
  public editId: any;

  public addDriverTypeForm: FormGroup;
  public editDriverTypeForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private driverService: DriverService) {}

  ngOnInit() {
    $("#add_driverType").modal({ backdrop: "static", keyboard: false });
    $("#edit_driverType").modal({ backdrop: "static", keyboard: false });
    this.dtOptions = {
      // ... skipped ...
      pageLength: 10,
      dom: "lrtip",
    };

    this.addDriverTypeForm = this.formBuilder.group({
      description: ["", [Validators.required]],
    });

    this.editDriverTypeForm = this.formBuilder.group({
      description: ["", [Validators.required]],
    });
  }

  // Add DriverType  Modal Api Call
  addDriverType() {
    if (this.addDriverTypeForm.valid) {
      this.addDriverTypeForm["Id"] = 0;
      console.log(this.addDriverTypeForm.value);
      let obj = {
        Id: 0,
        UserId: "string",
        Description: this.addDriverTypeForm.value.description,
      };
      this.driverService.addDriverType(obj).subscribe(
        (res) => {
          // this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          //   dtInstance.destroy();
          // });
          this.toastr.success(res.Message);
          $("#add_driverType").modal("hide");
          this.addDriverTypeForm.reset();
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

  editDriverType() {
    $("#edit_driverType").modal("hide");
    this.toastr.success("DriverType Updated sucessfully...!", "Success");
  }

  // To Get The timesheet Edit Id And Set Values To Edit Modal Form
  edit(driverData) {
    console.log(driverData);
    this.editDriverTypeForm.patchValue(driverData);
  }

  // Delete timedsheet Modal Api Call
  deleteDriverType() {}

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
}
