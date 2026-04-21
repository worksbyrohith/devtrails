import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SwapRequest } from '../../../models/app.models';
import { SwapService } from '../../../services/swap.service';

@Component({
  selector: 'app-admin-swaps',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-swaps.component.html',
  styleUrl: './admin-swaps.component.scss'
})
export class AdminSwapsComponent {
  swaps: SwapRequest[] = [];
  statusFilter: 'All' | SwapRequest['status'] = 'All';

  constructor(private readonly swapService: SwapService) {
    this.swapService.getAllSwaps().subscribe((rows) => (this.swaps = rows));
  }

  get filteredSwaps(): SwapRequest[] {
    if (this.statusFilter === 'All') {
      return this.swaps;
    }
    return this.swaps.filter((s) => s.status === this.statusFilter);
  }

  setStatus(id: number, status: SwapRequest['status']): void {
    this.swapService.overrideStatus(id, status);
  }

}
