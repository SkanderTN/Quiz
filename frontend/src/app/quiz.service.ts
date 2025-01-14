import { computed, Injectable, signal } from '@angular/core';
import { questionInterface } from './quiz/models/quiz.model';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  questions = signal<questionInterface[]>(this.getMockQuestions());

  currentQuestionIndex = signal<number>(0);

  currentAnswer = signal<string | null>(null);
  correctAnswerCount = signal<number>(0);

  getCurrentQuestion = computed(
    () => this.questions()[this.currentQuestionIndex()]
  );
  currentQuestionAnswers = computed(() =>
    this.shuffleAnswers(this.getCurrentQuestion())
  );
  shuffleAnswers(question: questionInterface): string[] {
    const unshuffledAnswers = [
      question.correctAnswer,
      ...question.incorrectAnswers,
    ];
    return unshuffledAnswers
      .map((a) => ({ sort: Math.random(), value: a }))
      .sort((a, b) => a.sort - b.sort)
      .map((a) => a.value);
  }
  selectAnswer(answerText: string): void {
    this.currentAnswer.set(answerText);
    const correctAnswerCount =
      answerText === this.getCurrentQuestion().correctAnswer
        ? this.correctAnswerCount() + 1
        : this.correctAnswerCount();
    this.correctAnswerCount.set(correctAnswerCount);
  }

  showResult = computed(
    () => this.currentQuestionIndex() === this.questions().length - 1
  );
  
  onNextQuestion(): void {
    if (this.currentQuestionIndex() < this.questions().length - 1) {
      this.currentQuestionIndex.set(this.currentQuestionIndex() + 1);
    }
    this.currentAnswer.set(null);
  }
  

 

  restart(): void {
    this.currentQuestionIndex.set(0);
    this.correctAnswerCount.set(0);
  }
  
}
