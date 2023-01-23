import { LightningElement, wire, api } from 'lwc';
import { publish, MessageContext } from 'lightning/messageService';
import EXPENSEMC from '@salesforce/messageChannel/ExpenseListMessageChannel__c';
import EXPENSE_OBJECT from '@salesforce/schema/Expense__c';
import CATEGORY_FIELD from '@salesforce/schema/Expense__c.Category__c';
import EXPENSE_DATE_FIELD from '@salesforce/schema/Expense__c.Expense_Date__c';
import AMOUNT_FIELD from '@salesforce/schema/Expense__c.Amount__c';
import RECURRING_FIELD from '@salesforce/schema/Expense__c.Recurring__c';
import NUMBER_OF_TERMS_FIELD from '@salesforce/schema/Expense__c.Number_Of_Terms__c';

export default class ExpenseCreator extends LightningElement {

    expenseObject = EXPENSE_OBJECT;
    category = CATEGORY_FIELD;
    expenseDate = EXPENSE_DATE_FIELD;
    amount = AMOUNT_FIELD;
    recurring = RECURRING_FIELD;
    numberOfTerms = NUMBER_OF_TERMS_FIELD;

    // wired message context
    @wire(MessageContext) messageContext;

    handleExpenseCreated(){
        const message = {
            refresh: true
        }
        publish(this.messageContext, EXPENSEMC, message);
    }

    handleCancel(event){
        event.preventDefault();
        const inputFields = this.template.querySelectorAll(
            'lightning-input-field'
        );
        if (inputFields) {
            inputFields.forEach(field => {
                field.reset();
            });
        }
    }
}