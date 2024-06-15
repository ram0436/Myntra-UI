import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./modules/home/home.component";
import { FilteredPostsComponent } from "./modules/filtered-posts/filtered-posts.component";
import { ProductDetailsComponent } from "./modules/product-details/product-details.component";
import { AuthGuard } from "./modules/auth/authguard/authguard";

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "filtered-posts", component: FilteredPostsComponent },
  { path: "product-details/:id", component: ProductDetailsComponent },
  {
    path: "admin",
    loadChildren: () =>
      import("./modules/admin/admin.module").then((m) => m.AdminModule),
    canActivate: [AuthGuard],
  },
  {
    path: "user",
    loadChildren: () =>
      import("./modules/user/user.module").then((m) => m.UserModule),
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
