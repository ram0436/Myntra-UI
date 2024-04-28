import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { MasterService } from "src/codeokk/modules/service/master.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit {
  parentCategories: any[] = [];
  categoryMap: { [key: number]: any[] } = {};
  subCategoryMap: { [key: number]: any[] } = {};
  columns: number = 1;

  constructor(private masterService: MasterService, private router: Router) {}

  ngOnInit() {
    this.getAllParentCategories();
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

  calculateColumns(categoryId: number): string {
    // console.log(this.subCategoryMap);
    const categories = this.categoryMap[categoryId] || [];
    let totalSubcategories = 0;

    categories.forEach((category) => {
      const subcategories = this.subCategoryMap[category.id] || [];
      totalSubcategories += subcategories.length;
    });

    // console.log(`${totalSubcategories} for ${categoryId}`);

    let columns = 1;
    if (totalSubcategories >= 13 && totalSubcategories < 26) {
      columns = 2;
    } else if (totalSubcategories >= 26 && totalSubcategories < 39) {
      columns = 3;
    } else if (totalSubcategories >= 39 && totalSubcategories < 52) {
      columns = 4;
    }

    return `columns-${columns}`;
  }
}
