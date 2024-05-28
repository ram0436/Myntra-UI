import { Component } from "@angular/core";
import { ProductService } from "./../../shared/service/product.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent {
  products: any[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.getProducts();

    this.productService.searchResults$.subscribe((results) => {
      this.products = results;
    });

    this.productService.getAllItems$.subscribe((results) => {
      this.products = results;
    });
  }

  getProducts() {
    this.productService.getAllProducts().subscribe((res) => {
      this.products = res;
    });
  }
}
