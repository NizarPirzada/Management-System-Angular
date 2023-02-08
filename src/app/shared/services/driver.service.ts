import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { BaseService } from "./base.service";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class DriverService extends BaseService {
  constructor(protected http: HttpClient) {
    super(http);
  }

  getAllDrivers(): Observable<any[]> {
    const url = `${environment.BASE_URL}DriverType/GetDriverList`;
    return this.http.get<any>(url, this.httpOptions).pipe(catchError(this.handleError));
  }

  GetAllDriverWithInactive(): Observable<any[]> {
    const url = `${environment.BASE_URL}DriverType/GetDriverListWithInactive`;
    return this.http.get<any>(url, this.httpOptions).pipe(catchError(this.handleError));
  }

  getDriverDetailByDriverId(id) {
    const url = `${environment.BASE_URL}DriverType/GetDriverDetailByItemId?`;
    return this.http.get<any>(url + `itemID=${id}`, this.httpOptions).pipe(catchError(this.handleError));
  }

  getDriverDetailByCode(id) {
    const url = `${environment.BASE_URL}DriverType/GetDriverDetailByCode?`;
    return this.http.get<any>(url + `code=${id}`, this.httpOptions).pipe(catchError(this.handleError));
  }

  addt(data): Observable<any> {
    const url = `${environment.BASE_URL}DriverType/UpdateDriver`;
    return this.http.post(url, data, this.httpOptions).pipe(catchError(this.handleError));
  }

  addDriver(data): Observable<any> {
    const url = `${environment.BASE_URL}DriverType/UpdateDriver`;
    return this.http.post<any>(url, data, this.httpOptions).pipe(catchError(this.handleError));
  }

  addDriverType(data): Observable<any> {
    const url = `${environment.BASE_URL}DriverType/SaveUpdateDriverType`;
    return this.http.post(url, data, this.httpOptions).pipe(catchError(this.handleError));
  }

  getHistoryById(id): Observable<any[]> {
    const url = `${environment.BASE_URL}DriverType/GetDriverHistory?`;
    return this.http.get<any>(url + `itemId=${id}`, this.httpOptions).pipe(catchError(this.handleError));
  }

  adsdDriver(urlParams, data): Observable<any> {
    const url = `${environment.BASE_URL}DriverType/UpdateDriver?${urlParams}`;
    return this.http.post(url, data, this.httpOptions).pipe(catchError(this.handleError));
  }
}
