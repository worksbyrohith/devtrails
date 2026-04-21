import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-inbound-review',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './inbound-review.component.html',
  styleUrls: ['./inbound-review.component.scss']
})
export class InboundReviewComponent {}
