import { LightningElement } from 'lwc';

export default class AccountSearchForm1 extends LightningElement {

    searchText='';
    accountNameChnageHandler(event){
this.searchText=event.target.value;
    }

    searchClickHandler(){
        //These all things passing the data child to parent. There are 2 ways to register event hanlder in Parent on declarative and Another one Programatically.here we will use declarative now.
       const event= new CustomEvent('searchaccountcontact', { detail : this.searchText});
       this.dispatchEvent(event);
    }
}