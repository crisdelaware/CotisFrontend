import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';

const routes: Routes = [
  // Otras rutas...
  { path: '',
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'profile', component: ProfileComponent },
      { path: '**', redirectTo: 'login' },
    ]}
  // Otras rutas...
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
