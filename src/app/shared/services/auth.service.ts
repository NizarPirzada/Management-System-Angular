import { Injectable } from '@angular/core';
import { Subject, Observable, Subscriber, throwError } from 'rxjs';
import { tap, catchError, map } from "rxjs/operators";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BaseService } from './base.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(protected http: HttpClient) { }
  // currentUser = new Subject();

  // setCurrentUser(user) {
  //   this.currentUser.next(user);
  // }


  headers = new HttpHeaders()
    .set("Content-Type", "application/json")
    .set("Accept", "application/json");
  httpOptions = {
    headers: this.headers,
  };

  // Handling Errors
  private handleError(error: any) {
    return throwError(error);
  }


  addLogin(data: any): Observable<any> {
    const url = `${environment.BASE_URL}Auth/token`;
    return this.http.post<any>(url, data, this.httpOptions).pipe(catchError(this.handleError), map((res: any) => {
      return res
    }));
  }
  // setCurrentUser(user){
  //  console.log(user)
  //   this.currentUser.next(user);
  // }

}

