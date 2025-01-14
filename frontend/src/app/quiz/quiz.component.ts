import { Component, inject } from '@angular/core';
import { QuestionComponent } from './question/question.component';
import { QuizService } from '../quiz.service';

@Component({
  selector: 'quiz-app',
  standalone: true,
  imports: [QuestionComponent],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.css',
})
export class QuizComponent {
  quizService = inject(QuizService);
  title = 'Angular-quiz';
}
