import { Component } from '@angular/core';
import { ProductsService } from '../../Services/products.service';
import { CommonModule } from '@angular/common';
import { CartService } from '../../Services/cart-service.service';
import { NgModule } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ImageUrlPipe } from '../../pipes/image-url.pipe';
@Component({
  selector: 'app-products',
  imports: [CommonModule, ImageUrlPipe, RouterLink],
  providers: [ProductsService],
  templateUrl: './products.component.html'
})
export class ProductsComponent {
  products:any;
  word : string = "";
  constructor(readonly productService: ProductsService, readonly cartService: CartService, readonly route: ActivatedRoute){

  }
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.word = params['search'] || '';
  
      this.productService.getProducts().subscribe({
        next: (data: any) => {
          if (this.word !== '') {
            this.products = data.filter((item: any) =>
              item.title.toLowerCase().includes(this.word.toLowerCase())
            );
          } else {
            this.products = data;
          }
        },
        error: (err) => {
          console.error(err);
        }
      });
    });
  }
  
  addToCart(item:any=null){
    this.cartService.addToCart(item);
  }
  doSomething()
  {
    console.log("something");
  }
}
