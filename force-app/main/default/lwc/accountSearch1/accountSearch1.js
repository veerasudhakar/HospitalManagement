import { LightningElement } from 'lwc';

export default class AccountSearch1 extends LightningElement {

    searchText='';
    searchAccountContactHanlder(event){

        this.searchText = event.detail;

    }
}