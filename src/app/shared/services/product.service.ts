import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { BaseService } from "./base.service";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ProductService extends BaseService {
  constructor(protected http: HttpClient) {
    super(http);
  }

  getAllProducts(): Observable<any> {
    const url = `${environment.BASE_URL}Product/GetProductList`;
    return this.http.get<any>(url, this.httpOptions).pipe(catchError(this.handleError));
  }

  getProductById(id: number): Observable<any> {
    const url = `${environment.BASE_URL}Product/GetProductByJobId?`;
    return this.http.get<any>(url + `jobId=${id}`, this.httpOptions).pipe(catchError(this.handleError));
  }

  getJobProductDetail(id: number): Observable<any> {
    const url = `${environment.BASE_URL}Job/GetJobProductDetail?`;
    return this.http.get<any>(url + `jobProductId=${id}`, this.httpOptions).pipe(catchError(this.handleError));
  }

  getProductDetailsByProductId(id: number): Observable<any> {
    const url = `${environment.BASE_URL}Product/GetProductDetailByProductId?`;
    return this.http.get<any>(url + `id=${id}`, this.httpOptions).pipe(catchError(this.handleError));
  }
  getProductDetailByCode(Code): Observable<any> {
    const url = `${environment.BASE_URL}Product/GetProductDetailByCode?`;
    return this.http.get<any>(url + `code=${Code}`, this.httpOptions).pipe(catchError(this.handleError));
  }

  addProduct(data): Observable<any> {
    const url = `${environment.BASE_URL}Product/UpdateProduct`;
    return this.http.post<any>(url, data, this.httpOptions).pipe(catchError(this.handleError));
  }

  updateJobProduct(data): Observable<any> {
    const url = `${environment.BASE_URL}Job/UpdateJobProduct`;
    return this.http.post(url, data, this.httpOptions).pipe(catchError(this.handleError));
  }

  updateProduct(data): Observable<any> {
    const url = ``;
    return of(data).pipe();
  }
  getHistoryById(id): Observable<any> {
    const url = `${environment.BASE_URL}Product/GetProductHistory?`;
    return this.http.get<any>(url + `productId=${id}`, this.httpOptions).pipe(catchError(this.handleError));
  }
}
