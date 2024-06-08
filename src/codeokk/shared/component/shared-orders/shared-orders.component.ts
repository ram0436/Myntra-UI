import { Component, Input } from "@angular/core";
import { UserService } from "src/codeokk/modules/user/service/user.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { ProductService } from "src/codeokk/shared/service/product.service";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-shared-orders",
  templateUrl: "./shared-orders.component.html",
  styleUrls: ["./shared-orders.component.css"],
  providers: [DatePipe],
})
export class SharedOrdersComponent {
  @Input() userId: number | null = null;
  @Input() apiType: "admin" | "user" = "user";

  orderedProducts: any[] = [];
  orders: any[] = [];
  adminRoute: boolean = false;

  constructor(
    private userService: UserService,
    private productService: ProductService,
    private router: Router,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    if (this.apiType === "user" && this.userId) {
      this.getOrdersByUserId(this.userId);
    } else if (this.apiType === "admin") {
      this.adminRoute = true;
      this.getAllOrders();
    }
  }

  truncateText(text: string, maxLength: number): string {
    if (!text || text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + '...';
  }

  getAllOrders() {
    this.userService.getAllOrders().subscribe((data: any) => {
      this.orders = data.reverse();
      this.populateOrderedProducts();
    });
  }

  getOrdersByUserId(userId: number) {
    this.userService.getOrderByUserId(userId).subscribe((data: any) => {
      this.orders = data.reverse();
      this.populateOrderedProducts();
    });
  }

  populateOrderedProducts() {
    this.orders.forEach((order) => {
      let orderedProds: any[] = [];
      order.productOrderMapping.forEach((mapping: any) => {
        this.productService
          .getProductByProductId(mapping.productId)
          .subscribe((product: any) => {
            this.userService
              .getProductImageByProductId(mapping.productId)
              .subscribe((imageData: any) => {
                product[0].imageURL = imageData.imageURL;
                orderedProds.push(product);
              });
          });
      });
      this.orderedProducts.push(orderedProds);
    });
  }

  calculateDeliveryDate(createdOn: string): string {
    const createdDate = new Date(createdOn);
    const deliveryDate = new Date(
      createdDate.setDate(createdDate.getDate() + 3)
    );
    const currentDate = new Date();
    if (currentDate < deliveryDate) {
      return (
        "Estimated Delivery " +
          this.datePipe.transform(deliveryDate, "dd MMM yyyy") || ""
      ); // Format the date using DatePipe, or return empty string if null
    } else {
      return (
        "Delivered On " +
          this.datePipe.transform(deliveryDate, "dd MMM yyyy") || ""
      );
    }
  }

  getOrderCreatorName(creatorId: any): string {
    if (creatorId === this.userId) {
      const userDataString = localStorage.getItem("userData");
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        return userData ? userData.name : "";
      } else {
        return "";
      }
    } else {
      return creatorId;
    }
  }

  navigateToProductDetails(productCode: string) {
    this.router.navigate(["/product-details", productCode]);
  }

  getProductImage(product: any): string {
    if (
      product &&
      product.productImageList &&
      product.productImageList.length > 0
    ) {
      return product.productImageList[0].url;
    } else {
      return "../../../../../assets/no-img.png";
    }
  }
}
