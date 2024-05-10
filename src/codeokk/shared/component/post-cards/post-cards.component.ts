import { Component, HostListener, Input, Renderer2 } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ProductService } from "../../service/product.service";
import { UserService } from "src/codeokk/modules/user/service/user.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { LoginComponent } from "src/codeokk/modules/user/component/login/login.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-post-cards",
  templateUrl: "./post-cards.component.html",
  styleUrls: ["./post-cards.component.css"],
})
export class PostCardsComponent {
  @Input() products: any;
  favoriteStatus: { [key: string]: boolean } = {};
  wishlistRoute: boolean = false;
  isUserLogedIn: boolean = false;
  dialogRef: MatDialogRef<any> | null = null;

  // Pagination properties
  currentPage: number = 1;
  productsPerPage: number = 24;

  constructor(
    private router: Router,
    private productService: ProductService,
    private route: ActivatedRoute,
    private userService: UserService,
    private renderer: Renderer2,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.route.queryParams.subscribe((params) => {
      const routeName = this.router.url.split("?")[0];
      this.productsPerPage = routeName === "/filtered-posts" ? 25 : 24;
    });

    this.route.url.subscribe((urlSegments) => {
      this.wishlistRoute =
        urlSegments.length > 0 && urlSegments[0].path === "wishlist";
    });
  }

  // Function to get the index of the first product on the current page
  get startIndex(): number {
    return (this.currentPage - 1) * this.productsPerPage;
  }

  // Function to get the index of the last product on the current page
  get endIndex(): number {
    return Math.min(
      this.startIndex + this.productsPerPage,
      this.products.length
    );
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Generate an array of page numbers
  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get totalPages(): number {
    return Math.ceil(this.products.length / this.productsPerPage);
  }

  // Function to get the products to display on the current page
  get currentPageProducts(): any[] {
    return this.products.slice(this.startIndex, this.endIndex);
  }

  // Function to navigate to the previous page
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // Function to navigate to the next page
  nextPage() {
    const totalPages = Math.ceil(this.products.length / this.productsPerPage);
    if (this.currentPage < totalPages) {
      this.currentPage++;
    }
  }

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

    if (localStorage.getItem("id") != null) {
      // Toggle favorite status
      this.favoriteStatus[productId] = !this.favoriteStatus[productId];

      // Call addToWishlist method
      if (this.favoriteStatus[productId]) {
        this.addToWishlist(productId);
      } else {
        // You can implement removal from wishlist if needed
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

  addToWishlist(productId: string) {
    const wishlistItem = {
      id: 0,
      productCode: productId,
      createdBy: Number(localStorage.getItem("id")),
      // createdBy: localStorage.getItem("id"),
      createdOn: new Date().toISOString(),
    };

    console.log(wishlistItem);

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
