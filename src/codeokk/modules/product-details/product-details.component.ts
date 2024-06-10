import { Component, EventEmitter, Output } from "@angular/core";
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
  @Output() itemAddedToCart = new EventEmitter<void>();

  showModal: boolean = false;
  productDetails: any;
  favoriteStatus: { [key: string]: boolean } = {};
  selectedSize: number | null = null;
  dialogRef: MatDialogRef<any> | null = null;
  isUserLogedIn: boolean = false;

  currentIndex = 0;

  reviewsData: any[] = [];
  averageRating: number = 0;
  totalRatings: number = 0;
  ratingDistribution: { level: number; count: number; percentage: number }[] =
    [];
  showAllReviews: boolean = false;

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

  getRatingData(productId: any) {
    this.userService.GetRatingReviewByProductId(productId).subscribe(
      (data: any) => {
        this.reviewsData = data;
        this.calculateAverageAndTotalRatings();
        this.calculateRatingDistribution();
      },
      (error: any) => {}
    );
  }

  calculateAverageAndTotalRatings() {
    if (this.reviewsData.length > 0) {
      this.totalRatings = this.reviewsData.length;

      const sumOfRatings = this.reviewsData.reduce(
        (total, review) => total + review.rating,
        0
      );
      this.averageRating = sumOfRatings / this.totalRatings;
    }
  }

  calculateRatingDistribution() {
    const ratingCounts = [0, 0, 0, 0, 0];

    this.reviewsData.forEach((review) => {
      if (review.rating >= 1 && review.rating <= 5) {
        ratingCounts[review.rating - 1]++;
      }
    });

    this.ratingDistribution = ratingCounts.map((count, index) => {
      const percentage = (count / this.totalRatings) * 100;
      return { level: 5 - index, count, percentage };
    });

    this.ratingDistribution.reverse();
  }

  toggleReviews() {
    this.showAllReviews = !this.showAllReviews;
  }

  parseAverageRating(): number {
    return parseFloat(this.averageRating.toFixed(1));
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  get currentImage() {
    return this.productDetails?.productImageList[this.currentIndex];
  }

  showNextImage() {
    if (this.currentIndex < this.productDetails.productImageList.length - 1) {
      this.currentIndex++;
    }
  }

  showPrevImage() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
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
      if (res && res.description) {
        res.description = res.description.replace(/\n/g, "<br/>");
      }
      this.productDetails = res;
      this.getRatingData(this.productDetails.id);
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
      userId: Number(localStorage.getItem("id")),
      modifiedBy: Number(localStorage.getItem("id")),
      // createdBy: localStorage.getItem("id"),
      createdOn: new Date().toISOString(),
      modifiedOn: new Date().toISOString(),
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
