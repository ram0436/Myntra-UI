import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ProductService } from "src/codeokk/shared/service/product.service";
import { MasterService } from "../service/master.service";

@Component({
  selector: "app-filtered-posts",
  templateUrl: "./filtered-posts.component.html",
  styleUrls: ["./filtered-posts.component.css"],
})
export class FilteredPostsComponent {
  products: any[] = [];
  originalProducts: any[] = [];

  brands: any[] = [];

  menuName: string = "";

  parentId: Number = 0;
  subCategoryId: Number = 0;
  categoryId: Number = 0;
  subMenuName: string = "";
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
      this.getProducts();
    });
    this.masterService.getData().subscribe((filters: any) => {
      this.filterProducts(filters);
    });
  }

  matchProductIds(product: any): boolean {
    const categoryId = Number(this.categoryId);
    const subCategoryId = Number(this.subCategoryId);
    const parentId = Number(this.parentId);

    return (
      (categoryId === 0 || product.category[0].id === categoryId) &&
      (subCategoryId === 0 || product.subCategory[0].id === subCategoryId) &&
      (parentId === 0 || product.parentCategory[0].id === parentId)
    );
  }

  filterProducts(filters: any) {
    let filteredProducts = [...this.originalProducts];

    filteredProducts = filteredProducts.filter((product) =>
      this.matchProductIds(product)
    );

    // Filter by category
    if (filters.categories.length > 0) {
      filteredProducts = filteredProducts.filter((product) =>
        filters.categories.includes(product.subCategory[0].id)
      );
    }

    // Filter by brand
    if (filters.brands.length > 0) {
      filteredProducts = filteredProducts.filter((product) =>
        product.brand.some((b: any) => filters.brands.includes(b.id))
      );
    }

    // Filter by color
    if (filters.colors.length > 0) {
      filteredProducts = filteredProducts.filter((product) =>
        product.color.some((c: any) => filters.colors.includes(c.id))
      );
    }

    // Filter by discount
    if (filters.discount.length > 0) {
      filteredProducts = filteredProducts.filter((product) =>
        product.discount.some((d: any) => filters.discount.includes(d.id))
      );
    }

    this.products = filteredProducts;

    // this.productService.getAllProducts().subscribe((res) => {
    //   this.products = res.filter((product) => {
    //     const categoryId = Number(this.categoryId);
    //     const subCategoryId = Number(this.subCategoryId);
    //     const parentId = Number(this.parentId);
    //     const brandIds = filters.brands;

    //     if (
    //       (filters.categories.length === 0 ||
    //         filters.categories.includes(product.subCategory[0].id)) &&
    //       (filters.colors.length === 0 ||
    //         product.color.some((color: any) =>
    //           filters.colors.includes(color.id)
    //         )) &&
    //       (filters.brands.length === 0 ||
    //         product.brand.some((brand: any) => brandIds.includes(brand.id))) &&
    //       (filters.discount === 0 ||
    //         product.discount.some(
    //           (discount: any) => discount.percent >= filters.discount
    //         )) &&
    //       (categoryId === 0 || product.category[0].id === categoryId) &&
    //       (subCategoryId === 0 ||
    //         product.subCategory[0].id === subCategoryId) &&
    //       (parentId === 0 || product.parentCategory[0].id === parentId)
    //     ) {
    //       return true;
    //     } else {
    //       return false;
    //     }
    //   });
    // });
  }

  getProducts() {
    this.productService.getAllProducts().subscribe((res) => {
      this.originalProducts = [...res];
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

      this.masterService.setBrandsData({
        brands: uniqueBrands,
      });
    });
  }
}
