import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './Components/headers/header/header.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AddProductComponent } from './Components/products/add-product/add-product.component';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, ReactiveFormsModule],
  providers : [CookieService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'sparseCommerce';
}
