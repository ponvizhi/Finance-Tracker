import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { IncomeComponent } from './components/income/income.component';
import { ExpenseComponent } from './components/expense/expense.component';
import { BudgetComponent } from './components/budget/budget.component';
import { TransactionHistoryComponent } from './components/transaction-history/transaction-history.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {path: 'login', component: LoginComponent, canActivate : [AuthGuard], data: { blockIfLoggedIn: true }},
  {path: 'signup', component: SignupComponent, data: { blockIfLoggedIn: true }},
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  {path: 'income', component: IncomeComponent, canActivate: [AuthGuard]},
  {path: 'expense', component: ExpenseComponent, canActivate: [AuthGuard]},
  {path: 'budget', component: BudgetComponent, canActivate: [AuthGuard]},
  {path: 'transactions', component: TransactionHistoryComponent, canActivate: [AuthGuard]},
  {path: '', redirectTo: '/dashboard', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
