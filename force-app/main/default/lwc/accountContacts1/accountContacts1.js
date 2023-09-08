import { LightningElement,wire } from 'lwc';
import {
    subscribe,
    unsubscribe,
    APPLICATION_SCOPE,
    MessageContext,
} from 'lightning/messageService';
import viewAccountContactsChannel1 from '@salesforce/messageChannel/viewAccountContactsChannel1__c';
import getAccountContacts from '@salesforce/apex/accountSearchController1.getAccountContacts';
export default class AccountContacts1 extends LightningElement {
    subscription=null;
contacts = [];
title = 'Contacts';
    accountId='';
    editableContactId = '';
    isShowModalPopup = false;
    @wire(MessageContext)
    messageContext;

    connectedCallback(){
        this.subscribeToMessageChannel();
    }

    get isAccounutSelected(){
        return this.contacts?true : false
    }

    get hascontacts(){
        return this.contacts?.length > 0;
    }

   async getcontacts(){
        const data= await getAccountContacts({accountId: this.accountId})
        this.contacts = data;
    }
    // Encapsulate logic for Lightning message service subscribe and unsubsubscribe
    subscribeToMessageChannel() {
        // if (!this.subscription) {
            this.subscription = subscribe(
                this.messageContext,
                viewAccountContactsChannel1,
                (data) => this.handleAccountSelection(data),
                { scope: APPLICATION_SCOPE }
            );
        // }
    }

    handleAccountSelection(data){
this.accountId = data.accountId;
this.title = `${data.accountName}'s Contacts`
console.log('child',this.accountId,data.accountName);
this.getcontacts();

    }

    disconnectedCallback(){
        this.unsubscribeToMessageChannel();
    }

    unsubscribeToMessageChannel() {
        unsubscribe(this.subscription);
        this.subscription = null;
    }

    editContactHanlder(event){

        this.editableContactId = event.target.dataset.contactId;
        this.isShowModalPopup = true;
    }

    // deleteContactHandler(event){

    // }
    

    popupCloseHandler(event){
        this.isShowModalPopup = false;
        this.editableContactId = null;

    }

    successHandler(){
        this.popupCloseHandler();
        this.getcontacts();
    }
}