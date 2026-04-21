import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { ReviewService } from '../services/review.service';

export const reviewLockGuard: CanActivateFn = () => {
  const reviews = inject(ReviewService);
  const router = inject(Router);
  return reviews.hasPendingReviewCheck() ? router.createUrlTree(['/swap/dashboard']) : true;
};
