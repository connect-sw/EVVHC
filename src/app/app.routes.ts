import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component'; // ✅ Import LoginComponent

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // ✅ Set Login as root
  { path: 'login', component: LoginComponent },         // ✅ Login route
  { path: 'home', component: HomeComponent },           // Optional: keep home as backup
  {
    path: 'user',
    loadChildren: () =>
      import('./user/user.module').then((m) => m.UserModule),
  },
  { path: '**', redirectTo: 'login' } // ✅ Wildcard fallback
];
