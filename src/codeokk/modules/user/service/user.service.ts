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

  setData(data: any) {
    this.dataSubject.next(data);
  }

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

  sendLoginOTP(
    mobileNumber: string,
    ipAddress: string,
    createdOn: string
  ): Observable<any> {
    const url = `${this.baseUrl}Auth/SendLoginOTP`;
    const body = {
      mobile: mobileNumber,
      ipAddress: ipAddress,
      createdOn: createdOn,
    };
    const headers = new HttpHeaders({ "Content-Type": "application/json" });
    return this.httpClient.post(url, body, { headers: headers });
  }

  OTPLogin(mobileNo: string, otp: number, firstName: string): Observable<any> {
    const url = `${this.baseUrl}Auth/OTPLogin?mobileNo=${mobileNo}&otp=${otp}&firstName=${firstName}`;
    return this.httpClient.post(url, null, {
      headers: new HttpHeaders({
        Accept: "*/*",
      }),
    });
  }
}
