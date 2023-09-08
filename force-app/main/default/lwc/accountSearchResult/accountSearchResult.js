import { LightningElement ,api,wire} from 'lwc';
import getAccounts from '@salesforce/apex/lwcApexController.getAccounts';
import { publish, MessageContext } from 'lightning/messageService';
import viewAccountContactsChannel from '@salesforce/messageChannel/viewAccountContactsChannel__c';

const COLUMNS = [
    { label: 'Id', fieldName: 'Id' },
    { label: 'Industry', fieldName: 'Industry'},
    { label: 'Name', fieldName: 'Name'},
    { 
        label: 'Actions',
        type: 'button',
        typeAttributes: {
            label: 'View Contacts',
            name: 'View Contacts',
            title: 'View Contacts',
            value: 'View_Contacts',
        }
    },
];
export default class AccountSearchResult extends LightningElement {

    @api searchText

    columns = COLUMNS;
    accData = []
    @wire(getAccounts, {searchText:'$searchText'})
    
    accountList({data, error}){
        if(data){
            this.accData = data;
            console.log('data....'+JSON.stringify(data));
        }else(error){
            this.error = error;
            console.log('error....');
        }
    }

    
    @wire(MessageContext)
    messageContext;

    // Respond to UI event by publishing message
    
    rowActionHandler(event){
        if(event.detail.action.value =='View_Contacts' ){
            const payload = { accountId: event.detail.row.Id, accountName: event.detail.row.Name,  accountIndustry: event.detail.row.Industry};

        publish(this.messageContext, viewAccountContactsChannel, payload);
        }
    }
    
}