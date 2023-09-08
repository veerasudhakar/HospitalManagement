import { LightningElement,api,wire } from 'lwc';
import getAccount from '@salesforce/apex/accountSearchController1.getAccount';
// Import message service features required for publishing and the message channel
import { publish, MessageContext } from 'lightning/messageService';
import viewAccountContactsChannel1 from '@salesforce/messageChannel/viewAccountContactsChannel1__c';

const COLUMNS = [
    { label: 'Id', fieldName: 'Id' },
    { label: 'Name', fieldName: 'Name' },
    { label: 'Industry', fieldName: 'Industry' },
    {label: 'Actions', type:'button', typeAttributes:{
label : 'View Contacts',
name : 'View Contacts',
title : 'View Contacts',
value : 'View_Contacts',

    }},
    
];
export default class AccountSearchResult1 extends LightningElement {

    @api searchText
    @wire(getAccount, {searchText : '$searchText'})
    accountList;
    columns = COLUMNS;
   
    @wire(MessageContext)
    messageContext;

    // Respond to UI event by publishing message
    rowActionHandler(event){
        console.log('event',event)
        if(event.detail.action.value === 'View_Contacts'){
            //console.log(this.event);
            const payload = { accountId: event.detail.row.Id, accountName: event.detail.row.Name, accountIndustry: event.detail.row.Industry };
console.log('accountId:', event.detail.row.Id,' accountName:',event.detail.row.Name,' accountIndustry:',event.detail.row.Industry)
            publish(this.messageContext, viewAccountContactsChannel1, payload);
        }

    }
    
   /*
        data = [];
        columns = columns;
    
        connectedCallback() {
            const data = generateData({ amountOfRecords: 100 });
            this.data = data;
        }
        */

}