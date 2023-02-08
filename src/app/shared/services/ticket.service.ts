import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { BaseService } from "./base.service";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class TicketService extends BaseService {
  constructor(protected http: HttpClient) {
    super(http);
  }

  ngOnInit(): void {}

  //Get All tickets not invoiced
  getAllTickets(date, offset, limit, invoiced: boolean = false): Observable<any> {
    const url = `${environment.BASE_URL}Ticket/GetTicketsNotInvoicedPaging?`;
    return this.http.get<any>(url + `endDate=${date}&offset=${offset}&limit=${limit}&invoiced=${invoiced}`, this.httpOptions).pipe(catchError(this.handleError));
  }

  //Get tickets line item by ticket id
  getTicketsLineItemByTicketId(id) {
    const url = `${environment.BASE_URL}Ticket/GetTicketLineItems?`;
    return this.http.get<any>(url + `itemId=${id}`, this.httpOptions).pipe(catchError(this.handleError));
  }

  //Get ticket detail by ticket id
  getTicketsDetailByTicketId(id) {
    const url = `${environment.BASE_URL}Ticket/GetTicketDetailByTicket?`;
    return this.http.get<any>(url + `ticketId=${id}`, this.httpOptions).pipe(catchError(this.handleError));
  }

  //Get tickets line item detail by line item
  getTicketsLineItemDeteailByTicketLineItemId() {
    const url = `${environment.BASE_URL}Ticket/GetTicketLineItemDetail`;
    return this.http.get<any>(url, this.httpOptions).pipe(catchError(this.handleError));
  }

  //Get tickets not paid by job id -> search funtionality
  getTicketsNotPaidByJobId(id) {
    const url = `${environment.BASE_URL}Ticket/GetTicketsNotPaidByJob?`;
    return this.http.get<any>(url + `jobId=${id}`, this.httpOptions).pipe(catchError(this.handleError));
  }

  //Get tickets not paid by ticket number -> search funtionality
  getTicketsNotPaidByTicketNumber(id) {
    const url = `${environment.BASE_URL}Ticket/GetTicketsNotPaidByTicketNumber?`;
    return this.http.get<any>(url + `ticketNumber=${id}`, this.httpOptions).pipe(catchError(this.handleError));
  }
  //Get ticket History
  getHistoryById(id): Observable<any> {
    const url = `${environment.BASE_URL}Ticket/GetTicketHistory?`;
    return this.http.get<any>(url + `ticketId=${id}`, this.httpOptions).pipe(catchError(this.handleError));
  }

  addTicket(data): Observable<any> {
    const url = `${environment.BASE_URL}Ticket/UpdateTicket`;
    return this.http.post<any>(url, data, this.httpOptions).pipe(catchError(this.handleError));
  }

  addTicketLineItem(data): Observable<any> {
    const url = `${environment.BASE_URL}Ticket/UpdateTicketLineItem`;
    return this.http.post<any>(url, data, this.httpOptions).pipe(catchError(this.handleError));
  }

  getTicketSummary(): Observable<any> {
    const url = `${environment.BASE_URL}Ticket/GetTicketsSummary?`;
    return this.http.get<any>(url, this.httpOptions).pipe(catchError(this.handleError));
  }

  getPayableTickets(data: {}): Observable<any> {
    const url = `${environment.BASE_URL}Ticket/GetPayableTickets`;
    return this.http.post<any>(url, { ...data }, this.httpOptions).pipe(catchError(this.handleError));
  }

  getPayableTicketItems(data: {}): Observable<any> {
    const url = `${environment.BASE_URL}Ticket/GetPayableTicketItems`;
    return this.http.post<any>(url, { ...data }, this.httpOptions).pipe(catchError(this.handleError));
  }

  deleteTicket(id: number): Observable<any> {
    const url = `${environment.BASE_URL}Ticket/DeleteTicket?id=${id}`;
    return this.http.delete<any>(url, this.httpOptions).pipe(catchError(this.handleError));
  }

  addInvoice(data): Observable<any> {
    const url = ``;
    return of(data).pipe();
  }

  updateTicket(data): Observable<any> {
    const url = ``;
    return of(data).pipe();
  }
}
