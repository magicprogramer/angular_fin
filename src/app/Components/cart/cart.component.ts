import { Component } from '@angular/core';
import { CartService } from '../../Services/cart-service.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  public cart:any;
  constructor(private cartService : CartService, private router : Router, private http : HttpClient, private cookieService: CookieService) {

   }
   ngOnInit()
   {
    console.log(this.cartService.getCart());
    this.cart = this.cartService.getCart();
   }
   deleteItem(item:any){
    this.cartService.deleteFromCart(item._id);
    this.cart = this.cartService.getCart();
  }
  checkout() {
    const token = this.cookieService.get("token");
    const products = this.cartService.getCart();
    console.log(token, products);
    this.http.post("http://localhost:3000/orders", { products }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }).subscribe({
      next:(response:any) => {
        console.log("Order placed successfully", response);
        this.router.navigate([""]);
      }
  })
}
}