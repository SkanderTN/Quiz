import { computed, Injectable, signal,inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { questionInterface } from '../quiz/models/quiz.model';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  private platformId = inject(PLATFORM_ID);
  private apiUrl = 'http://localhost:5000/api/questions';
  questions = signal<questionInterface[]>([]);
  currentQuestionIndex = signal<number>(0);
  currentAnswer = signal<string | null>(null);
  correctAnswerCount = signal<number>(0);
  isLoading = signal<boolean>(false);

  constructor(private http: HttpClient) {}

  loadQuestionsByCategory(category: string) {
    this.isLoading.set(true);
    this.currentQuestionIndex.set(0);
    this.currentAnswer.set(null);
    this.correctAnswerCount.set(0);

    this.http.get<questionInterface[]>(`${this.apiUrl}?category=${category}`)
      .subscribe({
        next: (questions) => {
          if (questions.length === 0) {
            console.warn(`No questions found for category: ${category}`);
          }
          this.questions.set(questions);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error loading questions:', error);
          this.questions.set([]);
          this.isLoading.set(false);
        }
      });
  }

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
    () => this.currentQuestionIndex() === this.questions().length
  );
  
  onNextQuestion(): void {
    if (this.currentQuestionIndex() < this.questions().length ) {
      this.currentQuestionIndex.set(this.currentQuestionIndex() + 1);
    }
    this.currentAnswer.set(null);
  }
  
getStoredCategory(): string | null {
  if (isPlatformBrowser(this.platformId)) {
    return localStorage.getItem('quizCategory');
  }
  return null;
}

setStoredCategory(category: string): void {
  if (isPlatformBrowser(this.platformId)) {
    localStorage.setItem('quizCategory', category);
  }
}

}