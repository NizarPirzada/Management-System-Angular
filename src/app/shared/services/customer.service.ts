import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, Subscriber, of } from "rxjs";
import { BaseService } from './base.service';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CustomerService extends BaseService {

  constructor(protected http: HttpClient) {
    super(http);
  }

  getAllCustomers(): Observable<any> {
    const url = `${environment.BASE_URL}Customer/GetCustomerList`;
    return this.http.get<any>(url, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  getAllCustomersWithInactive(): Observable<any[]> {
    const url = `${environment.BASE_URL}Customer/GetCustomerListWithInactive`;
    return this.http.get<any>(url, this.httpOptions).pipe(
      catchError(this.handleError)
    );

    // return of(this.customers).pipe(); // temprary code
  }

  getCustomerById(id): Observable<any> {
    const url = `${environment.BASE_URL}Customer/GetCustomerDetail?`;
    return this.http.get<any>(url + `customerId=${id}`, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }
  getCustomerBycode(id): Observable<any> {
    const url = `${environment.BASE_URL}Customer/GetCustomerDetailByCode?`;
    return this.http.get<any>(url + `code=${id}`, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  addCustomer(data): Observable<any> {
    const url = `${environment.BASE_URL}Customer/UpdateCustomer`;
    return this.http.post<any>(url, data, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }
  getHistoryById(id): Observable<any> {
    const url = `${environment.BASE_URL}Customer/GetCustomerHistory?`;
    return this.http.get<any>(url + `customerId=${id}`, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  updateCustomer(data): Observable<any> {
    const url = ``;
    //return this.http.put(url, data, this.httpOptions).pipe(catchError(this.handleError));

    return of(data).pipe();
  }

  // customers dummy object
  // customers = [
  //   {
  //     id: 1,
  //     code: "123",
  //     description: "Some Description",
  //     address_1: "some address",
  //     address_2: "address 2",
  //     city: "islamabad",
  //     state: "pakistan",
  //     zip_Code: "123",
  //     phone: "92143041544",
  //     fax: "N/A",
  //     is_Inactive: true
  //   },
  //   {
  //     id: 1,
  //     code: "123",
  //     description: "Some Description",
  //     address_1: "some address",
  //     address_2: "address 2",
  //     city: "islamabad",
  //     state: "pakistan",
  //     zip_Code: "123",
  //     phone: "92143041544",
  //     fax: "N/A",
  //     is_Inactive: true
  //   },
  //   {
  //     id: 1,
  //     code: "123",
  //     description: "Some Description",
  //     address_1: "some address",
  //     address_2: "address 2",
  //     city: "islamabad",
  //     state: "pakistan",
  //     zip_Code: "123",
  //     phone: "92143041544",
  //     fax: "N/A",
  //     is_Inactive: true
  //   }
  // ];

}