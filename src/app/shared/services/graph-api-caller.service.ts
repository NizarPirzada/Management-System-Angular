import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { BaseService } from "./base.service";

@Injectable({
  providedIn: "root",
})
export class GraphApiCallerService extends BaseService {
  constructor(protected http: HttpClient) {
    super(http);

    this.httpOptions = {
      headers: new HttpHeaders().append("Content-Type", "image/jpeg"),
      responseType: "blob",
    };
  }

  getUserProfileImage(): Observable<any> {
    const url = `https://graph.microsoft.com/v1.0/me/photo/$value`;
    return this.http.get<any>(url, this.httpOptions).pipe(catchError(this.handleError));
  }
}
