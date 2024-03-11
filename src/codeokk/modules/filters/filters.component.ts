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
  colors: any[] = [];
  sizes: any[] = [];
  brands: any[] = [];

  categories: any = [];

  menuId: number = 0;

  brandsExpanded: boolean = false;
  colorsExpanded: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private masterService: MasterService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params["categoryId"] != undefined)
        this.menuId = Number(params["categoryId"]);
      this.getSubCategoryByCategoryId(this.menuId);
    });
    this.getAllColors();
    this.getAllProductSizes();
    this.getAllBrands();
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

  toggleColorsSearch() {
    this.colorsExpanded = !this.colorsExpanded;
  }
}
