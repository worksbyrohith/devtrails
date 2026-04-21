import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { SwapService } from '../../../services/swap.service';
import { SwapRequest } from '../../../models/app.models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent {
  totalUsers = 0;
  totalSwaps = 0;
  active = 0;
  pendingReview = 0;

  constructor(authService: AuthService, swapService: SwapService) {
    this.totalUsers = authService.getUsers().length;
    swapService.getAllSwaps().subscribe((rows: SwapRequest[]) => {
      this.totalSwaps = rows.length;
      this.active = rows.filter((r) => r.status === 'Active').length;
      this.pendingReview = rows.filter((r) => r.hasPendingReview).length;
    });
  }

}
