import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductsService } from '../../../Services/products.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  imports: [ReactiveFormsModule],
})
export class AddProductComponent {
  productForm: FormGroup;
  selectedFile: File | null = null;

  constructor(private cookieService :CookieService, private fb: FormBuilder, private ProductsService : ProductsService, private router : Router) {
    this.productForm = this.fb.group({
      title: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      details: [''],
      image: [null]
    });
  }

  onFileChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target?.files?.[0] ?? null;
    this.selectedFile = file;
    this.productForm.patchValue({ image: file });
  }

  submitForm(): void {
    if (this.productForm.invalid) return;

    const formData = new FormData();
    formData.append('title', this.productForm.get('title')?.value);
    formData.append('price', this.productForm.get('price')?.value.toString());
    formData.append('details', this.productForm.get('details')?.value);
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }
    this.ProductsService.addProduct(formData).subscribe({
      next: (response: any) => {
        console.log('Product added successfully:', response);
        this.cookieService.get("role") == "admin" ? this.router.navigate(['/admin']):
          this.router.navigate([""]);
      }
    }
    )

  }
}
