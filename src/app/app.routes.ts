import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    {
      path: 'user',
      loadChildren: () =>
      import('./user/user.module').then((m) => m.UserModule),
    }
];
