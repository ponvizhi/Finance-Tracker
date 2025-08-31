export interface Expense{
    id: string;
    uid: string;
    expense: string;
    expensecategory: string;
    amount: number;
    date: string;
    description?: string
}