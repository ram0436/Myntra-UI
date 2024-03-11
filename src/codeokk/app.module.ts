import { HashLocationStrategy, LocationStrategy } from "@angular/common";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { SharedModule } from "src/codeokk/shared/shared.module";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { FiltersComponent } from "./modules/filters/filters.component";
import { PostMenuComponent } from "./modules/post-menu/post-menu.component";
import { HomeComponent } from "./modules/home/home.component";
import { FilteredPostsComponent } from "./modules/filtered-posts/filtered-posts.component";
import { ProductDetailsComponent } from "./modules/product-details/product-details.component";
import { HttpClientModule } from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent,
    FiltersComponent,
    PostMenuComponent,
    HomeComponent,
    FilteredPostsComponent,
    ProductDetailsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
