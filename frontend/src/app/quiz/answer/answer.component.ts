import { Component, computed, inject } from '@angular/core';
import { input } from '@angular/core';
import { Signal } from '@angular/core';
import { QuizService } from '../../quiz.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'quiz-answer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './answer.component.html',
  styleUrl: './answer.component.css',
})
export class AnswerComponent {
  quizService = inject(QuizService);
  answerText = input.required<string>();
  answerIndex = input.required<number>();

  letterMapping = ['A', 'b', 'c', 'd'];
  isCorrectAnswer = computed(
    () =>
      !!this.quizService.currentAnswer() &&
      this.answerText() === this.quizService.getCurrentQuestion().correctAnswer
  );
  isWrongAnswer = computed(
    () =>
      this.answerText() === this.quizService.currentAnswer() &&
      this.quizService.currentAnswer() !==
        this.quizService.getCurrentQuestion().correctAnswer
  );
}
