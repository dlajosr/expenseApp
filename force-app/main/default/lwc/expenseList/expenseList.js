import { LightningElement, track, wire } from 'lwc';
import { subscribe, APPLICATION_SCOPE, MessageContext } from "lightning/messageService";
import EXPENSEMC from '@salesforce/messageChannel/ExpenseListMessageChannel__c';
import getExpenses from '@salesforce/apex/expenseController.getExpenses';

const columns = [
    { label: 'Date', fieldName: 'Expense_Date__c', type: 'date', sortable: 'true'},
    { label: 'Category', fieldName: 'Category__c', type: 'text' },
    { label: 'Amount', fieldName: 'Amount__c', type: 'currency'}
]

export default class ExpenseList extends LightningElement {

    records = [];
    columns = columns;
    @track sortBy='Expense_Date__c';
    @track sortDirection='desc';
    @track loading = true;

    @wire(MessageContext) messageContext;

    connectedCallback(){
        this.subscribeMC();
        getExpenses()
        .then(data => {
            this.records = data;
            this.sortData(this.sortBy, this.sortDirection);
            this.loading = false;
        });
    }

    sortData(fieldname, direction) {
        let parseData = JSON.parse(JSON.stringify(this.records));
        // Return the value stored in the field
        let keyValue = (a) => {
            return a[fieldname];
        };
        // cheking reverse direction
        let isReverse = direction === 'asc' ? 1: -1;
        // sorting data
        parseData.sort((x, y) => {
            x = keyValue(x) ? keyValue(x) : ''; // handling null values
            y = keyValue(y) ? keyValue(y) : '';
            // sorting values based on direction
            return isReverse * ((x > y) - (y > x));
        });
        this.records = parseData;
    }

    doSorting(event) {
        this.sortBy = event.detail.fieldName;
        this.sortDirection = event.detail.sortDirection;
        this.sortData(this.sortBy, this.sortDirection);
    }

  subscribeMC() {
    // Subscribe to the message channel to refresh list
    this.subscription = subscribe(
        this.messageContext,
        EXPENSEMC,
        message => {
            this.loading = true;
            getExpenses()
            .then(data => {
                this.records = data;
                this.sortData(this.sortBy, this.sortDirection);
                setTimeout(() => this.loading = false, 1000);
            });
        },
        { scope: APPLICATION_SCOPE }
    );
  }

}