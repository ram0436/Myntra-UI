import { Component } from "@angular/core";
import { UserService } from "../../service/user.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";

@Component({
  selector: "app-payment",
  templateUrl: "./payment.component.html",
  styleUrls: ["./payment.component.css"],
})
export class PaymentComponent {
  selectedCount: number = 0;
  totalMRP: number = 0;
  totalDiscount: number = 0;
  totalAmount: number = 0;

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {
    this.getPriceDetails();
  }

  getPriceDetails() {
    const priceDetails = this.userService.getPriceDetails();
    this.selectedCount = priceDetails.selectedCount;
    this.totalMRP = priceDetails.totalMRP;
    this.totalDiscount = priceDetails.totalDiscount;
    this.totalAmount = priceDetails.totalAmount;
  }
}
