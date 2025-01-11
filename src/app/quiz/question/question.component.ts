import { Component, inject, computed } from '@angular/core';
import { AnswerComponent } from '../answer/answer.component';
import { QuizService } from '../../quiz.service';
@Component({
  selector: 'quiz-question',
  standalone: true,
  imports: [AnswerComponent],
  templateUrl: './question.component.html',
  styleUrl: './question.component.css',
})
export class QuestionComponent {
  quizService = inject(QuizService);
  anwerText = computed(() => this.quizService.currentQuestionAnswers());

  getAnswerbyIndex(i: number) {
    return this.anwerText()[i];
  }
}
