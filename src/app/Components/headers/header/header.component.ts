import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ProductSearchComponent } from '../../products/product-search/product-search.component';
import { Router, RouterLink } from '@angular/router';
import { UsersService } from '../../../Services/users.service';
import { AuthService } from '../../../Services/auth.service';
import { CommonModule } from '@angular/common';
import { NavigationEnd } from '@angular/router';
import { ImageUrlPipe } from '../../../pipes/image-url.pipe';
@Component({
  selector: 'app-header',
  imports: [ProductSearchComponent, RouterLink, CommonModule, ImageUrlPipe],
  templateUrl: './header.component.html',
  styles: ``
})
export class HeaderComponent {
user : any = null;
constructor(private userService : UsersService, private authService : AuthService, public router : Router){}

ngOnInit()
{
  this.router.events.subscribe(event => {
    if (event instanceof NavigationEnd) {
      this.user = this.userService.getCurrentUser();
      console.log(this.user);
    }
  });
}
logout(evnet:any)
{
  this.authService.Logout();
  this.user = "";
  this.router.navigate([""]);

}
}
