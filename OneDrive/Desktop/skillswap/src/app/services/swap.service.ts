import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { SwapRequest } from '../models/app.models';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SwapService {
  private readonly swapsSubject = new BehaviorSubject<SwapRequest[]>([
    {
      id: 5001,
      skillId: 101,
      skillTitle: 'Node.js API Design',
      proposerId: 2,
      proposerName: 'Benny',
      receiverId: 3,
      receiverName: 'Yuvasree',
      offeredSkill: 'Angular Advanced Components',
      requestedSkill: 'Node.js API Design',
      message: 'I can help with standalone Angular architecture and would like to learn robust Node.js API patterns. I am available on weekends and can share practical examples from current projects.',
      createdAt: new Date().toISOString(),
      status: 'PendingOutbound',
      hasPendingReview: false
    },
    {
      id: 5002,
      skillId: 102,
      skillTitle: 'Angular Advanced Components',
      proposerId: 3,
      proposerName: 'Yuvasree',
      receiverId: 2,
      receiverName: 'Benny',
      offeredSkill: 'Node.js API Design',
      requestedSkill: 'Angular Advanced Components',
      message: 'I would like to deepen my Angular component architecture patterns. In exchange, I can mentor backend API structure, validation, and testing with Node.js in practical sessions.',
      createdAt: new Date().toISOString(),
      status: 'PendingInbound',
      hasPendingReview: false
    }
  ]);

  readonly swaps$ = this.swapsSubject.asObservable();

  constructor(private readonly authService: AuthService) {}

  createSwap(request: {
    skillId: number;
    skillTitle: string;
    receiverId: number;
    receiverName: string;
    offeredSkill: string;
    requestedSkill: string;
    message: string;
  }): Observable<SwapRequest> {
    const current = this.authService.getCurrentUser();
    if (!current) {
      return throwError(() => new Error('Please login to submit a swap request'));
    }

    const swap: SwapRequest = {
      id: Date.now(),
      skillId: request.skillId,
      skillTitle: request.skillTitle,
      proposerId: current.id,
      proposerName: current.fullName,
      receiverId: request.receiverId,
      receiverName: request.receiverName,
      offeredSkill: request.offeredSkill,
      requestedSkill: request.requestedSkill,
      message: request.message,
      createdAt: new Date().toISOString(),
      status: 'PendingOutbound',
      hasPendingReview: false
    };

    this.swapsSubject.next([swap, ...this.swapsSubject.value]);
    return of(swap).pipe(delay(300));
  }

  getMySwaps(): Observable<{
    outbound: SwapRequest[];
    inbound: SwapRequest[];
    active: SwapRequest[];
    completed: SwapRequest[];
  }> {
    const current = this.authService.getCurrentUser();
    const userId = current?.id ?? -1;

    return this.swaps$.pipe(
      map((rows) => ({
        outbound: rows.filter((s) => s.proposerId === userId && s.status === 'PendingOutbound'),
        inbound: rows.filter((s) => s.receiverId === userId && s.status === 'PendingInbound'),
        active: rows.filter((s) => (s.proposerId === userId || s.receiverId === userId) && s.status === 'Active'),
        completed: rows.filter((s) => (s.proposerId === userId || s.receiverId === userId) && s.status === 'Completed')
      }))
    );
  }

  getById(id: number): Observable<SwapRequest | null> {
    return this.swaps$.pipe(map((items) => items.find((s) => s.id === id) ?? null));
  }

  getAllSwaps(): Observable<SwapRequest[]> {
    return this.swaps$;
  }

  acceptSwap(id: number): Observable<void> {
    this.updateStatus(id, 'Active');
    return of(void 0).pipe(delay(220));
  }

  declineSwap(id: number): Observable<void> {
    const filtered = this.swapsSubject.value.filter((s) => s.id !== id);
    this.swapsSubject.next(filtered);
    return of(void 0).pipe(delay(220));
  }

  concludeSwap(id: number): Observable<void> {
    this.updateStatus(id, 'Completed', true);
    return of(void 0).pipe(delay(220));
  }

  hasPendingReview(): boolean {
    const current = this.authService.getCurrentUser();
    if (!current) {
      return false;
    }
    return this.swapsSubject.value.some(
      (s) => (s.proposerId === current.id || s.receiverId === current.id) && s.hasPendingReview
    );
  }

  markReviewCompleted(id: number): void {
    const updates = this.swapsSubject.value.map((s) => (s.id === id ? { ...s, hasPendingReview: false } : s));
    this.swapsSubject.next(updates);
  }

  overrideStatus(id: number, status: SwapRequest['status']): void {
    this.updateStatus(id, status, status === 'Completed');
  }

  private updateStatus(id: number, status: SwapRequest['status'], pendingReview = false): void {
    const updates = this.swapsSubject.value.map((s) =>
      s.id === id ? { ...s, status, hasPendingReview: pendingReview } : s
    );
    this.swapsSubject.next(updates);
  }
}
