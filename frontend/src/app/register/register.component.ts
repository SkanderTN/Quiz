import { Component,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true, 
  imports: [FormsModule, CommonModule, RouterModule], 
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RegisterComponent {
  email: string = '';
  username: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(private router: Router, private http: HttpClient) {}

  register(): void {
    console.log('Register button clicked');
    console.log('Form values:', {
      email: this.email,
      username: this.username,
      password: this.password,
    });

    if (!this.email || !this.username || !this.password || !this.confirmPassword) {
      alert('Please fill in all fields!');
      return;
    }
  
    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
  
    const userData = {
      email: this.email,
      username: this.username,
      password: this.password,
    };
  
    console.log('Sending userData:', userData);

    this.http.post('http://localhost:5000/addUser', userData)
      .subscribe({
        next: (response) => {
          console.log('Registration response:', response);
          alert('Registration successful!');
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.log('Full error object:', error);
          console.log('Error status:', error.status);
          console.log('Error message:', error.error?.message);
          alert(`Registration failed: ${error.error?.message || 'Unknown error'}`);
        }
      });
  }
}