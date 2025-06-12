import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ProductsService } from '../../Services/products.service';

@Component({
  selector: 'app-admin',
  imports: [CommonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  public products:any;
  constructor(private productService : ProductsService) {
    this.productService.getProducts().subscribe({
      next:(res)=>{
        this.products = res;
      }
    })
  }
  delete(item:any)
  {
    this.productService.deleteProduct(item._id).subscribe({});
    this.productService.getProducts().subscribe
    ({
      next:(res)=>{
        this.products = res;
      }
    })
  }

  active = 'products';
}
