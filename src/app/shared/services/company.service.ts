import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { BaseService } from "./base.service";
import { environment } from "src/environments/environment";
import { catchError } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class CompanyService extends BaseService {
  constructor(protected http: HttpClient) {
    super(http);
  }

  getAllCompanies(): Observable<any[]> {
    const url = `${environment.BASE_URL}Company/GetAllCompanies`;
    return this.http.get<any>(url, this.httpOptions).pipe(catchError(this.handleError));
  }

  getUserCompanies(): Observable<any[]> {
    const url = `${environment.BASE_URL}Company/GetCompanyInformation`;
    return this.http.get<any>(url, this.httpOptions).pipe(catchError(this.handleError));
  }

  updateCompany(data) {
    const url = `${environment.BASE_URL}Company/UpdateCompanyInformation`;
    return this.http.post<any>(url, data, this.httpOptions).pipe(catchError(this.handleError));
  }

  setCompanyAsActive(companyID: number) {
    const url = `${environment.BASE_URL}Company/SetCompanyAsActive?companyID=${companyID}`;
    return this.http.post<any>(url, null, this.httpOptions).pipe(catchError(this.handleError));
  }
}
