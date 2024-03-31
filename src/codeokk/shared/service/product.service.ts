import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { tap } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class ProductService {
  constructor(private http: HttpClient) {}
  private BaseURL = environment.baseUrl;

  getAllProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.BaseURL}Product/GetAllProduct`);
  }

  getAllColors() {
    return this.http.get<any[]>(`${this.BaseURL}Master/GetAllColor`);
  }

  getProductByProductCode(code: any) {
    return this.http.get(
      `${this.BaseURL}Product/GetProductByProductCode?productCode=` + code
    );
  }

  uploadProjectCodeImages(formData: any) {
    return this.http.post(`${this.BaseURL}/Product/UploadImages`, formData);
  }

  saveProjectCodePost(payLoad: any) {
    return this.http.post(`${this.BaseURL}/Product`, payLoad);
  }
}
