import { Component, OnInit } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { MasterService } from "src/codeokk/modules/service/master.service";
import { LoginComponent } from "src/codeokk/modules/user/component/login/login.component";
import { UserService } from "src/codeokk/modules/user/service/user.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit {
  parentCategories: any[] = [];
  categoryMap: { [key: number]: any[] } = {};
  subCategoryMap: { [key: number]: any[] } = {};
  categoryBlocks: { [key: number]: any[][] } = {};
  columns: number = 1;
  cartItemCount: number = 0;
  dialogRef: MatDialogRef<any> | null = null;
  isUserLogedIn: boolean = false;
  userData: any = [];
  userName: string = "";
  userMobile: string = "";

  constructor(
    private masterService: MasterService,
    private router: Router,
    private userService: UserService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    if (localStorage.getItem("authToken") != null) {
      this.isUserLogedIn = true;
      this.getUserData();
    }
    this.getAllParentCategories();

    if (localStorage.getItem("id") != null) {
      this.userService
        .getCartItemByUserId(Number(localStorage.getItem("id")))
        .subscribe(
          (response: any) => {
            this.cartItemCount = response.length;
          },
          (error: any) => {
            // console.error("API Error:", error);
          }
        );
      if (localStorage.getItem("authToken") != null) this.isUserLogedIn = true;
    } else {
      this.cartItemCount = 0;
    }
  }

  getUserData() {
    const userData = this.userService.getUserData();
    this.userName = userData.name;
    this.userMobile = userData.mobile;
  }

  navigateToWishlist() {
    if (this.isUserLogedIn) {
      this.router.navigate(["user/wishlist"]);
    } else {
      this.openLoginModal();
    }
  }

  navigateToDashboard() {
    if (this.isUserLogedIn) {
      this.router.navigate(["/admin/dashboard"]);
    } else {
      this.openLoginModal();
    }
  }

  navigateToCart() {
    if (this.isUserLogedIn) {
      this.router.navigate(["user/cart"]);
    } else {
      this.openLoginModal();
    }
  }

  logout() {
    if (localStorage.getItem("authToken") != null) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("role");
      localStorage.removeItem("id");
      localStorage.removeItem("userId");
      localStorage.removeItem("userData");
      this.isUserLogedIn = false;
      this.router.navigate(["/"]);
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

  getAllParentCategories() {
    this.masterService.getAllParentCategories().subscribe((data: any) => {
      this.parentCategories = data;
      this.parentCategories.forEach((parentCategory) => {
        this.getCategoryByParentCategoryId(parentCategory.id);
      });
    });
  }

  getCategoryByParentCategoryId(parentCategoryId: number) {
    this.masterService
      .getCategoryByParentCategoryId(parentCategoryId)
      .subscribe((data: any) => {
        this.categoryMap[parentCategoryId] = data;
        data.forEach((category: any) => {
          this.getSubCategoryByCategoryId(category.id);
        });
      });
  }

  getSubCategoryByCategoryId(categoryId: number) {
    this.masterService
      .getSubCategoryByCategoryId(categoryId)
      .subscribe((data: any) => {
        this.subCategoryMap[categoryId] = data;
      });
  }

  // calculateColumns(parentCategoryId: number): string {
  //   const categories = this.categoryMap[parentCategoryId] || [];
  //   let totalSubcategories = categories.reduce(
  //     (acc, category) => acc + (this.subCategoryMap[category.id]?.length || 0),
  //     0
  //   );
  //   const columns = Math.ceil(totalSubcategories / 15);
  //   return `columns-${columns}`;
  // }

  calculateColumns(parentCategoryId: number): any[][] {
    const categories = this.categoryMap[parentCategoryId] || [];
    const columns: any[][] = [[]];
    let currentColumnIndex = 0;
    let currentCount = 0;
    let totalCount = 0;

    // Iterate through all categories and sum up total subcategory count
    categories.forEach((category) => {
      const subcategories = this.subCategoryMap[category.id] || [];
      totalCount += subcategories.length + 1; // Including category name
    });

    // Determine number of columns based on total count of subcategories
    const numColumns = Math.ceil(totalCount / 18);
    // console.log(`${parentCategoryId}, ${totalCount}, ${numColumns}`);

    // Reset counts for iteration through categories again
    currentCount = 0;
    totalCount = 0;

    // Iterate through categories again to populate columns
    categories.forEach((category) => {
      const subcategories = this.subCategoryMap[category.id] || [];
      const categoryCount = subcategories.length + 1; // Including category name

      // Check if adding the current category exceeds the limit for current column
      if (currentCount + categoryCount <= 18) {
        columns[currentColumnIndex].push({ category, subcategories });
        currentCount += categoryCount;
      } else {
        // Move to next column if limit exceeded
        currentColumnIndex++;
        columns.push([{ category, subcategories }]);
        currentCount = categoryCount;
      }
      totalCount += categoryCount;
    });

    return columns;
  }

  // calculateColumns(parentCategoryId: number): any[][] {
  //   const categories = this.categoryMap[parentCategoryId] || [];
  //   const columns: any[][] = [[]];
  //   let currentColumnIndex = 0;
  //   let currentCount = 0;

  //   categories.forEach((category) => {
  //     const subcategories = this.subCategoryMap[category.id] || [];
  //     const categoryCount = subcategories.length + 1; // Including category name
  //     console.log(`${categoryCount}, ${parentCategoryId}`);
  //     if (currentCount + categoryCount <= 15) {
  //       columns[currentColumnIndex].push({ category, subcategories });
  //       currentCount += categoryCount;
  //     } else {
  //       currentColumnIndex++;
  //       columns.push([{ category, subcategories }]);
  //       currentCount = categoryCount;
  //     }
  //   });

  //   return columns;
  // }

  // calculateColumns(categoryId: number): string {
  //   // console.log(this.subCategoryMap);
  //   const categories = this.categoryMap[categoryId] || [];
  //   let totalSubcategories = 0;

  //   categories.forEach((category) => {
  //     const subcategories = this.subCategoryMap[category.id] || [];
  //     totalSubcategories += subcategories.length;
  //   });

  //   // console.log(`${totalSubcategories} for ${categoryId}`);

  //   let columns = 1;
  //   if (totalSubcategories >= 13 && totalSubcategories < 26) {
  //     columns = 2;
  //   } else if (totalSubcategories >= 26 && totalSubcategories < 39) {
  //     columns = 3;
  //   } else if (totalSubcategories >= 39 && totalSubcategories < 52) {
  //     columns = 4;
  //   }

  //   return `columns-${columns}`;
  // }
}
