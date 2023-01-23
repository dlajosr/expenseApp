trigger expenseTrigger on Expense__c (before insert) {
    if(Trigger.isBefore && Trigger.isInsert){
            expenseController.createRecurringExpenses(Trigger.new[0]);
        }
    }