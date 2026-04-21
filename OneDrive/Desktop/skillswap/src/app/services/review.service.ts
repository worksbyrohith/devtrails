import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Review } from '../models/app.models';
import { AuthService } from './auth.service';
import { SwapService } from './swap.service';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private readonly reviewsSubject = new BehaviorSubject<Review[]>([]);
  readonly reviews$ = this.reviewsSubject.asObservable();

  constructor(
    private readonly authService: AuthService,
    private readonly swapService: SwapService
  ) {}

  submitReview(payload: Omit<Review, 'id' | 'fromUserId' | 'createdAt'>): Observable<Review> {
    const current = this.authService.getCurrentUser();
    const fromUserId = current?.id ?? 0;

    const review: Review = {
      ...payload,
      id: Date.now(),
      fromUserId,
      createdAt: new Date().toISOString()
    };

    this.reviewsSubject.next([review, ...this.reviewsSubject.value]);
    this.swapService.markReviewCompleted(payload.swapId);
    return of(review).pipe(delay(300));
  }

  getReviewsByUser(userId: number): Observable<Review[]> {
    return this.reviews$.pipe(map((rows) => rows.filter((r) => r.toUserId === userId)));
  }

  hasPendingReviewCheck(): boolean {
    return this.swapService.hasPendingReview();
  }
}
