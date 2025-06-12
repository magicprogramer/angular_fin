import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ProductSearchComponent } from '../../products/product-search/product-search.component';

@Component({
  selector: 'app-header',
  imports: [ProductSearchComponent],
  templateUrl: './header.component.html',
  styles: ``
})
export class HeaderComponent {
constructor(private cookieService : CookieService){}

}
