import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Expense } from '../models/expense.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  private expenseCategories: string[] = ['Food', 'Rent', 'Utilities', 'Entertainment', 'Miscellaneous'];

  private apiUrl = "https://67e0226b7635238f9aaca70b.mockapi.io/financetrackermockapi/expenses";

  constructor(private http : HttpClient) { }

  // Add new Expense
  addExpense(expense: Expense) : Observable<Expense>{
    return this.http.post<Expense>(this.apiUrl, expense)
  }

  //Get all Expense
  getExpenses() : Observable<Expense[]>{
    return this.http.get<Expense[]>(this.apiUrl);
  }

  //Delete Expense
  deleteExpense(id: string) : Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  //get expense list
  getExpenseCategories(): string[] {
    return this.expenseCategories;
  }
}
