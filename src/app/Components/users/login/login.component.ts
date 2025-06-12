import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../Services/auth.service';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService, private cookieService: CookieService, private route : Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  submitForm() {
    if (this.loginForm.valid) {
      const formData = new FormData();
      formData.append('email', this.loginForm.get('email')?.value);
      formData.append('password', this.loginForm.get('password')?.value);
      this.auth.Login(formData).subscribe({
        next: (response:any) => {
          console.log('login successful:', response);
          this.cookieService.set('token', response.token);
          this.cookieService.set('user', JSON.stringify(response.user));
          this.route.navigate([""]);
    
        },
        error: (error) => {
          console.error('login failed:', error);
        }
      });
    } else {
      console.log('Form is invalid');
    }
  }
}
