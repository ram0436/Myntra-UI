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
  flatCategoryMap: { [key: number]: any[] } = {};
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
        this.flattenCategoryStructure();
      });
  }

  getSubCategoryByCategoryId(categoryId: number) {
    this.masterService
      .getSubCategoryByCategoryId(categoryId)
      .subscribe((data: any) => {
        this.subCategoryMap[categoryId] = data;
        this.flattenCategoryStructure();
      });
  }

  flattenCategoryStructure() {
    this.parentCategories.forEach((parentCategory) => {
      const categories = this.categoryMap[parentCategory.id] || [];
      const flatCategoryList: any[] = [];

      categories.forEach((category) => {
        flatCategoryList.push({
          id: category.id,
          name: category.name,
          parentId: parentCategory.id,
          category: true,
        });
        const subcategories = this.subCategoryMap[category.id] || [];
        subcategories.forEach((subCategory) => {
          flatCategoryList.push({
            id: subCategory.id,
            name: subCategory.name,
            categoryId: category.id,
            subCategoryId: subCategory.id,
          });
        });
      });

      this.flatCategoryMap[parentCategory.id] = flatCategoryList;
    });
  }

  calculateColumns(parentCategoryId: number): any[][] {
    const flatCategoryList = this.flatCategoryMap[parentCategoryId] || [];
    const columns: any[][] = [];
    const maxItemsPerColumn = 16;

    for (let i = 0; i < flatCategoryList.length; i += maxItemsPerColumn) {
      columns.push(flatCategoryList.slice(i, i + maxItemsPerColumn));
    }

    return columns;
  }
}
