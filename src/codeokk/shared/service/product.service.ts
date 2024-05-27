import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { tap } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class ProductService {
  constructor(private http: HttpClient) {
    // this.loadFromLocalStorage();
  }
  private BaseURL = environment.baseUrl;

  // private _bagCount: number = 0;

  // get bagCount(): number {
  //   return this._bagCount;
  // }

  // set bagCount(value: number) {
  //   this._bagCount = value;
  //   this.saveToLocalStorage();
  // }

  // private saveToLocalStorage() {
  //   localStorage.setItem(
  //     "bagCount",
  //     JSON.stringify({
  //       bagCount: this._bagCount,
  //     })
  //   );
  // }

  // private loadFromLocalStorage() {
  //   const bagString = localStorage.getItem("bagCount");
  //   if (bagString) {
  //     const bag = JSON.parse(bagString);
  //     this._bagCount = bag.bagCount;
  //   }
  // }

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

  getProductByProductId(id: any) {
    return this.http.get(
      `${this.BaseURL}Product/GetProductByProductId?productId=${id}`
    );
  }

  uploadProjectCodeImages(formData: any) {
    return this.http.post(`${this.BaseURL}Product/UploadImages`, formData);
  }

  saveProjectCodePost(payLoad: any) {
    return this.http.post(`${this.BaseURL}/Product`, payLoad);
  }
}
