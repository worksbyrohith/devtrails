import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SkillService } from '../../../services/skill.service';
import { PagedResult, Skill } from '../../../models/app.models';

@Component({
  selector: 'app-skills-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './skills-list.component.html',
  styleUrl: './skills-list.component.scss'
})
export class SkillsListComponent {
  categories: string[] = [];
  category = 'All';
  radius = 25;
  zipCode = '11201';
  searchText = '';
  page = 1;
  readonly pageSize = 6;
  result: PagedResult<Skill> = { items: [], total: 0, page: 1, pageSize: this.pageSize };

  constructor(private readonly skillService: SkillService) {
    this.categories = this.skillService.getCategories();
    this.load();
  }

  load(): void {
    this.skillService
      .getPagedSkills({
        page: this.page,
        pageSize: this.pageSize,
        category: this.category,
        radius: this.radius
      })
      .subscribe((res) => (this.result = res));
  }

  applyFilters(): void {
    this.page = 1;
    this.load();
  }

  setCategory(cat: string): void {
    this.category = cat;
    this.applyFilters();
  }

  next(): void {
    const max = Math.ceil(this.result.total / this.pageSize);
    if (this.page < max) {
      this.page += 1;
      this.load();
    }
  }

  prev(): void {
    if (this.page > 1) {
      this.page -= 1;
      this.load();
    }
  }

  goto(p: number): void {
    if (p >= 1 && p <= this.totalPages) {
      this.page = p;
      this.load();
    }
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.result.total / this.pageSize));
  }

  get pageNumbers(): number[] {
    const total = this.totalPages;
    const max = Math.min(3, total);
    return Array.from({ length: max }, (_, i) => i + 1);
  }

  avatarTheme(idx: number): string {
    const themes = ['vermillion', 'forest', 'plum', 'gold', '', 'vermillion'];
    return themes[idx % themes.length];
  }

  bannerGradient(idx: number): string {
    const gradients = [
      'linear-gradient(135deg, #E8542E 0%, #C8A34B 100%)',
      'linear-gradient(135deg, #2F5742 0%, #503A55 100%)',
      'linear-gradient(135deg, #503A55 0%, #E8542E 100%)',
      'linear-gradient(135deg, #C8A34B 0%, #2F5742 100%)',
      'linear-gradient(135deg, #0A0A0A 0%, #503A55 100%)',
      'linear-gradient(135deg, #E8542E 0%, #503A55 100%)'
    ];
    return gradients[idx % gradients.length];
  }

  initials(name: string | undefined | null): string {
    if (!name) return '??';
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.[0] ?? '';
    const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
    return (first + last).toUpperCase();
  }
}
