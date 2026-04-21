import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Skill } from '../../../models/app.models';
import { SkillService } from '../../../services/skill.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-skill-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './skill-detail.component.html',
  styleUrl: './skill-detail.component.scss'
})
export class SkillDetailComponent {
  skill: Skill | null = null;

  constructor(
    route: ActivatedRoute,
    private readonly skillService: SkillService,
    public readonly authService: AuthService
  ) {
    const id = Number(route.snapshot.paramMap.get('id'));
    this.skillService.getById(id).subscribe((item) => (this.skill = item));
  }

  initials(name: string | undefined | null): string {
    if (!name) return '??';
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.[0] ?? '';
    const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
    return (first + last).toUpperCase();
  }
}
