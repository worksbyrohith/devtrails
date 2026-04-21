import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  step = 1;
  error = '';
  loading = false;
  offeredDraft = '';
  desiredDraft = '';

  form = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
    skillsOffered: this.fb.array([], [Validators.minLength(1)]),
    skillsDesired: this.fb.array([], [Validators.minLength(1)])
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  get skillsOffered(): FormArray {
    return this.form.get('skillsOffered') as FormArray;
  }

  get skillsDesired(): FormArray {
    return this.form.get('skillsDesired') as FormArray;
  }

  nextStep(): void {
    if (this.step === 1) {
      const basicValid =
        this.form.controls.fullName.valid &&
        this.form.controls.email.valid &&
        this.form.controls.password.valid &&
        this.form.controls.confirmPassword.valid &&
        this.form.value.password === this.form.value.confirmPassword;
      if (!basicValid) {
        this.error = 'Please complete Step 1 correctly.';
        return;
      }
      this.error = '';
    }
    if (this.step < 3) {
      this.step += 1;
    }
  }

  previousStep(): void {
    if (this.step > 1) {
      this.step -= 1;
      this.error = '';
    }
  }

  addOfferedSkill(): void {
    const value = this.offeredDraft.trim();
    if (value) {
      this.skillsOffered.push(this.fb.control(value, Validators.required));
      this.offeredDraft = '';
    }
  }

  addDesiredSkill(): void {
    const value = this.desiredDraft.trim();
    if (value) {
      this.skillsDesired.push(this.fb.control(value, Validators.required));
      this.desiredDraft = '';
    }
  }

  removeOffered(index: number): void {
    this.skillsOffered.removeAt(index);
  }

  removeDesired(index: number): void {
    this.skillsDesired.removeAt(index);
  }

  submit(): void {
    if (this.form.value.password !== this.form.value.confirmPassword) {
      this.error = 'Password and confirm password must match.';
      return;
    }

    if (this.skillsOffered.length < 1 || this.skillsDesired.length < 1) {
      this.error = 'Add at least one offered and one desired skill.';
      return;
    }

    this.loading = true;
    const value = this.form.getRawValue();
    this.authService
      .register({
        fullName: value.fullName || '',
        email: value.email || '',
        password: value.password || '',
        skillsOffered: (value.skillsOffered || []) as string[],
        skillsDesired: (value.skillsDesired || []) as string[]
      })
      .subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/skills']);
        },
        error: (err: Error) => {
          this.loading = false;
          this.error = err.message;
        }
      });
  }

}
