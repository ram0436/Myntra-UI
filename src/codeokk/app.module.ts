import { HashLocationStrategy, LocationStrategy } from "@angular/common";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { SharedModule } from "src/codeokk/shared/shared.module";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HomepageComponent } from './modules/homepage/homepage.component';
import { FiltersComponent } from './modules/filters/filters.component';
import { PostMenuComponent } from './modules/post-menu/post-menu.component';

@NgModule({
  declarations: [AppComponent, HomepageComponent, FiltersComponent, PostMenuComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
