import { Component } from "@angular/core";
import { UserService } from "../../service/user.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-address",
  templateUrl: "./address.component.html",
  styleUrls: ["./address.component.css"],
})
export class AddressComponent {
  selectedCount: number = 0;
  totalMRP: number = 0;
  totalDiscount: number = 0;
  totalAmount: number = 0;
  showMore: boolean = false;
  state: string = "";
  city: string = "";
  nearBy: string = "";
  pincode: string = "";
  mobileNo: string = "";
  userName: string = "";
  localArea: string = "";

  postOffices: any[] = [];

  addressForm!: FormGroup;

  numericValue: number = 0;

  showAddressFields: boolean = false;

  offers: string[] = [
    "10% Instant Discount on Citi-branded Credit and Debit Cards on a minimum spend of ₹3,000. TCA",
    "10% Instant Discount on Citi-branded Credit and Debit Cards on a minimum spend of ₹3,000. TCA",
    "10% Instant Discount on Citi-branded Credit and Debit Cards on a minimum spend of ₹3,000. TCA",
  ];

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.getPriceDetails();
  }

  showNotification(message: string): void {
    this.snackBar.open(message, "Close", {
      duration: 5000,
      horizontalPosition: "end",
      verticalPosition: "top",
    });
  }

  allowOnlyNumbers(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value;
    const numericInput = inputValue.replace(/[^0-9]/g, "");
    inputElement.value = numericInput;
    this.numericValue = parseFloat(numericInput);
  }

  allowOnlyNumbersPincode(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value;
    const numericInput = inputValue.replace(/[^0-9.-]/g, "");
    inputElement.value = numericInput;
    this.numericValue = parseFloat(numericInput);
  }

  getPriceDetails() {
    const priceDetails = this.userService.getPriceDetails();
    this.selectedCount = priceDetails.selectedCount;
    this.totalMRP = priceDetails.totalMRP;
    this.totalDiscount = priceDetails.totalDiscount;
    this.totalAmount = priceDetails.totalAmount;
  }

  toggleShowMore() {
    this.showMore = !this.showMore;
  }

  getAddress(event: any) {
    let pincode = event.target.value;
    this.pincode = event.target.value;
    if (pincode.length === 6) {
      this.userService.getAddress(pincode).subscribe((data: any) => {
        if (data[0].PostOffice != null) {
          var address = data[0].PostOffice[0];
          this.state = address.State;
          this.city = address.District;
          this.postOffices = data[0].PostOffice;
          if (this.postOffices.length > 1) {
            this.nearBy = this.postOffices[0].Name;
          } else {
            this.nearBy = address.Name;
          }
          // Show city, state, and nearby fields
          this.showAddressFields = true;
        }
      });
    } else {
      // Hide city, state, and nearby fields if pincode is not entered or removed
      this.showAddressFields = false;
      this.state = "";
      this.city = "";
      this.nearBy = "";
    }
  }

  addAddress() {
    // Fetching username and mobile number from input fields

    // Checking if username, mobile number, and pincode are empty
    if (!this.userName) {
      this.showNotification("Username is required.");
      return;
    }

    if (!this.mobileNo) {
      this.showNotification("Mobile Number is required.");
      return;
    }

    if (this.mobileNo.length !== 10) {
      this.showNotification("Please enter 10 digits mobile number.");
      return;
    }

    if (!this.pincode) {
      this.showNotification("Pincode is required.");
      return;
    }

    if (!this.localArea) {
      this.showNotification("Local Area is required.");
      return;
    }

    // Constructing the address details object
    const addressDetails = {
      id: 0,
      createdBy: Number(localStorage.getItem("id")),
      userId: Number(localStorage.getItem("id")),
      modifiedBy: Number(localStorage.getItem("id")),
      createdOn: new Date().toISOString(),
      modifiedOn: new Date().toISOString(),
      userName: this.userName,
      mobileNo: this.mobileNo,
      pincode: this.pincode,
      localArea: this.localArea,
      town: this.nearBy,
      city: this.city,
      state: this.state,
    };
    this.userService.saveAddress(addressDetails).subscribe((response) => {
      this.showNotification("Address saved successfully");
    });
  }
}