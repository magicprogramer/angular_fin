import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ProductsService } from '../../Services/products.service';
import { UsersService } from '../../Services/users.service';
import { OrderService } from '../../Services/order.service';
@Component({
  selector: 'app-admin',
  imports: [CommonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  public products:any;
  public users:any;
  public orders:any;
  constructor(private productService : ProductsService, private userSerivce: UsersService, private orderService : OrderService) {
    
  }
  ngOnInit()
  {
    this.productService.getProducts().subscribe({
      next:(res)=>{
        this.products = res;
      }
    })
    
    this.userSerivce.getAll().subscribe({
      next:(res:any)=>{
        this.users = res;
        console.log(this.users);
      },
      error:(err:any)=>
      {
        console.log(err);
      }
    })
    this.orderService.getOrders(
    ).subscribe({
      next:(res:any)=>{
        this.orders = res;
        console.log(this.orders);
      },
      error:(err:any)=>{
        console.log(err);
      }
    }
    )
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
  deleteUser(user:any)
  {
    this.userSerivce.deleteUser(user._id).subscribe({
      next: (res:any) => {
        console.log("User deleted successfully", res);
        this.userSerivce.getAll().subscribe({
          next: (users:any) => {
            this.users = users;
          }
        });
      },
      error: (err:any) => {
        console.error("Error deleting user", err);
      }
    });
  }
  accept(order:any)
  {
    this.orderService.accept(order._id).subscribe({
      next: (res:any) => {
        console.log("Order accepted successfully", res);
        this.orderService.getOrders().subscribe({
          next: (orders:any) => {
            this.orders = orders;
          }
        });
        
      },
      error: (err:any) => {
        console.error("Error accepting order", err);
      }
    });
  }
  cancel(order:any)
  {
    this.orderService.cancelOrder(order._id).subscribe({
      next: (res:any) => {
        this.orderService.getOrders().subscribe({
          next: (orders:any) => {
            this.orders = orders;
          }
        });
      }
    })
  }
  active = 'products';
}
