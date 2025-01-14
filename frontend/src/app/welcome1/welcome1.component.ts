import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-welcome1',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './welcome1.component.html',
  styleUrls: ['./welcome1.component.css']
})
export class Welcome1Component implements OnInit {
  username: string = '';
  selectedCategory: string | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    this.username = user ? JSON.parse(user).username : 'Guest';
  }
  

  selectCategory(category: string): void {
    this.selectedCategory = category;
  }

  startQuiz(): void {
    if (this.selectedCategory) {
      localStorage.setItem('quizCategory', this.selectedCategory);
      this.router.navigate(['/quiz']);
    }
  }
}