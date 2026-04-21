import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ReviewService } from '../../../services/review.service';
import { SwapService } from '../../../services/swap.service';
import { SwapRequest } from '../../../models/app.models';

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './review-form.component.html',
  styleUrl: './review-form.component.scss'
})
export class ReviewFormComponent {
  swap: SwapRequest | null = null;
  tagDraft = '';
  tags: string[] = [];
  error = '';

  form = this.fb.group({
    stars: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
    communication: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
    punctuality: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
    quality: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
    comment: ['', [Validators.required, Validators.minLength(10)]]
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly reviewService: ReviewService,
    private readonly swapService: SwapService,
    private readonly router: Router,
    route: ActivatedRoute
  ) {
    const id = Number(route.snapshot.paramMap.get('id'));
    this.swapService.getById(id).subscribe((item) => (this.swap = item));
  }

  addTag(): void {
    const value = this.tagDraft.trim();
    if (value && !this.tags.includes(value)) {
      this.tags.push(value);
      this.tagDraft = '';
    }
  }

  submit(): void {
    if (this.form.invalid || !this.swap) {
      return;
    }
    const current = this.authService.getCurrentUser();
    if (!current) {
      this.error = 'Please login first.';
      return;
    }

    const toUserId = this.swap.proposerId === current.id ? this.swap.receiverId : this.swap.proposerId;
    const value = this.form.getRawValue();
    this.reviewService
      .submitReview({
        swapId: this.swap.id,
        toUserId,
        stars: value.stars || 5,
        communication: value.communication || 5,
        punctuality: value.punctuality || 5,
        quality: value.quality || 5,
        tags: this.tags,
        comment: value.comment || ''
      })
      .subscribe(() => this.router.navigate(['/swap/dashboard']));
  }

}
