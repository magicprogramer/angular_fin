import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styles: ``
})
export class HeaderComponent {
constructor(private cookieService : CookieService){}

}
