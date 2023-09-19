import { LightningElement,wire } from 'lwc';
import getcontacts from '@salesforce/apex/contactApexExample.getcontacts';
export default class ContactPaginationExample extends LightningElement {

totalContacts
    @wire(getcontacts)
wiredcontacts({error, data}){
    if(data){
        this.totalContacts = data;
        console.log(data);
    }

    if(error){
        console.error(error);
    }
   
}

}