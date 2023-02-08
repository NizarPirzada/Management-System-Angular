import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { BaseService } from "./base.service";
import { catchError } from "rxjs/operators";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class InvoiceService extends BaseService {
  constructor(protected http: HttpClient) {
    super(http);
  }

  ngOnInit(): void {}

  //Get All tickets not invoiced
  getJobListForInvoice(fromDate, toDate): Observable<any> {
    const url = `${environment.BASE_URL}Invoice/GetJobListForInvoice?StartDate=${fromDate}&EndDate=${toDate}`;
    return this.http.post<any>(url, {}, this.httpOptions).pipe(catchError(this.handleError));
  }

  getInvoices(data: {}): Observable<any> {
    const url = `${environment.BASE_URL}Invoice/GetInvoices`;
    return this.http.post<any>(url, { ...data }, this.httpOptions).pipe(catchError(this.handleError));
  }

  CreateInvoice(data: any): Observable<any> {
    const url = `${environment.BASE_URL}Invoice/CreateInvoice`;
    return this.http.post<any>(url, data, this.httpOptions).pipe(catchError(this.handleError));
  }

  GetInvoiceByDate(payload): Observable<any> {
    const url = `${environment.BASE_URL}Invoice/GetInvoiceByDate`;
    return this.http.post<any>(url, payload, this.httpOptions).pipe(catchError(this.handleError));
  }

  markInvoiceReadyForPayments(invoiceId): Observable<any> {
    const url = `${environment.BASE_URL}Invoice/MarkInvoiceReadyForPayment?invoiceID=${invoiceId}`;
    return this.http.get<any>(url, this.httpOptions).pipe(catchError(this.handleError));
  }

  GetInvoicesByStatus(status): Observable<any> {
    const url = `${environment.BASE_URL}Invoice/GetInvoicesByStatus?stauts=${status}`;
    return this.http.get<any>(url, this.httpOptions).pipe(catchError(this.handleError));
  }
  updateStatus(invoiceID): Observable<any> {
    const url = `${environment.BASE_URL}Invoice/MarkInvoiceStatus`;
    return this.http.post<any>(url, invoiceID, this.httpOptions).pipe(catchError(this.handleError));
  }

  MarkInvoiceAsPaid(Invoice_Check): Observable<any> {
    const url = `${environment.BASE_URL}Invoice/MarkInvoiceAsPaid`;
    return this.http.post<any>(url, Invoice_Check, this.httpOptions).pipe(catchError(this.handleError));
  }

  GetInvoiceByStartEndDate(payload): Observable<any> {
    const url = `${environment.BASE_URL}Invoice/GetInvoicesNotMarkedForPayment`;
    return this.http.post<any>(url, payload, this.httpOptions).pipe(catchError(this.handleError));
  }

  GetPayableTickets(payload): Observable<any> {
    const url = `${environment.BASE_URL}Payment/GetPayableTickets`;
    return this.http.post<any>(url, payload, this.httpOptions).pipe(catchError(this.handleError));
  }

  getInvoiceDetails(invoiceNumber: number): Observable<any> {
    const url = `${environment.BASE_URL}Invoice/GetInvoiceDetails?invoiceNumber=${invoiceNumber}`;
    return this.http.get<any>(url, this.httpOptions).pipe(catchError(this.handleError));
  }

  generateInvoiceDetails(jobID: number, jobProductID: number, invoiceID: number, startDate: string = null, endDate: string = null): Observable<any> {
    const url = `${environment.BASE_URL}Invoice/GenerateInvoiceDetails`;
    return this.http.get<any>(`${url}?jobID=${jobID}&jobProductID=${jobProductID}&invoiceID=${invoiceID}&startDate=${startDate}&endDate=${endDate}`, this.httpOptions).pipe(catchError(this.handleError));
  }

  createPayment(payload: {}): Observable<any> {
    const url = `${environment.BASE_URL}Payment/CreatePayment`;
    return this.http.post<any>(url, { ...payload }, this.httpOptions).pipe(catchError(this.handleError));
  }

  createBill(payload: {}): Observable<any> {
    const url = `${environment.BASE_URL}Payment/CreateBill`;
    return this.http.post<any>(url, { ...payload }, this.httpOptions).pipe(catchError(this.handleError));
  }

  updateVoidStatus(invoiceID: number, status: boolean): Observable<any> {
    const url = `${environment.BASE_URL}Invoice/UpdateVoidStatus`;
    return this.http.post<any>(url, { invoiceID, status }, this.httpOptions).pipe(catchError(this.handleError));
  }

  updateFundedStatus(invoiceID: number, status: boolean): Observable<any> {
    const url = `${environment.BASE_URL}Invoice/UpdateFundedStatus`;
    return this.http.post<any>(url, { invoiceID, status }, this.httpOptions).pipe(catchError(this.handleError));
  }

  setIsReadyForPayment(invoiceID: number): Observable<any> {
    const url = `${environment.BASE_URL}Invoice/SetIsReadyForPayment?invoiceID=${invoiceID}`;
    return this.http.post<any>(url, this.httpOptions).pipe(catchError(this.handleError));
  }
}
