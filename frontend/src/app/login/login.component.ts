import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private router: Router, private http: HttpClient) {}

  login(): void {
    console.log('Attempting login with:', this.email, this.password);

    if (!this.email || !this.password) {
      alert('Please enter both email and password!');
      return;
    }

    const loginData = { email: this.email, password: this.password };

    this.http.post('http://localhost:5000/login', loginData).subscribe({
      next: (response: any) => {
        console.log('Login successful:', response);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.router.navigate(['/welcome']); // Navigate to welcome page on success
      },
      error: (error) => {
        console.error('Login error:', error);
        alert(`Login failed: ${error.error?.message || 'Unknown error'}`);
      },
    });
  }
}

