import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url="http://localhost:3000";
  constructor(private http: HttpClient) { }
  Register(user:any){
    return this.http.post(`${this.url}/register`, user);
  }
  Login(user:any)
  {
    return this.http.post(`${this.url}/login`, user);
  }
}
