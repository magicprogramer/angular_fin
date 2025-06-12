import { Component } from '@angular/core';
import { UsersService } from '../../Services/users.service';
import { ProductsService } from '../../Services/products.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-product-details',
  imports: [],
  providers: [ProductsService],
  templateUrl: './product-details.component.html',
  styles: ``
})
export class ProductDetailsComponent {
  constructor(public productService: ProductsService)
  {

  }
  ngOnInit()
  {
    console.log("hi");
    this.productService.getProducts().subscribe({

      next: (data)=>{
        console.log(data);
      },
      error: (err)=>{
        console.log(err);
      }

    }
    )
  //  console.log(this.productService.getProducts().subscribe());
  }
}
