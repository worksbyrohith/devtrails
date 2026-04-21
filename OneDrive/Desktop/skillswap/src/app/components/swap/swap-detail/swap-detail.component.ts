import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SwapRequest } from '../../../models/app.models';
import { SwapService } from '../../../services/swap.service';

@Component({
  selector: 'app-swap-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './swap-detail.component.html',
  styleUrl: './swap-detail.component.scss'
})
export class SwapDetailComponent {
  swap: SwapRequest | null = null;

  constructor(route: ActivatedRoute, private readonly swapService: SwapService) {
    const id = Number(route.snapshot.paramMap.get('id'));
    this.swapService.getById(id).subscribe((item) => (this.swap = item));
  }

}
