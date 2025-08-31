import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Budget } from 'src/app/models/budget.model';
import { Expense } from 'src/app/models/expense.model';
import { BudgetService } from 'src/app/services/budget.service';
import { ExpenseService } from 'src/app/services/expense.service';
import { IncomeService } from 'src/app/services/income.service';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss']
})
export class ExpenseComponent {
  addExpense : FormGroup;
  expenseList: Expense[] = [];
  expenseCategories: string[] = [];
  submitted = false;
  errorMessage = '';
  successMessage = '';
  budgets: Budget[] =[];

  constructor(private fb: FormBuilder, private incomeService : IncomeService, private expenseService: ExpenseService, private budgetService : BudgetService){
    this.addExpense = this.fb.group({
      expense : ['', Validators.required],
      expensecategory : ['', Validators.required],
      amount : ['', Validators.required],
      date : ['', Validators.required],
      description : ['']
    });
    

  }

  ngOnInit(){
    this.fetchCategories();
    this.loadExpenseData();
    this.fetchBudgets();
  }

  onSubmit(){
    this.submitted = true;
    
    if(this.addExpense.valid){
      const uid = localStorage.getItem('User Id');
      const newExpense: Expense = {
        id: Math.random().toString(36).substr(2, 9),
        ...this.addExpense.value,
        uid : uid || ''
      };

      this.expenseService.addExpense(newExpense).subscribe({
        next:(data)=>{
          this.successMessage = 'Expense Added Successfully!!!';
          console.log('Expense data', data);
          this.loadExpenseData();
          this.deductFromBudget(data.expensecategory, data.amount);
          this.addExpense.reset();
          this.errorMessage = '';
          this.submitted = false;
        },
        error:(err)=>{
          this.successMessage = ''; 
          this.errorMessage = 'Failed to add expense';
        }
      });
      
    }else{
      this.addExpense.markAllAsTouched();
    }
}

loadExpenseData(){
  const uid = localStorage.getItem('User Id');
  this.expenseService.getExpenses().subscribe({
    next:(data)=>{
      console.log('expense data:', data);
      this.expenseList = data.filter(item => item.uid === uid).sort((a, b)=>{
        let dateA = new Date(a.date).getTime();
        let dateB = new Date(b.date).getTime();
        // Sort by date first
        if (dateA !== dateB) {
          return dateB - dateA; // Latest first
        }
        
        // If dates are the same, sort by ID (assuming higher ID means newer entry)
        return parseInt(b.id) - parseInt(a.id);
      });
    },
    error:(err)=>{
      console.log('Error fetching expense data', err);
    }
  })
}

deleteExpense(id: string){
  if(confirm('Are you sure to delete Expense Data')){
    this.expenseService.deleteExpense(id).subscribe({
      next:(res)=>{
        this.loadExpenseData();
      },
      error:(err)=>{
        console.log('Error deleting expense data', err);
      }
    })
  }
}

fetchCategories() {
  this.expenseCategories = this.expenseService.getExpenseCategories();
}

fetchBudgets(){
  this.budgetService.getBudgets().subscribe({
    next: (res)=>{
      const uid = localStorage.getItem('User Id');
      this.budgets = res.filter(item => item.uid === uid);
    },
    error: (err)=>{
      console.log('Failed to fetch budgets');
    }
  })
}

deductFromBudget(category: string, amount: number) {
  const budget = this.budgets.find(b => b.budgetcategory === category);

  if (!budget) {
    alert(`No budget found for ${category}`);
    return;
  }

  const newSpent = budget.currentSpent + amount;

  if (newSpent > budget.limit) {
    alert(`Warning! Your ${category} budget has been exceeded.`);
  }

  const updatedBudget = { ...budget, currentSpent: newSpent };

  this.budgetService.updateBudget(budget.id, updatedBudget).subscribe({
    next: (res) => {
      const index = this.budgets.findIndex(b => b.id === budget.id);
      this.budgets[index] = res; // Update UI
    },
    error: () => {
      this.errorMessage = "Failed to update budget.";
    }
  });
}


}
