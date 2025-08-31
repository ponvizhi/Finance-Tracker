import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Budget } from '../models/budget.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {

  private apiUrl = "http://localhost:3000/budgets";

  constructor(private http: HttpClient) { }
  // Get all budgets
  getBudgets() : Observable<Budget[]>{
    return this.http.get<Budget[]>(this.apiUrl);
  }

  // Add a new budget
  addBudget(budget:Budget) : Observable<Budget>{
    return this.http.post<Budget>(this.apiUrl, budget);
  }

  // Update budget (e.g., when expenses change)
  updateBudget(id: string, budget: Budget) : Observable<Budget>{
    return this.http.put<Budget>(`${this.apiUrl}/${id}`, budget)
  }

  // Delete budget (optional)
  deleteBudget(id:string) :Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
