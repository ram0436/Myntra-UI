import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ProductService } from "src/codeokk/shared/service/product.service";
import { UserService } from "src/codeokk/modules/user/service/user.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { LoginComponent } from "../user/component/login/login.component";

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
  dialogRef: MatDialogRef<any> | null = null;
  isUserLogedIn: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
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
    if (localStorage.getItem("id") != null) {
      if (this.selectedSize !== null) {
        const cartItem = {
          id: 0,
          productCode: productId,
          createdBy: Number(localStorage.getItem("id")),
          productSizeId: this.selectedSize,
          // createdBy: localStorage.getItem("id"),
          createdOn: new Date().toISOString(),
          modifiedBy: Number(localStorage.getItem("id")),
          modifiedOn: new Date().toISOString(),
          userId: Number(localStorage.getItem("id")),
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
    } else {
      this.openLoginModal();
    }
  }

  openLoginModal() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }

    this.dialogRef = this.dialog.open(LoginComponent, { width: "450px" });

    this.dialogRef.afterClosed().subscribe((result) => {
      if (localStorage.getItem("authToken") != null) this.isUserLogedIn = true;
    });
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

    if (localStorage.getItem("id") != null) {
      this.favoriteStatus[productId] = this.favoriteStatus[productId] || false;

      this.favoriteStatus[productId] = !this.favoriteStatus[productId];

      if (this.favoriteStatus[productId]) {
        this.addToWishlist(productId);
      } else {
      }
    } else {
      this.openLoginModal();
    }
  }

  addToWishlist(productId: string) {
    const wishlistItem = {
      id: 0,
      productCode: productId,
      createdBy: Number(localStorage.getItem("id")),
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
