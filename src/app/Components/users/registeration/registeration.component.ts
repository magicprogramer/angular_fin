import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../Services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registeration',
  templateUrl: './registeration.component.html',
  styleUrls: ['./registeration.component.css'],
  imports: [ReactiveFormsModule]
})
export class RegisterationComponent {
  registerForm: FormGroup;
  selectedImage: File | null = null;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', Validators.required],
      gender: ['', Validators.required],
      image: [null]
    });
  }

  onFileChange(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];
    if (file) {
      this.selectedImage = file;
      this.registerForm.patchValue({ image: file });
    }
  }

  submitForm() {
    if (this.registerForm.valid) {
      const formData = new FormData();
      formData.append('email', this.registerForm.get('email')?.value);
      formData.append('name', this.registerForm.get('username')?.value);
      formData.append('password', this.registerForm.get('password')?.value);
      formData.append('gender', this.registerForm.get('gender')?.value);
      if (this.selectedImage) {
        formData.append('image', this.selectedImage);
      }
      this.auth.Register(formData).subscribe({
        next: (response) => {
          console.log('Registration successful:', response);
          this.router.navigate(["/login"])
        },
        error: (error) => {
          console.error('Registration failed:', error);
        }
      });
    } else {
      console.log('Form is invalid');
    }
  }
}
