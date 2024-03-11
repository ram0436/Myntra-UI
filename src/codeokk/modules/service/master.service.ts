import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class MasterService {
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
}
