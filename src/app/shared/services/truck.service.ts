import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { BaseService } from "./base.service";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class TruckService extends BaseService {
  constructor(protected http: HttpClient) {
    super(http);
  }

  getTruckTypes(): Observable<any> {
    const url: string = `${environment.BASE_URL}Truck/GetTruckTypes`;
    return this.http.get<any>(url, this.httpOptions).pipe(catchError(this.handleError));
  }

  getAllTrucks(): Observable<any> {
    const url = `${environment.BASE_URL}Truck/GetTruckList`;
    return this.http.get<any>(url, this.httpOptions).pipe(catchError(this.handleError));
  }

  getAllTruckswithInactive(): Observable<any> {
    const url = `${environment.BASE_URL}Truck/GetTruckListWithInactive`;
    return this.http.get<any>(url, this.httpOptions).pipe(catchError(this.handleError));
  }
  getTruckDetailByCode(Code): Observable<any> {
    const url = `${environment.BASE_URL}Truck/GetTruckDetailByCode?`;
    return this.http.get<any>(url + `code=${Code}`, this.httpOptions).pipe(catchError(this.handleError));
  }
  getTruckDetailByTruckId(id): Observable<any> {
    const url = `${environment.BASE_URL}Truck/GetTruckDetailByItemId?`;
    return this.http.get<any>(url + `itemID=${id}`, this.httpOptions).pipe(catchError(this.handleError));
  }

  getHistoryById(id): Observable<any> {
    const url = `${environment.BASE_URL}Truck/GetTruckHistory?`;
    return this.http.get<any>(url + `truckId=${id}`, this.httpOptions).pipe(catchError(this.handleError));
  }

  addTruck(data): Observable<any> {
    const url = `${environment.BASE_URL}Truck/UpdateTruck`;
    return this.http.post<any>(url, data, this.httpOptions).pipe(catchError(this.handleError));
  }

  updateTruckByTruckID(data): Observable<any> {
    const url = `${environment.BASE_URL}Truck/UpdateTruck?`;
    return this.http.post<any>(url, data, this.httpOptions).pipe(catchError(this.handleError));
  }
}
