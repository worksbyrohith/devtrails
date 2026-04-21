import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { User } from '../../../models/app.models';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  user: User | null = null;
  isOwnProfile = false;
  editableBio = '';
  offeredDraft = '';
  desiredDraft = '';
  zipCode = '11201';
  radius = 25;
  message = '';

  constructor(private readonly authService: AuthService, route: ActivatedRoute) {
    const id = Number(route.snapshot.paramMap.get('id'));
    const current = this.authService.getCurrentUser();
    const targetId = id || current?.id || 0;

    this.user = this.authService.getUsers().find((u) => u.id === targetId) ?? null;
    this.isOwnProfile = !!this.user && !!current && this.user.id === current.id;
    this.editableBio = this.user?.bio || '';
  }

  addOffered(): void {
    if (this.user && this.offeredDraft.trim()) {
      this.user.skillsOffered = [...this.user.skillsOffered, this.offeredDraft.trim()];
      this.offeredDraft = '';
    }
  }

  addDesired(): void {
    if (this.user && this.desiredDraft.trim()) {
      this.user.skillsDesired = [...this.user.skillsDesired, this.desiredDraft.trim()];
      this.desiredDraft = '';
    }
  }

  removeOffered(skill: string): void {
    if (!this.user) return;
    this.user.skillsOffered = this.user.skillsOffered.filter((s) => s !== skill);
  }

  removeDesired(skill: string): void {
    if (!this.user) return;
    this.user.skillsDesired = this.user.skillsDesired.filter((s) => s !== skill);
  }

  save(): void {
    if (!this.user) {
      return;
    }
    this.authService
      .updateProfile(this.user.id, {
        bio: this.editableBio,
        skillsOffered: this.user.skillsOffered,
        skillsDesired: this.user.skillsDesired
      })
      .subscribe((res) => {
        this.user = res;
        this.message = 'Profile saved.';
        setTimeout(() => (this.message = ''), 2400);
      });
  }

  initials(name: string | undefined | null): string {
    if (!name) return '??';
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.[0] ?? '';
    const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
    return (first + last).toUpperCase();
  }

  get profileStrength(): number {
    if (!this.user) return 0;
    let score = 40;
    if ((this.user.bio || '').length > 40) score += 20;
    if (this.user.skillsOffered.length > 0) score += 15;
    if (this.user.skillsDesired.length > 0) score += 15;
    if (this.user.avatarUrl) score += 10;
    return Math.min(100, score);
  }
}
