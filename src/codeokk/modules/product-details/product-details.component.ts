import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ProductService } from "src/codeokk/shared/service/product.service";
import { UserService } from "src/codeokk/modules/user/service/user.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-product-details",
  templateUrl: "./product-details.component.html",
  styleUrls: ["./product-details.component.css"],
})
export class ProductDetailsComponent {
  showModal: boolean = false;
  productDetails: any;
  favoriteStatus: { [key: string]: boolean } = {};
  selectedSize: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    var productCode;
    this.route.paramMap.subscribe((params) => {
      productCode = params.get("id");
    });
    if (productCode != null) {
      this.getPostDetails(productCode);
    }
  }

  selectSize(sizeId: number) {
    this.selectedSize = sizeId;
  }

  addToBag(productId: string) {
    if (this.selectedSize !== null) {
      const cartItem = {
        id: 0,
        productCode: productId,
        createdBy: 1,
        productSizeId: this.selectedSize,
        // createdBy: localStorage.getItem("id"),
        createdOn: new Date().toISOString(),
        modifiedBy: 1,
        modifiedOn: new Date().toISOString(),
        userId: 1,
      };

      this.userService.addToCart(cartItem).subscribe(
        (response: any) => {
          this.showNotification("Successfully Added to Cart");
        },
        (error: any) => {}
      );
    } else {
      this.showNotification("Please Select A Size First");
    }
  }

  getPostDetails(code: any) {
    this.productService.getProductByProductCode(code).subscribe((res: any) => {
      this.productDetails = res;
      // this.isLoading = false;
    });
  }

  toggleModal() {
    this.showModal = !this.showModal;
  }

  toggleFavorite(event: Event, productId: string) {
    event.preventDefault();
    event.stopPropagation();

    this.favoriteStatus[productId] = this.favoriteStatus[productId] || false;

    this.favoriteStatus[productId] = !this.favoriteStatus[productId];

    if (this.favoriteStatus[productId]) {
      this.addToWishlist(productId);
    } else {
    }
  }

  addToWishlist(productId: string) {
    const wishlistItem = {
      id: 0,
      productCode: productId,
      createdBy: 1,
      // createdBy: localStorage.getItem("id"),
      createdOn: new Date().toISOString(),
    };

    this.userService.addWishList(wishlistItem).subscribe(
      (response: any) => {
        this.showNotification("Successfully Added to Wishlist");
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
}
