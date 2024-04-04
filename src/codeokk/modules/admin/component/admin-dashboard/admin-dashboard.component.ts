import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { Component, ElementRef, Inject, ViewChild } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { FormControl } from "@angular/forms";
import { MatChipInputEvent } from "@angular/material/chips";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MasterService } from "src/codeokk/modules/service/master.service";
import { ProductService } from "src/codeokk/shared/service/product.service";

@Component({
  selector: "app-admin-dashboard",
  templateUrl: "./admin-dashboard.component.html",
  styleUrls: ["./admin-dashboard.component.css"],
})
export class AdminDashboardComponent {
  cardsCount: any[] = new Array(20);
  showCategories = true;
  showBrands = false;
  showColors = false;
  showProduct = false;

  parentCategories: any[] = [];
  categories: any[] = [];
  subCategories: any[] = [];

  products: any[] = [];
  colors: any[] = [];
  sizes: any[] = [];
  brands: any[] = [];

  parentCategory: string = "";
  category: string = "";
  parentCategoryId: number = 0;
  subParentCategoryId: number = 0;
  subcategory: string = "";
  categoryId: number = 0;

  brandSubCategories: any[] = [];

  brandName: string = "";
  brandCategoryId: number = 0;
  colorName: string = "";
  colorCode: string = "";

  selectedSection: string = "categories";

  numericValue: number = 0;
  isInputFocused: boolean = false;
  firstImageUploaded: boolean = false;
  imageProgress: boolean = false;

