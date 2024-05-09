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

  constructor(
    private productService: ProductService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.userService.getWishListByUserId(1).subscribe(
      (response: any) => {
        this.wishlistCount = response.length;
        response.forEach((item: any) => {
          const productCode = item.productCode;
          this.handleDashboardData(productCode);
        });
      },
      (error: any) => {
        // console.error("API Error:", error);
      }
    );
  }

  handleDashboardData(productCode: string) {
    this.productService.getProductByProductCode(productCode).subscribe(
      (dashboardResponse: any) => {
        if (Array.isArray(dashboardResponse)) {
          this.savedProducts.push(...dashboardResponse);
          // this.isLoading = false;
        } else if (
          typeof dashboardResponse === "object" &&
          dashboardResponse !== null
        ) {
          this.savedProducts.push(dashboardResponse);
          // this.isLoading = false;
        } else {
        }
      },
      (dashboardError: any) => {
        this.savedProducts = [];
        // this.isLoading = false;
      }
    );
  }
}
