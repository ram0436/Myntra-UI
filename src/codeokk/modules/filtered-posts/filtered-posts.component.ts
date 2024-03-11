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

  menuName: string = "";
  menuId: Number = 0;
  subMenuName: string = "";
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private masterService: MasterService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.menuName = params["menu"];
      if (params["categoryId"] != undefined)
        this.menuId = Number(params["categoryId"]);
      if (params["name"] != undefined) this.subMenuName = params["name"];
      this.getProducts();
    });
  }

  getProducts() {
    this.productService.getAllProducts().subscribe((res) => {
      this.products = res.filter((product) => {
        if (this.menuId !== 0 && product.category[0].id !== this.menuId) {
          return false;
        }

        if (
          this.subMenuName !== "" &&
          product.subCategory[0].name !== this.subMenuName
        ) {
          return false;
        }

        if (
          this.menuName !== "" &&
          product.parentCategory[0].name !== this.menuName
        ) {
          return false;
        }

        return true;
      });
    });
  }
}
