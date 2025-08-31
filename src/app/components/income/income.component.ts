import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Income } from 'src/app/models/income.model';
import { IncomeService } from 'src/app/services/income.service';

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.scss']
})
export class IncomeComponent {

  incomeForm : FormGroup;
  incomes: Income[] = [];
  submitted = false;

  constructor(private incomeService : IncomeService, private fb : FormBuilder){
    this.incomeForm = this.fb.group({
      source : ['', Validators.required],
      amount : ['', Validators.required],
      date : ['', Validators.required]
    }) ;
    this.loadIncomes();
  }

  generateUniqueId(): string {
    return 'id-' + Math.random().toString(36).substr(2, 9);
  }  

  loadIncomes() {
    const uid = localStorage.getItem('User Id') ;
    this.incomeService.getIncomes().subscribe((data) => {
      this.incomes = data.filter(item => item.uid === uid).sort((a, b) => {
        let dateA = new Date(a.date).getTime();
        let dateB = new Date(b.date).getTime();
  
        // Sort by date first
        if (dateA !== dateB) {
          return dateB - dateA; // Latest first
        }
  
        // If dates are the same, sort by ID (assuming higher ID means newer entry)
        return parseInt(b.id) - parseInt(a.id);
      });
  
      // console.log("After sorting:", this.incomes);
    });
  }
  
  

  onSubmit(){
    this.submitted = true;

    if(this.incomeForm.valid){
      const uid = localStorage.getItem('User Id');
      const newIncome : Income = {id: this.generateUniqueId(), ...this.incomeForm.value, uid: uid || ''};

      this.incomeService.addIncome(newIncome).subscribe(()=>{
        this.loadIncomes();
        this.incomeForm.reset();
        this.submitted = false;
      })
    }else{
      this.incomeForm.markAllAsTouched();
    }

  }

  deleteIncome(id: string) {
    if(confirm('Are you sure you want to delete this income source data?')){
    this.incomeService.deleteIncome(id).subscribe(() => {
      this.loadIncomes(); // Refresh the list after deletion
    });
  }
  }  


}
