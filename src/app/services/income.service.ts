import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Income } from '../models/income.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IncomeService { 

  private apiUrl = 'https://67e0226b7635238f9aaca70b.mockapi.io/financetrackermockapi/incomes';

  constructor(private http : HttpClient) { }

  // Add new income
  addIncome(income : Income) : Observable<Income>{
    return this.http.post<Income>(this.apiUrl, income);
  }

  // Get all incomes
  getIncomes() : Observable<Income[]>{
    return this.http.get<Income[]>(this.apiUrl);
  }

  // Delete income
  deleteIncome(id : string) : Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Get only income name List
  getIncomeNameList() : Observable<string[]>{
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((incomes)=>incomes.map((income)=>income.source))
    )
  }

}
