import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ProductService } from "src/codeokk/shared/service/product.service";
import { MasterService } from "../service/master.service";

@Component({
  selector: "app-filters",
  templateUrl: "./filters.component.html",
  styleUrls: ["./filters.component.css"],
})
export class FiltersComponent {
  products: any[] = [];
  colors: any[] = [];
  sizes: any[] = [];
  brands: any[] = [];

  parentId: Number = 0;
  subCategoryId: Number = 0;
  categoryId: Number = 0;
  subMenuName: string = "";

  categories: any = [];

  menuId: number = 0;

  discountRanges: number[] = [10, 20, 30];

  selectedCategories: number[] = [];
  selectedColors: number[] = [];
  selectedBrands: number[] = [];
  selectedDiscount: string = "";

  brandsExpanded: boolean = false;
  colorsExpanded: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private masterService: MasterService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.parentId = params["parent"];
      if (params["category"] != undefined)
        this.categoryId = Number(params["category"]);
      if (params["subCategory"] != undefined)
        this.subCategoryId = Number(params["subCategory"]);
      else this.subCategoryId = 0;
      this.getBrands();
      if (params["category"] != undefined)
        this.menuId = Number(params["category"]);
      this.getSubCategoryByCategoryId(this.menuId);
    });
    this.getAllColors();
    this.getAllProductSizes();
    // this.masterService.getBrandsData().subscribe((brands: any[]) => {
    //   this.brands = brands;
    //   console.log(this.brands);
    // });
  }

  getAllColors() {
    this.masterService.getAllColors().subscribe((res: any) => {
      this.colors = res;
    });
  }

  getAllBrands() {
    this.masterService.getAllBrands().subscribe((res: any) => {
      this.brands = res;
    });
  }

  getSubCategoryByCategoryId(categoryId: number) {
    this.masterService
      .getSubCategoryByCategoryId(categoryId)
      .subscribe((data: any) => {
        this.categories = data;
      });
  }

  getAllProductSizes() {
    this.masterService.getAllProductSize().subscribe((res: any) => {
      this.sizes = res;
    });
  }

  toggleBrandsSearch() {
    this.brandsExpanded = !this.brandsExpanded;
  }

  toggleBrand(brandId: number) {
    const index = this.selectedBrands.indexOf(brandId);
    if (index === -1) {
      this.selectedBrands.push(brandId);
    } else {
      this.selectedBrands.splice(index, 1);
    }
    this.applyFilters();
  }

  toggleColorsSearch() {
    this.colorsExpanded = !this.colorsExpanded;
  }

  toggleColor(colorId: number) {
    const index = this.selectedColors.indexOf(colorId);
    if (index === -1) {
      this.selectedColors.push(colorId);
    } else {
      this.selectedColors.splice(index, 1);
    }
    this.applyFilters();
  }

  selectDiscount(range: string) {
    this.selectedDiscount = range;
    this.applyFilters();
  }

  toggleCategory(categoryId: number) {
    const index = this.selectedCategories.indexOf(categoryId);
    if (index === -1) {
      this.selectedCategories.push(categoryId);
    } else {
      this.selectedCategories.splice(index, 1);
    }
    this.applyFilters();
  }

  applyFilters() {
    this.masterService.setData({
      categories: this.selectedCategories,
      colors: this.selectedColors,
      brands: this.selectedBrands,
      discount: this.selectedDiscount,
    });
  }

  getBrands() {
    this.productService.getAllProducts().subscribe((res) => {
      this.products = res.filter((product) => {
        const categoryId = Number(this.categoryId);
        const subCategoryId = Number(this.subCategoryId);
        const parentId = Number(this.parentId);

        if (categoryId !== 0 && product.category[0].id !== categoryId) {
          return false;
        }

        if (
          subCategoryId !== 0 &&
          product.subCategory[0].id !== subCategoryId
        ) {
          return false;
        }

        if (parentId !== 0 && product.parentCategory[0].id !== parentId) {
          return false;
        }

        return true;
      });

      const uniqueBrands = Array.from(
        new Set(
          this.products.map((product) => JSON.stringify(product.brand[0]))
        )
      ).map((brandStr) => JSON.parse(brandStr));

      this.brands = uniqueBrands;
    });
  }
}
