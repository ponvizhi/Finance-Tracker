import { Component } from '@angular/core';
import { ExpenseService } from 'src/app/services/expense.service';
import { IncomeService } from 'src/app/services/income.service';

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.scss']
})
export class TransactionHistoryComponent {
  transactions : any[] = [];
  filteredTransactions: any[] = [];

  filterType = '';
  filterCategory = '';
  filterMinAmount: number | null = null;
  filterMaxAmount: number | null = null;

  constructor(private incomeService : IncomeService, private expenseService : ExpenseService){

  }

  ngOnInit(){
    this.fetchTransactions();
  }

  fetchTransactions(){
    const uid = localStorage.getItem('User Id');
    this.incomeService.getIncomes().subscribe(
      income => {
        this.expenseService.getExpenses().subscribe(
          expenses => {
            this.transactions = [
              ...income.filter(item => item.uid === uid).map(inc => ({...inc, type: 'income'})),
              ...expenses.filter(item => item.uid === uid).map(exp => ({...exp, type: 'expense'}))
            ];
            this.transactions.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            this.filteredTransactions = [...this.transactions];
          }
        )
      }
    )
  }

  applyFilters(){
    this.filteredTransactions = this.transactions.filter(txn => {
      return (
        (this.filterType ? txn.type === this.filterType : true) &&
        (this.filterCategory ? txn.category === this.filterCategory : true) &&
        (this.filterMinAmount !== null ? txn.amount >= this.filterMinAmount : true) &&
        (this.filterMaxAmount !== null ? txn.amount >= this.filterMaxAmount : true)
      );
    });
  }

  clearFilters(){
    this.filterType = '';
    this.filterCategory = '';
    this.filterMinAmount = null;
    this.filterMaxAmount = null;
    this.filteredTransactions = [...this.transactions];
  }

}
