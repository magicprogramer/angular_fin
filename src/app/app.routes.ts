import { Routes } from '@angular/router';
import { UsersComponent } from './Components/users/users.component';
import { UserDetailsComponent } from './Components/user-details/user-details.component';
import { ProductsComponent } from './Components/products/products.component';
import { ProductDetailsComponent } from './Components/product-details/product-details.component';
import { AddProductComponent } from './Components/products/add-product/add-product.component';
import { CartComponent } from './Components/cart/cart.component';
import { RegisterationComponent } from './Components/users/registeration/registeration.component';
import { LoginComponent } from './Components/users/login/login.component';
import { AdminComponent } from './Components/admin/admin.component';
import { AboutComponent } from './Components/about/about.component';
export const routes: Routes = [
    {
        path: "admin", component: AdminComponent
    },
    {
        path:"about", component: AboutComponent
    },
    {
        path: "register", component: RegisterationComponent
    },
    {
        path: "login", component: LoginComponent
    },
    {
        path:'users', component:UsersComponent
    },
    {
        path:"profile", component:UserDetailsComponent
    }
    ,
    {
        path: "cart", component: CartComponent
    },
    {
        path : 'users/:id', component:UserDetailsComponent
    },
    {
        path: '', component:ProductsComponent
    },
    {
        path : "products", component:ProductsComponent
    },
    {
        path: "add-product", component : AddProductComponent
    },
    {
        path: 'products/:id', component: ProductDetailsComponent
    }
];
