import { Component } from "@angular/core";

@Component({
  selector: "app-filters",
  templateUrl: "./filters.component.html",
  styleUrls: ["./filters.component.css"],
})
export class FiltersComponent {
  brandsExpanded: boolean = false;
  colorsExpanded: boolean = false;

  toggleBrandsSearch() {
    this.brandsExpanded = !this.brandsExpanded;
  }

  toggleColorsSearch() {
    this.colorsExpanded = !this.colorsExpanded;
  }
}
