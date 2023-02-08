import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { BaseService } from "./base.service";
import { catchError } from "rxjs/operators";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class QbauthService extends BaseService {
  constructor(protected http: HttpClient) {
    super(http);
  }

  getQbAuthData(): Observable<any[]> {
    const url = `${environment.BASE_URL}Auth/qbauth`;
    return this.http
      .post<any>(url, {}, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
  sendQueryParams(data): Observable<any[]> {
    const url = `${environment.BASE_URL}Auth/qbauthwithcode`;
    return this.http
      .post<any>(url, data, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
}
