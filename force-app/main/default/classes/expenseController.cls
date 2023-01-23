public with sharing class expenseController {
    @AuraEnabled
    public static List<Expense__c> getExpenses() {
        List<Expense__c> expenses = [SELECT Category__c, Expense_Date__c, Amount__c FROM Expense__c];
        return expenses;
    }

    public static void createRecurringExpenses(Expense__c expense){

        if(expense.Number_Of_Terms__c == null){
            return;
        }

        List<Expense__c> recurringExpenses = new List<Expense__c>();
        if(expense.Recurring__c == 'Weekly'){
            Integer dayOfWeek = Math.mod(Date.newInstance(1900, 1, 7).daysBetween(expense.Expense_Date__c),7);       
            Integer daysToFriday = 5 - dayOfWeek;
            
            // Add days to next Friday
            if(daysToFriday >= 0){
                expense.Expense_Date__c = expense.Expense_Date__c.addDays(daysToFriday);                
            } else {
                expense.Expense_Date__c = expense.Expense_Date__c.addDays(6);                
            }

            // Create expense records to meet number of terms
            for(Integer i=1; i < expense.Number_Of_Terms__c; i++){
                Expense__c recurringExpense = new Expense__c(
                    Category__c=expense.Category__c,
                    Amount__c=expense.Amount__c,
                    Expense_Date__c=expense.Expense_Date__c.addDays(i * 7)
                );
                recurringExpenses.add(recurringExpense);
            }
            
        } else {
            Integer dayOfMonth = expense.Expense_Date__c.day();
            if(dayOfMonth > 15){
                expense.Expense_Date__c = expense.Expense_Date__c.addMonths(1);
            }

            expense.Expense_Date__c = Date.newInstance(
                expense.Expense_Date__c.year(),
                expense.Expense_Date__c.month(),
                15
            );

            // Create expense records to meet number of terms
            for(Integer i=1; i < expense.Number_Of_Terms__c; i++){
                Expense__c recurringExpense = new Expense__c(
                    Category__c=expense.Category__c,
                    Amount__c=expense.Amount__c,
                    Expense_Date__c=expense.Expense_Date__c.addMonths(i)
                );
                recurringExpenses.add(recurringExpense);
            }

        }

        insert recurringExpenses;
    }
}