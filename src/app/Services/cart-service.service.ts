import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(
    private cookieService: CookieService
  ) { }
  getCart(): any {
    const cart = this.cookieService.get('cart');
    if (cart) {
      return JSON.parse(cart);
    }
    return [];
  }
  addToCart(item:any): void{
    const cart = this.getCart();
    const exist = cart.find((i:any) => i._id === item._id);
    if (exist) {
      exist.quantity += item.quantity;
    } else {
      item.quantity = 1;
      cart.push(item);
    }
    this.cookieService.set('cart', JSON.stringify(cart));
  }
  deleteFromCart(id:any): void {
    const cart = this.getCart();
    const index = cart.findIndex((i:any) => i._id === id);
    if (index > -1) {
      if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
      } else {
        cart.splice(index, 1);
      }
      this.cookieService.set('cart', JSON.stringify(cart));
    }
  }
  checkout(username: string): void {
    const cart = this.getCart();
    if (cart.length > 0) {
      const order = {
        username: username,
        items: this.getCart()
      };
      // Here you would typically send the order to your backend server
      console.log('Order placed:', order);
      // Clear the cart after checkout
      this.cookieService.delete('cart');
    } else {
      console.log('Cart is empty, cannot checkout.');
    }
  }

}
