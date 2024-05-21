import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AccountComponent } from "./component/account/account.component";
import { CartComponent } from "./component/cart/cart.component";
import { LoginComponent } from "./component/login/login.component";
import { SignupComponent } from "./component/signup/signup.component";
import { WishlistComponent } from "./component/wishlist/wishlist.component";
import { AddressComponent } from "./component/address/address.component";

const routes: Routes = [
  { path: "account", component: AccountComponent },
  { path: "cart", component: CartComponent },
  { path: "login", component: LoginComponent },
  { path: "signup", component: SignupComponent },
  { path: "wishlist", component: WishlistComponent },
  { path: "address", component: AddressComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
