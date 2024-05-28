import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HeaderComponent } from "./component/header/header.component";
import { FooterComponent } from "./component/footer/footer.component";
import { Router, RouterModule } from "@angular/router";
import { PostCardsComponent } from "./component/post-cards/post-cards.component";
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [HeaderComponent, FooterComponent, PostCardsComponent],
  imports: [CommonModule, RouterModule, FormsModule],
  exports: [HeaderComponent, FooterComponent, PostCardsComponent],
})
export class SharedModule {}
