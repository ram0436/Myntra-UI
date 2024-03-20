import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BehaviorSubject, Subject } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class MasterService {
  private dataSubject = new Subject<any>();

  private brandsDataSubject = new Subject<any>();

  constructor(private http: HttpClient) {}

  private baseUrl = environment.baseUrl;

  getAllParentCategories() {
    return this.http.get(`${this.baseUrl}/Master/GetAllParentCategory`);
  }

  getAllColors() {
    return this.http.get(`${this.baseUrl}/Master/GetAllColor`);
  }

  getAllProductSize() {
    return this.http.get(`${this.baseUrl}/Master/GetAllProductSize`);
  }

  getAllBrands() {
    return this.http.get(`${this.baseUrl}/Master/GetAllBrand`);
  }

  getCategoryByParentCategoryId(parentCategoryId: number) {
    return this.http.get(
      `${this.baseUrl}/Master/GetCategoryByParentCategoryId?parentCategoryId=${parentCategoryId}`
    );
  }

  getSubCategoryByCategoryId(categoryId: number) {
    return this.http.get(
      `${this.baseUrl}/Master/GetSubCategoryByCategoryId?CategoryId=${categoryId}`
    );
  }

  addBrand(payload: any) {
    return this.http.post(`${this.baseUrl}Master/AddBrand`, payload);
  }

  addParentCategory(payload: any) {
    return this.http.post(`${this.baseUrl}/Master/AddParentCategory`, payload);
  }

  addCategory(payload: any) {
    return this.http.post(`${this.baseUrl}/Master/AddCategory`, payload);
  }

  addSubCategory(payload: any) {
    return this.http.post(`${this.baseUrl}/Master/AddSubCategory`, payload);
  }

  addColor(payload: any) {
    return this.http.post(`${this.baseUrl}/Master/AddColor`, payload);
  }

  setData(data: any) {
    this.dataSubject.next(data);
  }

  setBrandsData(data: any) {
    this.brandsDataSubject.next(data);
  }

  getData() {
    return this.dataSubject.asObservable();
  }

  getBrandsData() {
    return this.brandsDataSubject.asObservable();
  }
}
