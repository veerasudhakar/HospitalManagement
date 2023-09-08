import { LightningElement } from 'lwc';

export default class AccountSearchForm extends LightningElement {

    searchtext = '';
    accountNameChangeHandler(event){
        this.searchtext = event.target.value;
    }

    searchClickHandler(){
       const event= new CustomEvent('searchaccountcontact',{ detail:this.searchtext});
       this.dispatchEvent(event);
    }
}