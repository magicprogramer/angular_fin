import { Component } from '@angular/core';
import { ProductsService } from '../../Services/products.service';
import { CommonModule } from '@angular/common';
import { CartService } from '../../Services/cart-service.service';
import { NgModule } from '@angular/core';
@Component({
  selector: 'app-products',
  imports: [CommonModule],
  providers: [ProductsService],
  templateUrl: './products.component.html'
})
export class ProductsComponent {
  products:any;
  constructor(readonly productService: ProductsService, readonly cartService: CartService){

  }
  ngOnInit()
  {
    this.productService.getProducts().subscribe({
      next: (data:any)=>{
        this.products = data;
      },
      error:(err)=>{
        err
      }
    })
  }
  addToCart(item:any=null){
    this.cartService.addToCart(item);
  }
  doSomething()
  {
    console.log("something");
  }
}
