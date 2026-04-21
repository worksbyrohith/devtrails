import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { PagedResult, Skill } from '../models/app.models';

@Injectable({
  providedIn: 'root'
})
export class SkillService {
  private readonly skills: Skill[] = [
    {
      id: 101,
      userId: 3,
      title: 'Node.js API Design',
      category: 'Dev',
      description: 'REST API design, auth patterns, and scalable architecture.',
      distanceMiles: 7,
      ownerName: 'Yuvasree',
      ownerBio: 'Full stack builder and mentor.',
      ownerRating: 4.7,
      transactionRate: 96
    },
    {
      id: 102,
      userId: 2,
      title: 'Angular Advanced Components',
      category: 'Dev',
      description: 'Standalone architecture, RxJS and performance tuning.',
      distanceMiles: 5,
      ownerName: 'Benny',
      ownerBio: 'Frontend enthusiast focused on modern Angular.',
      ownerRating: 4.6,
      transactionRate: 94
    },
    {
      id: 103,
      userId: 4,
      title: 'Figma Design Systems',
      category: 'Design',
      description: 'Create scalable design tokens and reusable component systems.',
      distanceMiles: 11,
      ownerName: 'Priya',
      ownerBio: 'Product designer and UX researcher.',
      ownerRating: 4.9,
      transactionRate: 98
    },
    {
      id: 104,
      userId: 5,
      title: 'Spoken English for Interviews',
      category: 'Language',
      description: 'Practical mock sessions for confidence and clarity.',
      distanceMiles: 18,
      ownerName: 'Hari',
      ownerBio: 'Communication coach for students and developers.',
      ownerRating: 4.4,
      transactionRate: 89
    },
    {
      id: 105,
      userId: 6,
      title: 'Guitar Basics',
      category: 'Music',
      description: 'From chords to simple songs in four weeks.',
      distanceMiles: 22,
      ownerName: 'Naveen',
      ownerBio: 'Part-time musician and teacher.',
      ownerRating: 4.5,
      transactionRate: 91
    }
  ];

  constructor() {}

  getPagedSkills(params: { page: number; pageSize: number; category?: string; radius?: number }): Observable<PagedResult<Skill>> {
    const page = Math.max(1, params.page || 1);
    const pageSize = params.pageSize || 12;
    const radius = params.radius ?? 100;

    let filtered = [...this.skills].filter((s) => s.distanceMiles <= radius);
    if (params.category && params.category !== 'All') {
      filtered = filtered.filter((s) => s.category === params.category);
    }

    const start = (page - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize);

    return of({ items, total: filtered.length, page, pageSize }).pipe(delay(250));
  }

  getById(id: number): Observable<Skill | null> {
    return of(this.skills.find((s) => s.id === id) ?? null).pipe(delay(220));
  }

  getCategories(): string[] {
    return ['All', ...new Set(this.skills.map((s) => s.category))];
  }
}
