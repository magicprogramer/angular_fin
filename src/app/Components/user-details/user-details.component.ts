import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from '../../Services/users.service';
import { ImageUrlPipe } from '../../pipes/image-url.pipe';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ImageUrlPipe],
  templateUrl: './user-details.component.html',
  styleUrls: []
})
export class UserDetailsComponent implements OnInit {
  form!: FormGroup;
  selectedImage: File | null = null;
  user: any;

  constructor(private fb: FormBuilder, private userService: UsersService) {}

  ngOnInit() {
    this.user = this.userService.getCurrentUser();

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

        },
        error: (error) => {
          console.error('Update failed:', error);
        }
      });
    } else {
      console.log('Form is invalid');
    }
  }
}
