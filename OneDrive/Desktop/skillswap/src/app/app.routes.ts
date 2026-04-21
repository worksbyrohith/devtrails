import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';
import { authGuard } from './guards/auth.guard';
import { reviewLockGuard } from './guards/review-lock.guard';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { SkillsListComponent } from './components/skills/skills-list/skills-list.component';
import { SkillDetailComponent } from './components/skills/skill-detail/skill-detail.component';
import { ProfileComponent } from './components/profile/profile/profile.component';
import { SwapProposalFormComponent } from './components/swap/swap-proposal-form/swap-proposal-form.component';
import { SwapDashboardComponent } from './components/swap/swap-dashboard/swap-dashboard.component';
import { SwapDetailComponent } from './components/swap/swap-detail/swap-detail.component';
import { ReviewFormComponent } from './components/reviews/review-form/review-form.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { AdminUsersComponent } from './components/admin/admin-users/admin-users.component';
import { AdminSwapsComponent } from './components/admin/admin-swaps/admin-swaps.component';
import { NotFoundComponent } from './components/shared/not-found/not-found.component';
import { LandingComponent } from './components/landing/landing.component';
import { InboundReviewComponent } from './components/swap/inbound-review/inbound-review.component';

export const routes: Routes = [
	{ path: '', component: LandingComponent },
	{ path: 'swap/inbound/:id', component: InboundReviewComponent, canActivate: [authGuard] },
	{ path: 'login', component: LoginComponent },
	{ path: 'register', component: RegisterComponent },
	{ path: 'skills', component: SkillsListComponent },
	{ path: 'skills/:id', component: SkillDetailComponent },
	{ path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
	{ path: 'profile/:id', component: ProfileComponent, canActivate: [authGuard] },
	{
		path: 'swap/new/:skillId',
		component: SwapProposalFormComponent,
		canActivate: [authGuard, reviewLockGuard]
	},
	{ path: 'swap/dashboard', component: SwapDashboardComponent, canActivate: [authGuard] },
	{ path: 'swap/:id', component: SwapDetailComponent, canActivate: [authGuard] },
	{ path: 'swap/:id/review', component: ReviewFormComponent, canActivate: [authGuard] },
	{ path: 'admin/dashboard', component: AdminDashboardComponent, canActivate: [authGuard, adminGuard] },
	{ path: 'admin/users', component: AdminUsersComponent, canActivate: [authGuard, adminGuard] },
	{ path: 'admin/swaps', component: AdminSwapsComponent, canActivate: [authGuard, adminGuard] },
	{ path: '404', component: NotFoundComponent },
	{ path: '**', redirectTo: '404' }
];
