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
}
