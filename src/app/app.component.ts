import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { quizComponent } from './quiz/quiz.component';
import { AnswerComponent } from './quiz/answer/answer.component';
import { QuestionComponent } from './quiz/question/question.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [quizComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Angular-quiz';
}
