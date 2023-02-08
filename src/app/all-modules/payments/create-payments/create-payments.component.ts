import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { TicketService } from "src/app/shared/services/ticket.service";

@Component({
  selector: "app-create-payments",
  templateUrl: "./create-payments.component.html",
  styleUrls: ["./create-payments.component.css"],
})
export class CreatePaymentsComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  selectedItemIDs: number[] = [];
  ticketItems: any[];
  isLoading: boolean;

  driverTypeFilter: number;
  startDateFilter: Date = new Date();
  endDateFilter: Date = new Date();

  constructor(private ticketService: TicketService, private router: Router) {}

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      lengthChange: true,
      searching: false,
      ordering: false,
      language: {
        emptyTable: "",
      },
    };
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  generateReportHandler() {
    if (this.driverTypeFilter == 1) {
      // Create Payment for Employee...
      console.log(this.driverTypeFilter, this.selectedItemIDs);
      const options: {} = {
        itemIDs: this.selectedItemIDs
      };
      this.router.navigate(['/payments/create-payments'], { queryParams: options });
    }
    else if (this.driverTypeFilter == 2) {
      // Create Payment for Truck Hire...
    }
    else {
      // Something bad happened...
    }
  }

  onSelectRow(isChecked: boolean, itemID: number) {
    if (isChecked) {
      this.selectedItemIDs.push(itemID);
    } else {
      const idIndex: number = this.selectedItemIDs.indexOf(itemID);
      if (idIndex !== -1) {
        this.selectedItemIDs.splice(idIndex, 1);
      }
    }

    console.log(this.selectedItemIDs);
  }

  getPayableTicketItems() {
    this.isLoading = true;

    const payload: {} = {
      driverType: this.driverTypeFilter,
      startDate: new Date(Date.UTC(this.startDateFilter.getFullYear(), this.startDateFilter.getMonth(), this.startDateFilter.getDate())).toISOString(),
      endDate: new Date(Date.UTC(this.endDateFilter.getFullYear(), this.endDateFilter.getMonth(), this.endDateFilter.getDate())).toISOString(),
    };

    this.ticketService.getPayableTicketItems(payload).subscribe({
      next: (response) => {
        this.ticketItems = response.ResponseData;
        console.log(this.ticketItems);

        // Calling the DT trigger to manually render the table
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger.next();
        });
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
}
