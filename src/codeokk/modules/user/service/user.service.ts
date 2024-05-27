import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private dataSubject = new Subject<any>();
  private userData: any = [];

  private baseUrl = environment.baseUrl;

  private selectedCount: number = 0;
  private totalMRP: number = 0;
  private totalDiscount: number = 0;
  private totalAmount: number = 0;

  private userName: string = "";
  private mobileNo: string = "";

  private userDataKey = "userData";

  private priceDetailsKey = "priceDetails";

  constructor(private httpClient: HttpClient) {}

  setPriceDetails(
    selectedCount: number,
    totalMRP: number,
    totalDiscount: number,
    totalAmount: number
  ) {
    this.selectedCount = selectedCount;
    this.totalMRP = totalMRP;
    this.totalDiscount = totalDiscount;
    this.totalAmount = totalAmount;
  }

  getPriceDetails() {
    return {
      selectedCount: this.selectedCount,
      totalMRP: this.totalMRP,
      totalDiscount: this.totalDiscount,
      totalAmount: this.totalAmount,
    };
  }

  // setPriceDetails(
  //   selectedCount: number,
  //   totalMRP: number,
  //   totalDiscount: number,
  //   totalAmount: number
  // ) {
  //   const priceDetails = {
  //     selectedCount,
  //     totalMRP,
  //     totalDiscount,
  //     totalAmount,
  //   };
  //   localStorage.setItem(this.priceDetailsKey, JSON.stringify(priceDetails));
  // }

  // getPriceDetails() {
  //   const priceDetailsString = localStorage.getItem(this.priceDetailsKey);
  //   if (priceDetailsString) {
  //     return JSON.parse(priceDetailsString);
  //   }
  //   return null;
  // }

  setUserData(data: { name: string; mobile: string }) {
    localStorage.setItem(this.userDataKey, JSON.stringify(data));
  }

  getUserData() {
    const userDataString = localStorage.getItem(this.userDataKey);
    if (userDataString) {
      return JSON.parse(userDataString);
    }
    return null;
  }

  getAddress(pinCode: any) {
    return this.httpClient.get(
      "https://api.postalpincode.in/pincode/" + pinCode
    );
  }

  saveAddress(payload: any) {
    return this.httpClient.post(`${this.baseUrl}User/SaveAddress`, payload);
  }

  setData(data: any) {
    this.dataSubject.next(data);
  }

  addWishList(payload: any) {
    return this.httpClient.post(`${this.baseUrl}User/AddWishList`, payload);
  }

  addToCart(payload: any) {
    return this.httpClient.post(`${this.baseUrl}User/AddToCart`, payload);
  }

  createOrder(payload: any) {
    return this.httpClient.post(`${this.baseUrl}User/CreateOrder`, payload);
  }

  getOrderByUserId(userId: any) {
    return this.httpClient.get(
      `${this.baseUrl}User/GetOrderByUserId?userId=${userId}`
    );
  }

  removeItemFromCart(cartId: any, userId: any) {
    return this.httpClient.delete(
      `${this.baseUrl}User/RemoveCartById?cartId=${cartId}&loggedInUserId=${userId}`
    );
  }

  removeItemFromWishlist(cartId: any, userId: any) {
    return this.httpClient.delete(
      `${this.baseUrl}User/RemoveWishlisttById?cartId=${cartId}&loggedInUserId=${userId}`
    );
  }

  getWishListByUserId(userId: any) {
    return this.httpClient.get(
      `${this.baseUrl}User/GetWishListByUserId?userId=${userId}`
    );
  }

  getAddressByUserId(userId: any) {
    return this.httpClient.get(
      `${this.baseUrl}User/GetAddressByUserId?userId=${userId}`
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
