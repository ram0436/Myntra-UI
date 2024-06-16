import { Component } from "@angular/core";
import { ProductService } from "src/codeokk/shared/service/product.service";
import { UserService } from "./../../service/user.service";
import { MatSnackBar } from "@angular/material/snack-bar";

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
  selectedSize: number | null = null;
  isLoading: boolean = true;

  constructor(
    private productService: ProductService,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.getUserWishlistData();
  }

  addToBag(productId: string) {
    const cartItem = {
      id: 0,
      productCode: productId,
      createdBy: Number(localStorage.getItem("id")),
      productSizeId: this.selectedSize,
      createdOn: new Date().toISOString(),
      modifiedBy: Number(localStorage.getItem("id")),
      modifiedOn: new Date().toISOString(),
      userId: Number(localStorage.getItem("id")),
    };

    this.userService.addToCart(cartItem).subscribe(
      (response: any) => {
        this.showNotification("Successfully Added to Cart");
        // this.productService.bagCount.subscribe((count) => {
        //   this.productService.updateBagCount(count + 1);
        // });
        // this.productService.bagCount += 1;
      },
      (error: any) => {}
    );
  }

  showNotification(message: string): void {
    this.snackBar.open(message, "Close", {
      duration: 5000,
      horizontalPosition: "end",
      verticalPosition: "top",
    });
  }

  updateWishlistCount() {
    this.wishlistCount--;
  }

  getUserWishlistData() {
    this.userService
      .getWishListByUserId(Number(localStorage.getItem("id")))
      .subscribe(
        (response: any) => {
          this.isLoading = false;
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
