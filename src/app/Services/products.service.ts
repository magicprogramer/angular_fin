import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  url = "http://localhost:3000/products";
  constructor(private http : HttpClient) { }
  getProducts()
  {
    return this.http.get(this.url);
  }
  addProduct(data: any) {
    return this.http.post(this.url, data);
  }
  deleteProduct(id: string) {
    return this.http.delete(`${this.url}/${id}`);
  }
}