  productName: string = "";
  productDescription: string = "";
  productSubCategoryId: number = 0;
  productCategoryId: number = 0;
  productParentCategoryId: number = 0;
  productBrandId: number = 0;
  productColorId: number = 0;
  productCode: string = "";
  productSizeId: number = 0;
  productPrice: number = 0;
  tags: any = [];
  tagCtrl = new FormControl("");
  separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(
    private masterService: MasterService,
    private snackBar: MatSnackBar,
    private productService: ProductService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit() {
    this.getAllParentCategories();
    this.getAllColors();
    this.getAllProductSizes();
    for (var i = 0; i < this.cardsCount.length; i++) {
      this.cardsCount[i] = "";
    }
  }

  postProduct() {
    const payload = {
      createdBy: 1,
      createdOn: new Date().toISOString(),
      modifiedBy: 1,
      modifiedOn: new Date().toISOString(),
      name: this.productName,
      description: this.productDescription,
      productCode: this.productCode,
      parentCategoryId: this.productParentCategoryId,
      categoryId: this.productCategoryId,
      subCategoryId: this.productSubCategoryId,
      brandId: this.productBrandId,
      price: this.productPrice,
      colorId: this.productColorId,
      productSizeId: this.productSizeId,
      discountId: 0,
      tagList: this.tags,
    };

    var finalPayload = this.addAttachmentsPayload(payload);

    if (this.validatePostForm(finalPayload))
      this.productService
        .saveProjectCodePost(finalPayload)
        .subscribe((data) => {
          this.showNotification("Post added succesfully");
        });
  }

  validatePostForm(payload: any): boolean {
    let flag = false;
    if (payload.name == "") {
      this.showNotification("Name is required");
    } else if (payload.name.length < 5 || payload.name.length > 50) {
      this.showNotification("Title should be between 5 and 50 characters");
    } else if (payload.description == "") {
      this.showNotification("Description is required");
    } else if (
      payload.description.length < 10 ||
      payload.description.length > 500
    ) {
      this.showNotification(
        "Description should be between 10 and 500 characters"
      );
    } else if (!payload.productCode) {
      this.showNotification("Product code is required");
    } else if (!payload.parentCategoryId) {
      this.showNotification("Parent category ID is required");
    } else if (!payload.categoryId) {
      this.showNotification("Category ID is required");
    } else if (!payload.subCategoryId) {
      this.showNotification("Subcategory ID is required");
    } else if (!payload.price) {
      this.showNotification("Price is required");
    } else if (!payload.colorId) {
      this.showNotification("Color ID is required");
    } else if (!payload.productSizeId) {
      this.showNotification("Product size ID is required");
    } else if (payload.tagList.length <= 0) {
      this.showNotification("At least 1 tag is required");
    } else if (payload.productImageList.length < 2) {
      this.showNotification("At least 2 images are required");
    } else {
      flag = true;
    }
    return flag;
  }

  getAllColors() {
    this.masterService.getAllColors().subscribe((res: any) => {
      this.colors = res;
    });
  }

  // getAllBrands() {
  //   this.masterService.getAllBrands().subscribe((res: any) => {
  //     this.brands = res;
  //   });
  // }

  getAllProductSizes() {
    this.masterService.getAllProductSize().subscribe((res: any) => {
      this.sizes = res;
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

  onSubParentCategoryChange(parentCategoryId: number) {
    this.masterService
      .getCategoryByParentCategoryId(parentCategoryId)
      .subscribe((data: any) => {
        this.categories = data;
      });
  }

  onParentCategoryChange(parentCategoryId: number) {
    this.masterService
      .getCategoryByParentCategoryId(parentCategoryId)
      .subscribe((data: any) => {
        this.categories = data;
      });
  }

  onCategoryChange(CategoryId: number) {
    this.masterService
      .getSubCategoryByCategoryId(CategoryId)
      .subscribe((data: any) => {
        this.subCategories = data;
      });
  }

  onSubCategoryChange(subCategoryId: number) {
    this.masterService
      .getBrandBySubCategoryId(subCategoryId)
      .subscribe((data: any) => {
        this.brands = data;
      });
  }

  allowOnlyNumbers(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value;
    const numericInput = inputValue.replace(/[^0-9.-]/g, "");
    inputElement.value = numericInput;
    this.numericValue = parseFloat(numericInput);
  }

  onInputFocus() {
    this.isInputFocused = true;
  }

  onInputBlur() {
    if (!this.productPrice) {
      this.isInputFocused = false;
    }
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || "").trim();
    if (value) {
      this.tags.push({ id: 0, name: value, projectCodeId: 0 });
    }
    event.chipInput!.clear();
    this.tagCtrl.setValue(null);
  }

  remove(fruit: string): void {
    const index = this.tags.indexOf(fruit);
    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  selectFile() {
    if (this.document) {
      const uploadElement = this.document.getElementById("fileUpload");
      if (uploadElement) {
        uploadElement.click();
      }
    }
  }

  selectImage(event: any): void {
    var files = event.target.files;
    const formData = new FormData();
    this.imageProgress = true;
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }
    this.productService
      .uploadProjectCodeImages(formData)
      .subscribe((data: any) => {
        this.imageProgress = false;
        let imagesLength = data.length;
        let dataIndex = 0;

        for (
          let j = 0;
          j < this.cardsCount.length && dataIndex < data.length;
          j++
        ) {
          if (this.cardsCount[j] === "") {
            this.cardsCount[j] = data[dataIndex];
            dataIndex++;
            imagesLength--;
          }

          if (!this.firstImageUploaded) {
            this.firstImageUploaded = true;
          }
        }
      });
  }
  deleteBackgroundImage(index: any): void {
    for (let i = index; i < this.cardsCount.length - 1; i++) {
      this.cardsCount[i] = this.cardsCount[i + 1];
    }
    this.cardsCount[this.cardsCount.length - 1] = "";
  }

  addAttachmentsPayload(commonPayload: any): any {
    var imageList: { id: number; imageURL: any }[] = [];
    this.cardsCount.forEach((imageURL) => {
      if (imageURL != "") imageList.push({ id: 0, imageURL: imageURL });
    });

    var payload = Object.assign({}, commonPayload, {
      productImageList: imageList,
    });
    return payload;
  }

  getCategoryByParentCategoryId(parentCategoryId: number) {
    this.masterService
      .getCategoryByParentCategoryId(parentCategoryId)
      .subscribe((data: any) => {
        data.forEach((category: any) => {
          this.getSubCategoryByCategoryId(category.id);
        });
      });
  }

  getSubCategoryByCategoryId(categoryId: number) {
    this.masterService
      .getSubCategoryByCategoryId(categoryId)
      .subscribe((data: any) => {
        this.brandSubCategories = this.brandSubCategories.concat(data);

        this.brandSubCategories = Array.from(
          new Set(
            this.brandSubCategories.map((subCategory) => subCategory.name)
          )
        ).map((name) =>
          this.brandSubCategories.find(
            (subCategory) => subCategory.name === name
          )
        );
      });
  }

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
    this.showProduct = false;

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
      case "product":
        this.showProduct = true;
        break;
      default:
        break;
    }

    this.selectedSection = section;
  }
}
