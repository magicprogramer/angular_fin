import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  URL = "https://localhost:3000/";
  constructor(private http : HttpClient) { }

  getProfile(id:number){
    
  }
}
