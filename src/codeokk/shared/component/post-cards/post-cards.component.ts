import { Component, HostListener, Input, Renderer2 } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ProductService } from "../../service/product.service";
import { UserService } from "src/codeokk/modules/user/service/user.service";
// import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-post-cards",
  templateUrl: "./post-cards.component.html",
  styleUrls: ["./post-cards.component.css"],
})
export class PostCardsComponent {
  @Input() products: any;
  favoriteStatus: { [key: string]: boolean } = {};

  constructor(
    private router: Router,
    private productService: ProductService,
    private route: ActivatedRoute,
    private userService: UserService,
    private renderer: Renderer2
  ) {}

  getImageUrl(product: any): string {
    if (product.productImageList.length > 0) {
      return product.productImageList[0].imageURL;
    } else {
      return "/assets/no-img.png";
    }
  }

  toggleFavorite(event: Event, productId: string) {
    event.preventDefault();
    event.stopPropagation();

    // if (localStorage.getItem("id") != null) {
    this.favoriteStatus[productId] = this.favoriteStatus[productId] || false;

    this.favoriteStatus[productId] = !this.favoriteStatus[productId];

    if (this.favoriteStatus[productId]) {
      this.addToWishlist(productId);
    } else {
    }
    // } else {
    //   this.openLoginModal();
    // }
  }

  addToWishlist(productId: string) {
    const wishlistItem = {
      id: 0,
      productCode: productId,
      createdBy: 1,
      // createdBy: localStorage.getItem("id"),
      createdOn: new Date().toISOString(),
    };

    console.log(wishlistItem);

    this.userService.addWishList(wishlistItem).subscribe(
      (response: any) => {
        console.log(response);
      },
      (error: any) => {}
    );
  }

  // showNotification(message: string): void {
  //   this.snackBar.open(message, "Close", {
  //     duration: 5000,
  //     horizontalPosition: "end",
  //     verticalPosition: "top",
  //   });
  // }
}
