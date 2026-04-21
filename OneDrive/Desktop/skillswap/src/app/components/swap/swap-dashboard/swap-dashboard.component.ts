import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SwapService } from '../../../services/swap.service';
import { AuthService } from '../../../services/auth.service';
import { SwapRequest, User } from '../../../models/app.models';

type Tab = 'inbound' | 'outbound' | 'active' | 'completed';

@Component({
  selector: 'app-swap-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './swap-dashboard.component.html',
  styleUrl: './swap-dashboard.component.scss'
})
export class SwapDashboardComponent {
  tab: Tab = 'inbound';
  outbound: SwapRequest[] = [];
  inbound: SwapRequest[] = [];
  active: SwapRequest[] = [];
  completed: SwapRequest[] = [];
  currentUser: User | null = null;

  constructor(
    private readonly swapService: SwapService,
    private readonly authService: AuthService
  ) {
    this.currentUser = this.authService.getCurrentUser();
    this.swapService.getMySwaps().subscribe((res) => {
      this.outbound = res.outbound;
      this.inbound = res.inbound;
      this.active = res.active;
      this.completed = res.completed;
    });
  }

  setTab(t: Tab): void {
    this.tab = t;
  }

  accept(id: number): void {
    this.swapService.acceptSwap(id).subscribe();
  }

  decline(id: number): void {
    this.swapService.declineSwap(id).subscribe();
  }

  conclude(id: number): void {
    this.swapService.concludeSwap(id).subscribe();
  }

  get rows(): SwapRequest[] {
    switch (this.tab) {
      case 'inbound': return this.inbound;
      case 'outbound': return this.outbound;
      case 'active': return this.active;
      case 'completed': return this.completed;
    }
  }

  otherName(s: SwapRequest): string {
    if (!this.currentUser) return s.receiverName;
    return s.proposerId === this.currentUser.id ? s.receiverName : s.proposerName;
  }

  initials(name: string | undefined | null): string {
    if (!name) return '??';
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.[0] ?? '';
    const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
    return (first + last).toUpperCase();
  }

  timeAgo(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return mins + 'm ago';
    const hours = Math.floor(mins / 60);
    if (hours < 24) return hours + 'h ago';
    const days = Math.floor(hours / 24);
    return days + 'd ago';
  }

  avatarTheme(id: number): string {
    const themes = ['', 'forest', 'vermillion', 'plum', 'gold'];
    return themes[id % themes.length];
  }
}
