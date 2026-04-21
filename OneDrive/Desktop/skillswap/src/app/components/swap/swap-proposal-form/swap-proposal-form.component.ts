import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { SkillService } from '../../../services/skill.service';
import { SwapService } from '../../../services/swap.service';
import { Skill, User } from '../../../models/app.models';

@Component({
  selector: 'app-swap-proposal-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './swap-proposal-form.component.html',
  styleUrl: './swap-proposal-form.component.scss'
})
export class SwapProposalFormComponent {
  skill: Skill | null = null;
  offeredSkills: string[] = [];
  partnerSkills: string[] = [];
  currentUser: User | null = null;
  error = '';

  form = this.fb.group({
    offeredSkill: ['', Validators.required],
    requestedSkill: ['', Validators.required],
    message: ['', [Validators.required, Validators.minLength(250)]]
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly skillService: SkillService,
    private readonly swapService: SwapService,
    private readonly router: Router,
    route: ActivatedRoute
  ) {
    const id = Number(route.snapshot.paramMap.get('skillId'));
    this.currentUser = this.authService.getCurrentUser();
    this.skillService.getById(id).subscribe((item) => {
      this.skill = item;
      this.form.patchValue({ requestedSkill: item?.title || '' });
      const partner = item ? this.authService.getUsers().find((u) => u.id === item.userId) : null;
      this.partnerSkills = partner?.skillsOffered ?? (item ? [item.title] : []);
    });
    this.offeredSkills = this.currentUser?.skillsOffered || [];
  }

  pickOffered(skill: string): void {
    this.form.patchValue({ offeredSkill: skill });
  }

  pickRequested(skill: string): void {
    this.form.patchValue({ requestedSkill: skill });
  }

  get messageLength(): number {
    return this.form.controls.message.value?.length || 0;
  }

  submit(): void {
    if (this.form.invalid || !this.skill) {
      this.form.markAllAsTouched();
      this.error = 'Select an offered skill, pick a requested skill, and write a message of at least 250 characters.';
      return;
    }

    const value = this.form.getRawValue();
    this.swapService
      .createSwap({
        skillId: this.skill.id,
        skillTitle: this.skill.title,
        receiverId: this.skill.userId,
        receiverName: this.skill.ownerName,
        offeredSkill: value.offeredSkill || '',
        requestedSkill: value.requestedSkill || '',
        message: value.message || ''
      })
      .subscribe({
        next: () => this.router.navigate(['/swap/dashboard']),
        error: (err: Error) => (this.error = err.message)
      });
  }

  initials(name: string | undefined | null): string {
    if (!name) return '??';
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.[0] ?? '';
    const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
    return (first + last).toUpperCase();
  }
}
