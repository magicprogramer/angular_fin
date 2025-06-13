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
  type = "";
  msg = "";
  showMsg = false;
  constructor(readonly productService: ProductsService, readonly cartService: CartService, readonly route: ActivatedRoute){

  }
  failure(msg:any=null){
    this.type = "error";
    this.msg = msg || "there is something wrong!";
    this.showMsg = true;
    setTimeout(() => {
      this.showMsg = false;
    }, 3000);
  }
  success(msg:any=null){
    this.type = "success";
    this.msg = msg || "done !";
    this.showMsg = true;
    setTimeout(() => {
      this.showMsg = false;
    }, 3000);
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
    this.success("added to cart !");
  }
  doSomething()
  {
    console.log("something");
  }
}
