import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SudokuSolverComponent } from './components/sudoku-solver/sudoku-solver.component';
import { LoginRegisterComponent } from './components/login-register/login-register.component';
import { AuthGuard } from './service/auth/auth.guard';
import { ProfileComponent } from './components/profile/profile.component';
import { LoginRegisterGuardGuard } from './service/auth/login-register-guard.guard';
const routes: Routes = [
  {
    path: 'login',
    component: LoginRegisterComponent,
    canMatch: [LoginRegisterGuardGuard],
  },
  {
    path: 'sign_up',
    component: LoginRegisterComponent,
    canMatch: [LoginRegisterGuardGuard],
  },
  {
    path: 'solve-sudoku',
    component: SudokuSolverComponent,
    canMatch: [AuthGuard],
  },
  { path: 'profile', component: ProfileComponent, canMatch: [AuthGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
