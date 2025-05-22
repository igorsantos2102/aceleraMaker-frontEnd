import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PostListComponent } from './post-list/post-list.component';
import { PostFormComponent } from './post-form/post-form.component';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AuthGuard } from './services/auth.guard';
import { PendingChangesGuard } from './guards/pending-changes.guard';
import { ProfileComponent } from './profile/profile.component';


export const APP_ROUTES: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'posts',
    component: PostListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'posts/create',
    component: PostFormComponent,
    canActivate: [AuthGuard],
    canDeactivate: [PendingChangesGuard]
  },
  {
    path: 'posts/edit/:id',
    component: PostFormComponent,
    canActivate: [AuthGuard],
    canDeactivate: [PendingChangesGuard]
  },
  {
    path: 'posts/:id',
    component: PostDetailComponent,
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '/login' }
];
