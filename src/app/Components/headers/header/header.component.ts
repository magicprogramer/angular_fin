import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ProductSearchComponent } from '../../products/product-search/product-search.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [ProductSearchComponent, RouterLink],
  templateUrl: './header.component.html',
  styles: ``
})
export class HeaderComponent {
constructor(private cookieService : CookieService){}

}
