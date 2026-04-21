import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { User, UserRole } from '../models/app.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly tokenKey = 'skillswap.token';
  private readonly users: User[] = [
    {
      id: 1,
      fullName: 'Admin User',
      email: 'admin@skillswap.dev',
      role: 'Admin',
      bio: 'Platform admin focused on safety and quality.',
      latitude: 13.0827,
      longitude: 80.2707,
      skillsOffered: ['Moderation', 'Community Support'],
      skillsDesired: ['Analytics'],
      avgRating: 4.8,
      avatarUrl: ''
    },
    {
      id: 2,
      fullName: 'Benny',
      email: 'user@skillswap.dev',
      role: 'User',
      bio: 'Frontend enthusiast looking to trade UI and backend skills.',
      latitude: 13.0674,
      longitude: 80.2376,
      skillsOffered: ['Angular', 'TypeScript'],
      skillsDesired: ['Node.js', 'System Design'],
      avgRating: 4.6,
      avatarUrl: ''
    },
    {
      id: 3,
      fullName: 'Yuvasree',
      email: 'yuvasree@skillswap.dev',
      role: 'User',
      bio: 'Full stack builder and mentor.',
      latitude: 13.1067,
      longitude: 80.2206,
      skillsOffered: ['Node.js', 'MongoDB'],
      skillsDesired: ['Angular', 'Figma'],
      avgRating: 4.7,
      avatarUrl: ''
    }
  ];

  private readonly currentUserSubject = new BehaviorSubject<User | null>(null);
  readonly currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      const payload = this.decodeToken(token);
      if (payload?.id) {
        const user = this.users.find((u) => u.id === payload.id) ?? null;
        this.currentUserSubject.next(user);
      }
    }
  }

  login(email: string, password: string): Observable<{ token: string; user: User }> {
    const user = this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user || password.length < 6) {
      return throwError(() => new Error('Invalid credentials'));
    }
    const token = this.buildToken(user.id, user.email, user.role);
    return of({ token, user }).pipe(
      delay(400),
      tap((res) => {
        localStorage.setItem(this.tokenKey, res.token);
        this.currentUserSubject.next(res.user);
      })
    );
  }

  register(payload: {
    fullName: string;
    email: string;
    password: string;
    skillsOffered: string[];
    skillsDesired: string[];
  }): Observable<{ token: string; user: User }> {
    const exists = this.users.some((u) => u.email.toLowerCase() === payload.email.toLowerCase());
    if (exists) {
      return throwError(() => new Error('Email already registered'));
    }

    const newUser: User = {
      id: this.users.length + 1,
      fullName: payload.fullName,
      email: payload.email,
      role: 'User',
      bio: 'New member on SkillSwap.',
      latitude: 13.05,
      longitude: 80.24,
      skillsOffered: payload.skillsOffered,
      skillsDesired: payload.skillsDesired,
      avgRating: 0,
      avatarUrl: ''
    };

    this.users.push(newUser);
    const token = this.buildToken(newUser.id, newUser.email, newUser.role);
    return of({ token, user: newUser }).pipe(
      delay(500),
      tap((res) => {
        localStorage.setItem(this.tokenKey, res.token);
        this.currentUserSubject.next(res.user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  getRole(): UserRole | null {
    const token = localStorage.getItem(this.tokenKey);
    const payload = token ? this.decodeToken(token) : null;
    return payload?.role ?? null;
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getUsers(): User[] {
    return this.users;
  }

  updateProfile(userId: number, patch: Partial<Pick<User, 'bio' | 'skillsOffered' | 'skillsDesired' | 'avatarUrl'>>): Observable<User> {
    const user = this.users.find((u) => u.id === userId);
    if (!user) {
      return throwError(() => new Error('User not found'));
    }
    Object.assign(user, patch);
    if (this.currentUserSubject.value?.id === user.id) {
      this.currentUserSubject.next({ ...user });
    }
    return of({ ...user }).pipe(delay(250));
  }

  private buildToken(id: number, email: string, role: UserRole): string {
    const payload = btoa(JSON.stringify({ id, email, role }));
    return `mock.${payload}.sig`;
  }

  private decodeToken(token: string): { id: number; email: string; role: UserRole } | null {
    try {
      const payload = token.split('.')[1] ?? '';
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  }
}
