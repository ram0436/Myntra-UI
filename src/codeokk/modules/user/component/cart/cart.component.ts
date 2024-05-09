import { Component } from "@angular/core";
import { ProductService } from "src/codeokk/shared/service/product.service";
import { UserService } from "../../service/user.service";

@Component({
  selector: "app-cart",
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.css"],
})
export class CartComponent {
  offers: string[] = [
    "10% Instant Discount on Citi-branded Credit and Debit Cards on a minimum spend of ₹3,000. TCA",
    "10% Instant Discount on Citi-branded Credit and Debit Cards on a minimum spend of ₹3,000. TCA",
    "10% Instant Discount on Citi-branded Credit and Debit Cards on a minimum spend of ₹3,000. TCA",
  ];
  showMore: boolean = false;
  cartProducts: any[] = [];
  cartCount: number = 0;

  constructor(
    private productService: ProductService,
    private userService: UserService
  ) {}

  toggleShowMore() {
    this.showMore = !this.showMore;
  }

  ngOnInit() {
    this.userService.getCartItemByUserId(1).subscribe(
      (response: any) => {
        response.forEach((item: any) => {
          const productCode = item.productCode;
          this.handleDashboardData(productCode);
        });
      },
      (error: any) => {}
    );
  }

  handleDashboardData(productCode: string) {
    this.productService.getProductByProductCode(productCode).subscribe(
      (dashboardResponse: any) => {
        if (Array.isArray(dashboardResponse)) {
          this.cartProducts.push(...dashboardResponse);
          console.log(this.cartProducts);
          // this.isLoading = false;
        } else if (
          typeof dashboardResponse === "object" &&
          dashboardResponse !== null
        ) {
          this.cartProducts.push(dashboardResponse);
          console.log(this.cartProducts);
          // this.isLoading = false;
        } else {
        }
      },
      (dashboardError: any) => {
        this.cartProducts = [];
        // this.isLoading = false;
      }
    );
  }

  getImageUrl(product: any): string {
    if (product.productImageList.length > 0) {
      return product.productImageList[0].imageURL;
    } else {
      return "/assets/no-img.png";
    }
  }

  getProductSize(product: any): string {
    // Assuming productSize is an array of sizes and we are using the first size
    return product.productSize && product.productSize.length > 0
      ? product.productSize[0].size
      : "";
  }
}
