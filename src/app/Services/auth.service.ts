import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url="http://localhost:3000";
  constructor(private http: HttpClient, private cookieService : CookieService) { }
  Register(user:any){
    return this.http.post(`${this.url}/register`, user);
  }
  Login(user:any)
  {
    return this.http.post(`${this.url}/login`, user);
  }
  Logout()
  {
    this.cookieService.delete('token');
    this.cookieService.delete('user');

  }
}
