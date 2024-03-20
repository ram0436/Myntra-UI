import { Component } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MasterService } from "src/codeokk/modules/service/master.service";

@Component({
  selector: "app-admin-dashboard",
  templateUrl: "./admin-dashboard.component.html",
  styleUrls: ["./admin-dashboard.component.css"],
})
export class AdminDashboardComponent {
  showCategories = true;
  showBrands = false;
  showColors = false;

  parentCategory: string = "";
  category: string = "";
  parentCategoryId: number = 0;
  subcategory: string = "";
  categoryId: number = 0;

  brandName: string = "";
  brandCategoryId: number = 0;
  colorName: string = "";
  colorCode: string = "";

  selectedSection: string = "categories";

  constructor(
    private masterService: MasterService,
    private snackBar: MatSnackBar
  ) {}

  addParentCategory() {
    const payload = {
      createdBy: 1,
      createdOn: new Date().toISOString(),
      modifiedBy: 1,
      modifiedOn: new Date().toISOString(),
      name: this.parentCategory,
    };

    this.masterService.addParentCategory(payload).subscribe((response) => {
      this.showNotification("Added Parent Category Successfully");
    });
  }

  addCategory() {
    const payload = {
      createdBy: 1,
      createdOn: new Date().toISOString(),
      modifiedBy: 1,
      modifiedOn: new Date().toISOString(),
      name: this.category,
      parentCategoryId: this.parentCategoryId,
    };

    this.masterService.addCategory(payload).subscribe((response) => {
      this.showNotification("Added Category Successfully");
    });
  }

  addSubCategory() {
    const payload = {
      id: 0,
      name: this.subcategory,
      categoryId: this.categoryId,
    };

    this.masterService.addSubCategory(payload).subscribe((response) => {
      this.showNotification("Added Sub Category Successfully");
    });
  }

  addBrand() {
    const payload = {
      id: 0,
      name: this.brandName,
      subCategoryId: this.brandCategoryId,
    };
    this.masterService.addBrand(payload).subscribe((response) => {
      this.showNotification("Added Brand Successfully");
    });
  }

  addColor() {
    const payload = {
      id: 0,
      name: this.colorName,
      code: this.colorCode,
    };
    this.masterService.addColor(payload).subscribe((response) => {
      this.showNotification("Added Color Successfully");
    });
  }

  showNotification(message: string): void {
    this.snackBar.open(message, "Close", {
      duration: 5000,
      horizontalPosition: "end",
      verticalPosition: "top",
    });
  }

  toggleSection(section: string) {
    this.showCategories = false;
    this.showBrands = false;
    this.showColors = false;

    switch (section) {
      case "categories":
        this.showCategories = true;
        break;
      case "brands":
        this.showBrands = true;
        break;
      case "colors":
        this.showColors = true;
        break;
      default:
        break;
    }

    this.selectedSection = section;
  }
}
