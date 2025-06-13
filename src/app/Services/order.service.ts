import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  private url = "http://localhost:3000/orders";
  accept(id: string) {
    return this.http.put(`${this.url}/${id}`, 
      { status: 'accept' }, 
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.cookieService.get('token')}`
        }
      }
    );
  }
  cancelOrder(id: string) {
    console.log(id);
    return this.http.put(`${this.url}/${id}`, 
      { status: 'cancelled' }, 
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.cookieService.get('token')}`
        }
      }
    );
  }
  getOrders()
  {
    return  this.http.get(`${this.url}`
      );
  }
  getOrdersByUser(id:string)
  {
    return this.http.get(`${this.url}/users/${id}`,
    
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.cookieService.get('token')}`
        }
      }
    );
}
}

