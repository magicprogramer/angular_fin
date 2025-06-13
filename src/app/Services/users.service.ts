import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  URL = "http://localhost:3000/";
  constructor(private http : HttpClient, private cookieService : CookieService) { }

  getProfile(id:number){
    
  }
  setProfile(user:any)
  {
    this.cookieService.set("user", JSON.stringify(user));
  }
  getAll()
  {
    return this.http.get(this.URL + "users", {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.cookieService.get('token')}`
      }
    });
  }
  deleteUser(id:string)
  {
    
    return this.http.delete(this.URL + `users/${id}`, {
      headers: {
        'Authorization': `Bearer ${this.cookieService.get('token')}`
      }
    });
  }
  getCurrentUser()
  {
    let u= this.cookieService.get('user') ? this.cookieService.get("user") : '';
    return JSON.parse(u);
  }
  updateUser(user:any)
  {
    console.log(user);
    return this.http.put(`${this.URL}users`, user, {
      headers: {
        'Authorization': `Bearer ${this.cookieService.get('token')}`
      }
    })
  }
}
