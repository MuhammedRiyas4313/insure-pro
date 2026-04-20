import { Routes } from '@angular/router';
import { UserPortalComponent } from './pages/user-portal/user-portal';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard';
import { NotFoundComponent } from './pages/not-found/not-found';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: UserPortalComponent },
  { path: 'admin/dashboard', component: AdminDashboardComponent, canActivate: [authGuard] },
  { path: '**', component: NotFoundComponent }
];
