import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private dataSubject = new Subject<any>();

  private baseUrl = environment.baseUrl;

  constructor(private httpClient: HttpClient) {}

  addWishList(payload: any) {
    return this.httpClient.post(`${this.baseUrl}User/AddWishList`, payload);
  }

  addToCart(payload: any) {
    return this.httpClient.post(`${this.baseUrl}User/AddToCart`, payload);
  }

  getWishListByUserId(userId: any) {
    return this.httpClient.get(
      `${this.baseUrl}User/GetWishListByUserId?userId=${userId}`
    );
  }

  getCartItemByUserId(userId: any) {
    return this.httpClient.get(
      `${this.baseUrl}User/GetCartItemByUserId?userId=${userId}`
    );
  }
}
