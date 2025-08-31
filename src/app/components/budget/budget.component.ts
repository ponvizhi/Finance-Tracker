import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Budget } from 'src/app/models/budget.model';
import { BudgetService } from 'src/app/services/budget.service';
import { ExpenseService } from 'src/app/services/expense.service';

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.scss']
})
export class BudgetComponent {
  budgetForm : FormGroup;
  budgets : Budget[] = [];
  expenseCategories: string[] = [];
  successMessage = '';
  errorMessage = '';
  submitted = false;
  availableCategories: string[] = []; // Stores categories without a budget
  editingBudgetId: string | null = null;
  updatedLimit: number = 0;
  budgetExceetsWarning = '';

  constructor(private expenseService : ExpenseService, private fb : FormBuilder, private budgetService: BudgetService){
    this.budgetForm = this.fb.group({
      budgetcategory : ['', Validators.required],
      limit : ['', [Validators.required, Validators.min(1)]]
    });
    this.fetchBudgets();
  }

  ngOnInit(): void {
    this.fetchCategories(); 
    this.checkBudgetLimits(); 
  }

  addBudget(){
    this.submitted = true;
    if(this.budgetForm.valid){
      const uid = localStorage.getItem('User Id');
      const newBudget : Budget = {
        id: Math.random().toString(36).substr(2, 9),
        budgetcategory : this.budgetForm.value.budgetcategory,
        limit : this.budgetForm.value.limit,
        currentSpent : 0,
        uid : uid || ''
      };
      this.budgetService.addBudget(newBudget).subscribe({
        next:(res)=>{
          this.budgets.push(res);
          this.successMessage = 'Budget added successfully!';
          this.budgetForm.reset();
          this.submitted = false;
          setTimeout(()=>{
            this.fetchCategories();
          }, 1000)
        },
        error: (err)=>{
          this.errorMessage = 'Failed to add budget';
        }
      })
    }else{
      this.budgetForm.markAllAsTouched();
    }
  }

  fetchBudgets(){
    const uid = localStorage.getItem('User Id') 
    this.budgetService.getBudgets().subscribe({
      next: (res)=>{
        this.budgets = res.filter(item => item.uid === uid);
        this.fetchCategories(); 
      this.checkBudgetLimits();
      },
      error: (err)=>{
        this.errorMessage = 'Failed to load budgets';
      }
    })
  }

  fetchCategories() {
    this.expenseCategories = this.expenseService.getExpenseCategories();
    
    setTimeout(()=>{
      console.log(this.budgets);
    }, 1000)
    // Get the list of categories that already have budgets
    const budgetedCategories = this.budgets.map(budget => budget.budgetcategory);
  
    // Filter categories that are NOT already budgeted
    this.availableCategories = this.expenseCategories.filter(
      category => !budgetedCategories.includes(category)
    );
  
    console.log('Available Categories:', this.availableCategories);
  }
  
  editBudget(id: string, limit: number) {
    this.editingBudgetId = id;
    this.updatedLimit = limit; // Pre-fill the current limit in the input field
  }
  updateBudget(id: string) {
    const uid = localStorage.getItem('User Id');
    if (!this.updatedLimit || this.updatedLimit <= 0) {
      this.errorMessage = 'Limit must be greater than zero';
      return;
    }
  
    const existingBudget = this.budgets.find(b => b.id === id);
  
    if (!existingBudget) {
      this.errorMessage = 'Budget not found';
      return;
    }
  
    const updatedBudget: Budget = {
      id: existingBudget.id, // Ensure id is always defined
      budgetcategory: existingBudget.budgetcategory,
      limit: this.updatedLimit,
      currentSpent: existingBudget.currentSpent,
      uid : uid || ''
    };
  
    this.budgetService.updateBudget(id, updatedBudget).subscribe({
      next: (res) => {
        const budgetIndex = this.budgets.findIndex(b => b.id === id);
        if (budgetIndex !== -1) {
          this.budgets[budgetIndex] = res; // Update UI with backend response
        }
        this.editingBudgetId = null;
        this.successMessage = 'Budget updated successfully!';
      },
      error: () => {
        this.errorMessage = 'Failed to update budget';
      }
    });
  }
  
  cancelEdit() {
    this.editingBudgetId = null; // Hide the edit input
  } 

  checkBudgetLimits(){
    const exceedsBudgets = this.budgets.filter(budget => budget.currentSpent > budget.limit).map(budget=> budget.budgetcategory);
    if(exceedsBudgets.length > 0){
      const message = `Budget Exceets for ${exceedsBudgets.join(', ')}`;
      this.budgetExceetsWarning = message
    }else{
      this.budgetExceetsWarning = '';
    }
  }

}
