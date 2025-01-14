import { computed, Injectable, signal,inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { questionInterface } from '../quiz/types/quiz.model';

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
    () => this.currentQuestionIndex() === this.questions().length - 1
  );
  
  onNextQuestion(): void {
    if (this.currentQuestionIndex() < this.questions().length - 1) {
      this.currentQuestionIndex.set(this.currentQuestionIndex() + 1);
    }
    this.currentAnswer.set(null);
  }
  

  getMockQuestions(): questionInterface[] {
    return [
      // Computer Science Questions
      {
        question: 'What does CSS stand for?',
        incorrectAnswers: [
          'Computer Style Sheets',
          'Creative Style Sheets',
          'Colorful Style Sheets',
        ],
        correctAnswer: 'Cascading Style Sheets',
        category: "Computer Science"
      },
      {
        question: 'Where in an HTML document is the correct place to refer to an external style sheet?',
        incorrectAnswers: [
          'In the <body> section',
          'At the end of the document',
          "You can't refer to an external style sheet",
        ],
        correctAnswer: 'In the <head> section',
        category: "Computer Science"
      },

      // Mathematics Questions
      {
        question: 'What is the value of π (pi) to two decimal places?',
        incorrectAnswers: ['3.12', '3.15', '3.16'],
        correctAnswer: '3.14',
        category: "Maths"
      },
      {
        question: 'What is the square root of 144?',
        incorrectAnswers: ['10', '14', '16'],
        correctAnswer: '12',
        category: "Maths"
      },

      // General Knowledge Questions
      {
        question: 'Which planet is known as the Red Planet?',
        incorrectAnswers: ['Venus', 'Jupiter', 'Saturn'],
        correctAnswer: 'Mars',
        category: "General Knowledge"
      },
      {
        question: 'Who painted the Mona Lisa?',
        incorrectAnswers: [
          'Vincent van Gogh',
          'Pablo Picasso',
          'Michelangelo'
        ],
        correctAnswer: 'Leonardo da Vinci',
        category: "General Knowledge"
      },

      // Sports Questions
      {
        question: 'In which sport would you perform a slam dunk?',
        incorrectAnswers: ['Football', 'Tennis', 'Cricket'],
        correctAnswer: 'Basketball',
        category: "Sports"
      },
      {
        question: 'How many players are there in a standard soccer team?',
        incorrectAnswers: ['9', '12', '8'],
        correctAnswer: '11',
        category: "Sports"
      }
    ];
  }
  
  restart(): void {
    this.currentQuestionIndex.set(0);
    this.correctAnswerCount.set(0);
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