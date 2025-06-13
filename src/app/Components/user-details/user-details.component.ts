import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from '../../Services/users.service';
import { ImageUrlPipe } from '../../pipes/image-url.pipe';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { OrderService } from '../../Services/order.service';

@Component({
  selector: 'app-user-details',
  imports: [ReactiveFormsModule, CommonModule, ImageUrlPipe, ToastModule],
  templateUrl: './user-details.component.html',
  styleUrls: []
})
export class UserDetailsComponent implements OnInit {
  form!: FormGroup;
  selectedImage: File | null = null;
  active = "profile";
  user: any;
  msg:any = "";
  orders:any;
  showMsg = false;
  type: string = "success";
  failure(){
    this.type = "error";
    this.msg = "there is something wrong!";
    this.showMsg = true;
    setTimeout(() => {
      this.showMsg = false;
    }, 3000);
  }
  success(){
    this.type = "success";
    this.msg = "done !";
    this.showMsg = true;
    setTimeout(() => {
      this.showMsg = false;
    }, 3000);
  }
  constructor(private fb: FormBuilder, private userService: UsersService, private orderService: OrderService) {}

  ngOnInit() {
    this.user = this.userService.getCurrentUser();
    this.orderService.getOrdersByUser(this.user._id).subscribe({
      next: (res: any) => {
        console.log(res);
        this.orders = res;
      },
      error: (err: any) => {
        console.error('Failed to fetch orders:', err);
      }
    });
    this.form = this.fb.group({
      email: [this.user.email, [Validators.required, Validators.email]],
      name: [this.user.name, Validators.required],
      gender: [this.user.gender, Validators.required],
      image: [null]
    });
  }

  onFileChange(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];
    if (file) {
      this.selectedImage = file;
      this.form.patchValue({ image: file });
    }
  }

  submitForm() {
    if (this.form.valid) {
      const formData = new FormData();
      formData.append('email', this.form.get('email')?.value);
      formData.append('name', this.form.get('name')?.value);
      formData.append('gender', this.form.get('gender')?.value);
      if (this.selectedImage) {
        formData.append('image', this.selectedImage);
      }

      this.userService.updateUser(formData).subscribe({
        next: (response) => {
          console.log('Update successful:', response);
          this.userService.setProfile(response);
          this.user = this.userService.getCurrentUser();
          this.success();

        },
        error: (err) => {
          console.error('Update failed:', err.message);
          this.failure();
        }
      });
    } else {
      console.log('Form is invalid');
      this.failure();
    }
  }
  
  cancel(order:any)
  {
    this.orderService.cancelOrder(order._id).subscribe({
      next: (res:any) => {
        this.orderService.getOrdersByUser(this.user._id).subscribe({
          next: (orders:any) => {
            this.orders = orders;
          }
        });
      }
    })
  }
}
