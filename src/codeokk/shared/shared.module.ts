import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HeaderComponent } from "./component/header/header.component";
import { FooterComponent } from "./component/footer/footer.component";
import { Router, RouterModule } from "@angular/router";
import { PostCardsComponent } from "./component/post-cards/post-cards.component";
import { FormsModule } from "@angular/forms";
import { SharedOrdersComponent } from "./component/shared-orders/shared-orders.component";

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    PostCardsComponent,
    SharedOrdersComponent,
  ],
  imports: [CommonModule, RouterModule, FormsModule],
  exports: [
    HeaderComponent,
    FooterComponent,
    PostCardsComponent,
    SharedOrdersComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {}
