import { Component } from "@angular/core";
import { UserService } from "../../service/user.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { ProductService } from "src/codeokk/shared/service/product.service";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-orders",
  templateUrl: "./orders.component.html",
  styleUrls: ["./orders.component.css"],
  providers: [DatePipe],
})
export class OrdersComponent {
  selectedCount: number = 0;
  totalMRP: number = 0;
  totalDiscount: number = 0;
  totalAmount: number = 0;
  userOrders: any[] = [];
  orderedProducts: any[] = [];
  loggedInUserId: any;

  constructor(
    private userService: UserService,
    private productService: ProductService,
    private snackBar: MatSnackBar,
    private router: Router,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.getOrdersByUserId();
    this.loggedInUserId = Number(localStorage.getItem("id"));
  }

  getOrdersByUserId() {
    this.userService
      .getOrderByUserId(Number(localStorage.getItem("id")))
      .subscribe((data: any) => {
        this.userOrders = data.reverse();

        this.userOrders.forEach((order) => {
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
    if (creatorId === this.loggedInUserId) {
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

  // getProductbyProductId(productId: any) {
  //   return this.productService.getProductByProductId(productId);
  // }

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
