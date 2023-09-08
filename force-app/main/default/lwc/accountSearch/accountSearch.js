import { LightningElement } from 'lwc';

export default class AccountSearch extends LightningElement {

    searchtext = '';
    searchAccountContactHandler(event){
        this.searchtext = event.detail.value;
    }
}