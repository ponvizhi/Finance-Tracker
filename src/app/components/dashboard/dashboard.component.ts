import { Component } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { Income } from 'src/app/models/income.model';
import { ExpenseService } from 'src/app/services/expense.service';
import { IncomeService } from 'src/app/services/income.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  income: Income[] = [];
  expenses: any[] = [];
  
  totalIncome = 0;
  totalExpense = 0;
  totalSavings = 0;
  isExceedingIncome: boolean = false;
  overspendAmount: number = 0;

selectedFilter: string = 'monthly';
startDate: string = '';
endDate: string = '';

incomePercentage: number = 0;
expensePercentage: number = 0;
overspentPercentage: number = 0;
savingsPercentage: number = 0;

pieData = [
  { label: 'Savings', value: 40, color: '#4CAF50' },
  { label: 'Expenses', value: 30, color: '#F44336' },
  { label: 'Investments', value: 30, color: '#2196F3' }
];

transactions : any[] = [];
  filteredTransactions: any[] = [];

  constructor(private incomeService : IncomeService, private expenseService : ExpenseService){}

  ngOnInit(){
    setTimeout(()=>{
      this.fetchDashboardData();
      
    },500);

    setTimeout(()=>{
      this.calculateProgress();
    }, 1000);

    this.fetchTransactions();
    
  }
  fetchDashboardData() {
    this.totalIncome = 0;
    this.totalExpense = 0;
    this.totalSavings = 0;
    const uid = localStorage.getItem('User Id');
    this.incomeService.getIncomes().subscribe(income => {

      this.income = income.filter(item => item.uid === uid);
      this.totalIncome = this.income.reduce((sum, txn) => sum + Number(txn.amount), 0);
  
      // Do this after income fetch in case expense arrives earlier
      this.totalSavings = this.totalIncome - this.totalExpense;
      this.checkBudgetStatus();
      this.updatePieData();
      this.calculateProgress();
    });
  
    this.expenseService.getExpenses().subscribe(expenses => {
      this.expenses = expenses.filter(item => item.uid === uid);
      this.totalExpense = this.expenses.reduce((sum, txn) => sum + Number(txn.amount), 0);
  
      // Recalculate after both total values update
      this.totalSavings = this.totalIncome - this.totalExpense;
      this.checkBudgetStatus();
      this.updatePieData();
      this.calculateProgress();
    });
  }
  
  
  checkBudgetStatus(){
    if(this.totalExpense > this.totalIncome){
      this.isExceedingIncome = true;
      this.overspendAmount = this.totalExpense - this.totalIncome;
    }else{
      this.isExceedingIncome = false;
      this.overspendAmount = 0
    }
  }
  
  applyFilter() {
    let filteredIncome = this.income;
    let filteredExpense = this.expenses;
    
    if (this.selectedFilter === 'monthly') {
      const currentMonth = new Date().getMonth();
      filteredIncome = this.income.filter(txn => new Date(txn.date).getMonth() === currentMonth);
      filteredExpense = this.expenses.filter(txn => new Date(txn.date).getMonth() === currentMonth);
    } else if (this.selectedFilter === 'yearly') {
      const currentYear = new Date().getFullYear();
      filteredIncome = this.income.filter(txn => new Date(txn.date).getFullYear() === currentYear);
      filteredExpense = this.expenses.filter(txn => new Date(txn.date).getFullYear() === currentYear);
    } else if (this.selectedFilter === 'custom' && this.startDate && this.endDate) {
      filteredIncome = this.income.filter(txn => new Date(txn.date) >= new Date(this.startDate) && new Date(txn.date) <= new Date(this.endDate));
      filteredExpense = this.expenses.filter(txn => new Date(txn.date) >= new Date(this.startDate) && new Date(txn.date) <= new Date(this.endDate));
    }
  
    this.totalIncome = filteredIncome.reduce((sum, txn) => sum + Number(txn.amount), 0);
    this.totalExpense = filteredExpense.reduce((sum, txn) => sum + Number(txn.amount), 0);
    this.totalSavings = this.totalIncome - this.totalExpense;

    // Call to update pie chart data
    this.updatePieData();
    this.checkBudgetStatus();
    this.calculateProgress();
  }

  get pieChartStyle() {
    let gradient = '';
    let currentAngle = 0;

    for (let i = 0; i < this.pieData.length; i++) {
      const item = this.pieData[i];
      const angle = (item.value / 100) * 360;
      const start = currentAngle;
      const end = currentAngle + angle;

      gradient += `${item.color} ${start}deg ${end}deg`;
      if (i < this.pieData.length - 1) {
        gradient += ', ';
      }

      currentAngle = end;
    }

    return {
      'background-image': `conic-gradient(${gradient})`
    };
  }
  updatePieData() {
    const total = this.totalIncome || 0;
    if (total === 0) {
      this.pieData = [];
      return;
    }
    
    const savingsPercent = Math.max(0, (this.totalSavings / total) * 100);
    const expensePercent = Math.min(100, (this.totalExpense / total) * 100);
  
    this.pieData = [
      { label: 'Savings', value: Math.round(savingsPercent), color: '#4CAF50' },
      { label: 'Expenses', value: Math.round(expensePercent), color: '#F44336' }
    ];
  
    // Optional: Fill remaining percentage with 'Unallocated' or 'Other'
    const remainder = 100 - savingsPercent - expensePercent;
    if (remainder > 0) {
      this.pieData.push({ label: 'Other', value: Math.round(remainder), color: '#2196F3' });
    }
  }
  
  calculateProgress(){

    const total = this.totalExpense + this.totalIncome;

    if(this.totalIncome > 0){
      this.incomePercentage = Math.min(100, this.totalIncome / total) * 100;
    }

    if (this.totalExpense > 0) {
      this.expensePercentage = Math.min(100, (this.totalExpense / total) * 100);
    }
  
    if (this.overspendAmount > 0 && this.totalIncome > 0) {
      this.overspentPercentage = Math.min(100, (this.overspendAmount / this.totalIncome) * 100);
    }
  
    if (this.totalSavings > 0 && this.totalIncome > 0) {
      this.savingsPercentage = Math.min(100, (this.totalSavings / this.totalIncome) * 100);
    }

  }
  fetchTransactions(){
    const uid = localStorage.getItem('User Id');
    this.incomeService.getIncomes().subscribe(
      income => {
        this.expenseService.getExpenses().subscribe(
          expenses => {
            this.transactions = [
              ...income.filter(item =>item.uid === uid).map(inc => ({...inc, type: 'income'})),
              ...expenses.filter(item =>item.uid === uid).map(exp => ({...exp, type: 'expense'}))
            ];
            this.transactions.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            this.filteredTransactions = [...this.transactions];
          }
        )
      }
    )
  }
}
