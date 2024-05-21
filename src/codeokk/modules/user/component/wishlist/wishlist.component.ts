import { Component } from "@angular/core";
import { ProductService } from "src/codeokk/shared/service/product.service";
import { UserService } from "./../../service/user.service";

@Component({
  selector: "app-wishlist",
  templateUrl: "./wishlist.component.html",
  styleUrls: ["./wishlist.component.css"],
})
export class WishlistComponent {
  products: any[] = [];
  savedProducts: any[] = [];
  wishlistCount: number = 0;
  savedItems: any[] = [];

  constructor(
    private productService: ProductService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.getUserWishlistData();
  }

  updateWishlistCount() {
    this.wishlistCount--;
  }

  getUserWishlistData() {
    this.userService
      .getWishListByUserId(Number(localStorage.getItem("id")))
      .subscribe(
        (response: any) => {
          this.wishlistCount = response.length;
          this.savedItems = response;
          response.forEach((item: any) => {
            this.handleDashboardData(item);
          });
        },
        (error: any) => {}
      );
  }

  handleDashboardData(wishlistItem: any) {
    this.productService
      .getProductByProductCode(wishlistItem.productCode)
      .subscribe(
        (dashboardResponse: any) => {
          if (dashboardResponse) {
            const productDetails = Array.isArray(dashboardResponse)
              ? dashboardResponse[0]
              : dashboardResponse;
            this.savedProducts.push({
              ...productDetails,
              cartId: wishlistItem.id,
            });
          }
        },
        (dashboardError: any) => {
          console.error("Error fetching product details", dashboardError);
        }
      );
  }

  removeItemFromWishlist(event: Event, cartId: any) {
    event.preventDefault();
    event.stopPropagation();

    this.userService
      .removeItemFromWishlist(cartId, Number(localStorage.getItem("id")))
      .subscribe(
        (response: any) => {
          this.savedProducts = this.savedProducts.filter(
            (product) => product.cartId !== cartId
          );
        },
        (error) => {}
      );
  }
}
