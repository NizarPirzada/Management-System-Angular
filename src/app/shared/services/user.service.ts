import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { BaseService } from "./base.service";

@Injectable({
  providedIn: "root",
})
export class UserService extends BaseService {
  constructor(protected http: HttpClient) {
    super(http);
  }

  storeActiveUser(): Observable<any[]> {
    const url = `${environment.BASE_URL}User/StoreActiveUser`;
    return this.http
      .post<any>(url, {}, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getUserRole(): Observable<any[]> {
    const url = `${environment.BASE_URL}User/GetUserRole`;
    return this.http
      .post<any>(url, {}, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getUsersByCompany(companyID: number): Observable<any[]> {
    const url = `${environment.BASE_URL}User/GetUsersByCompany?companyID=${companyID}`;
    return this.http
      .post<any>(url, {}, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getUsersNotInCompany(companyID: number): Observable<any[]> {
    const url = `${environment.BASE_URL}User/GetUsersNotInCompany?companyID=${companyID}`;
    return this.http
      .post<any>(url, {}, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  addUsersToCompany(companyID: number, userIDs: number[]) {
    const url = `${environment.BASE_URL}User/AddUsersToCompany`;
    return this.http
      .post<any>(url, { companyID, userIDs }, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  removeUserFromCompany(companyID: number, userID: number) {
    const url = `${environment.BASE_URL}User/RemoveUserFromCompany`;
    return this.http
      .post<any>(url, { companyID, userID }, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
}
