import { LightningElement ,wire} from 'lwc';
import {
    subscribe,
    unsubscribe,
    APPLICATION_SCOPE,
    MessageContext,
} from 'lightning/messageService';
import viewAccountContactsChannel from '@salesforce/messageChannel/viewAccountContactsChannel__c';
import getAccountContacts from '@salesforce/apex/lwcApexController.getAccountContacts';
export default class AccountContacts extends LightningElement {
    subscription = null;
    @wire(MessageContext)
    messageContext;
    contacts=[];
    title='Contacts';
accountId = '';
    connectedCallback(){

this.subscribeToMessageChannel();
    }
   get isAccountSelected(){
    return this.accountId ?true: false;
   }

   async getContacts(){
    const data = await getAccountContacts({ accountId: this.accountId});
    this.contacts=data;
   }
    // Encapsulate logic for Lightning message service subscribe and unsubsubscribe
    subscribeToMessageChannel() {
        if (!this.subscription) {
            this.subscription = subscribe(
                this.messageContext,
                viewAccountContactsChannel,
                (data) => this.handleAccountSelection(data),
                { scope: APPLICATION_SCOPE }
            );
        }
    }

    handleAccountSelection(data){
this.accountId = data.accountId;
this.title = `${data.accountName}'s Contacts`
    }
disconnectedCallback(){
this.unsubscribeToMessageChannel();
}
    unsubscribeToMessageChannel() {
        unsubscribe(this.subscription);
        this.subscription = null;
    }
}