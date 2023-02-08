import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { BaseService } from "./base.service";

@Injectable({
  providedIn: "root",
})
export class ReportService extends BaseService {
  constructor(private httpClient: HttpClient) {
    super(httpClient);
  }

  moneyOutReport(data: {}): Observable<any> {
    const url = `${environment.BASE_URL}Report/MoneyOutReport`;
    return this.http.post<any>(url, { ...data }, this.httpOptions).pipe(catchError(this.handleError));
  }

  employeePayroll(data: {}): Observable<any> {
    const url = `${environment.BASE_URL}Report/EmployeePayroll`;
    return this.http.post<any>(url, { ...data }, this.httpOptions).pipe(catchError(this.handleError));
  }

  truckHireReport(invoiceID: number): Observable<any> {
    const url = `${environment.BASE_URL}Report/TruckHireReport?invoiceID=${invoiceID}`;
    return this.http.post<any>(url, {}, this.httpOptions).pipe(catchError(this.handleError));
  }

  truckHireReports(data: {}): Observable<any> {
    const url = `${environment.BASE_URL}Report/TruckHireReports`;
    return this.http.post<any>(url, { ...data }, this.httpOptions).pipe(catchError(this.handleError));
  }
}
