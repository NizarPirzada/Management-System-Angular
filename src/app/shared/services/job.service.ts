import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { catchError } from 'rxjs/operators';
import { BaseService } from './base.service';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class JobService extends BaseService {

  constructor(protected http: HttpClient) {
    super(http);
  }

  getJobByCode(code: string): Observable<any> {
    const url = `${environment.BASE_URL}Job/GetJobByCode?code=${code}`;
    return this.http.get<any>(url , this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }
  // `customerId=${id}`  //?
  getJobById(id: number): Observable<any> {
    const url = `${environment.BASE_URL}Job/GetJobList?`;
    return this.http.get<any>(url + `customerId=${id}`, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }
  getCompleteJobById(id: number): Observable<any> {
    const url = `${environment.BASE_URL}Job/GetJobListWithComplete?`;
    return this.http.get<any>(url + `customerId=${id}`, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }


  //Get job detail by job id
  getJobDetailByJobId(id: number): Observable<any> {
    const url = `${environment.BASE_URL}Job/GetJobDetailByJobId?`;
    return this.http.get<any>(url + `jobId=${id}`, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }


  addJob(data): Observable<any> {
    const url = `${environment.BASE_URL}Job/UpdateJob`;
     return this.http.post(url, data, this.httpOptions).pipe(catchError(this.handleError));
   }

   getHistoryById(id): Observable<any> {
    const url = `${environment.BASE_URL}Job/GetJobHistory?`;
    return this.http.get<any>(url + `jobId=${id}`, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  updateJob(data): Observable<any> {
    const url = ``;
    //return this.http.put(url, data, this.httpOptions).pipe(catchError(this.handleError));

    return of(data).pipe();
  }



}