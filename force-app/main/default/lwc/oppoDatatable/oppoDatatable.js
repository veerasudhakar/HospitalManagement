import { LightningElement, wire,api } from 'lwc';
import getOpportunities from '@salesforce/apex/opportunityController.oppoList';

const columns = [
    { label: 'Opportunity Name', fieldName: 'Name', type: 'text' },
    { label: 'Id', fieldName: 'Id', type: 'Id' },
    { label: 'Stage', fieldName: 'StageName', type: 'text'},
    {label: 'Amount', fieldName: 'Amount', type: 'currency', typeAttributes: { currencyCode: 'USD', step: '0.01' }}
];
export default class OppoDatatable extends LightningElement {
    @api opportunityIds;
    opportunities = [];
    columns = columns;

    @wire(getOpportunities)
    wiredOpportunities({ error, data }) {
        if (data) {
            this.opportunities = data;
        } else if (error) {
            console.error(error);
        }
    }
    

}