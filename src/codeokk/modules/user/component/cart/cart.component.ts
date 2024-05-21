import { Component, EventEmitter, Output } from "@angular/core";
import { ProductService } from "src/codeokk/shared/service/product.service";
import { UserService } from "../../service/user.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";

@Component({
  selector: "app-cart",
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.css"],
})
export class CartComponent {
  @Output() itemRemovedFromCart = new EventEmitter<void>();

  offers: string[] = [
    "10% Instant Discount on Citi-branded Credit and Debit Cards on a minimum spend of ₹3,000. TCA",
    "10% Instant Discount on Citi-branded Credit and Debit Cards on a minimum spend of ₹3,000. TCA",
    "10% Instant Discount on Citi-branded Credit and Debit Cards on a minimum spend of ₹3,000. TCA",
  ];
  showMore: boolean = false;
  cartProducts: any[] = [];
  cartCount: number = 0;
  cartItems: any[] = [];
  selectedCount: number = 0;
  totalMRP: number = 0;
  totalAmount: number = 0;
  totalDiscount: number = 0;
  showModal: boolean = false;
  showQtyModal: boolean = false;
  selectedProduct: any;
  selectedSize: string = "";
  selectedQty: number = 1;
  qtyOptions: number[] = Array.from({ length: 10 }, (_, i) => i + 1);

  constructor(
    private productService: ProductService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {
    this.getUserCartData();
  }

  toggleShowMore() {
    this.showMore = !this.showMore;
  }

  toggleModal(event: Event, product?: any) {
    event.preventDefault();
    event.stopPropagation();
    this.selectedProduct = product;
    this.showModal = !this.showModal;
  }

  toggleQtyModal(event: Event, product?: any) {
    event.preventDefault();
    event.stopPropagation();
    this.selectedProduct = product;
    this.showQtyModal = !this.showQtyModal;
  }

  selectSize(size: string) {
    if (this.selectedProduct) {
      this.selectedProduct.size = size;
    }
  }

  selectQuantity(quantity: number) {
    if (this.selectedProduct) {
      this.selectedProduct.quantity = quantity;
      // this.updateTotals();
    }
  }

  doneSelection() {
    this.showModal = false;
    this.showQtyModal = false;
    this.updateTotals();
  }

  getUserCartData() {
    this.userService
      .getCartItemByUserId(Number(localStorage.getItem("id")))
      .subscribe(
        (response: any) => {
          this.cartItems = response;
          response.forEach((item: any) => {
            this.handleDashboardData(item);
          });
        },
        (error: any) => {}
      );
  }

  toggleSelection(event: Event, product: any) {
    event.preventDefault();
    event.stopPropagation();
    product.selected = !product.selected;
    this.selectedCount = this.cartProducts.filter((p) => p.selected).length;
    this.updateTotals();
  }

  toggleBulkSelection(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.selectedCount === this.cartProducts.length) {
      // Deselect all
      this.cartProducts.forEach((product) => (product.selected = false));
      this.selectedCount = 0;
    } else if (this.selectedCount === 0) {
      // Select all
      this.cartProducts.forEach((product) => (product.selected = true));
      this.selectedCount = this.cartProducts.length;
    } else {
      // Deselect one by one
      for (const product of this.cartProducts) {
        if (product.selected) {
          product.selected = false;
          this.selectedCount--;
          break;
        }
      }
    }
    this.updateTotals();
  }

  updateTotals() {
    this.selectedCount = this.cartProducts.filter(
      (product) => product.selected
    ).length;
    this.totalMRP = this.cartProducts
      .filter((product) => product.selected)
      .reduce((total, product) => total + product.price * product.quantity, 0);
    this.totalDiscount = this.cartProducts
      .filter((product) => product.selected)
      .reduce((total, product) => {
        const discountPercent = product.discount?.[0]?.percent
          .replace("% OFF", "")
          .trim();
        const discountValue =
          product.price * (parseFloat(discountPercent) / 100);
        return total + discountValue;
      }, 0);
    this.totalAmount = this.totalMRP - this.totalDiscount;
    this.userService.setPriceDetails(
      this.selectedCount,
      this.totalMRP,
      this.totalDiscount,
      this.totalAmount
    );
  }

  getProductSizes(product: any): string[] {
    return product.productSize.map((size: any) => size.size);
  }

  placeOrder() {
    this.router.navigate(["/user/address"]);
  }

  handleDashboardData(cartItem: any) {
    this.productService.getProductByProductCode(cartItem.productCode).subscribe(
      (dashboardResponse: any) => {
        if (dashboardResponse) {
          const productDetails = Array.isArray(dashboardResponse)
            ? dashboardResponse[0]
            : dashboardResponse;
          this.cartProducts.push({
            ...productDetails,
            cartId: cartItem.id,
            quantity: 1,
          });
        }
      },
      (dashboardError: any) => {
        console.error("Error fetching product details", dashboardError);
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

  removeItemFromCart(event: Event, cartId: any) {
    event.preventDefault();
    event.stopPropagation();

    this.userService
      .removeItemFromCart(cartId, Number(localStorage.getItem("id")))
      .subscribe(
        (response: any) => {
          this.cartProducts = this.cartProducts.filter(
            (product) => product.cartId !== cartId
          );
          this.updateTotals();
        },
        (error) => {}
      );
  }

  showNotification(message: string): void {
    this.snackBar.open(message, "Close", {
      duration: 2000,
      horizontalPosition: "end",
      verticalPosition: "top",
    });
  }

  getProductSize(product: any): string {
    // Assuming productSize is an array of sizes and we are using the first size
    return product.productSize && product.productSize.length > 0
      ? product.productSize[0].size
      : "";
  }
}
