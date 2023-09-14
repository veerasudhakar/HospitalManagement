import { LightningElement,wire } from 'lwc';
import getcontacts from '@salesforce/apex/OppoDatatableController.getcontacts';
import {NavigationMixin} from 'lightning/navigation'
const COLUMNS = [
    {label : 'Id', fieldName : 'Id'},
    {label : 'Name', fieldName : 'Name'},
    {label : 'Email', fieldName : 'Email'},
    {label : 'LeadSource', fieldName : 'LeadSource'},
    {
        type: 'button',
        typeAttributes: { label: 'View', name: 'view', title: 'View', iconName: 'utility:preview' },
    },
]
export default class ContactImperatively extends NavigationMixin(LightningElement) {

    Contacts = [];
    columns = COLUMNS;
//    handleClick(){
//     getcontacts()
//     .then((result) =>{
//         this.Contacts = result;
//         this.error = undefined;
//     })
//     .catch((error)=>{
//         this.error = error;
//         this.Contacts = undefined;
//     });

// }

//Wire Functionality


@wire(getcontacts)

WiredContacts({data, error}){
    if(data){
        this.Contacts = data;
        this.error = undefined;

    } else if(error){
        this.error = error;
        this.Contacts = undefined;
    }
}

handleClick(event){

const actionName = event.detail.action.name;
const row = event.detail.row;

this[NavigationMixin.Navigate]({
    type : 'standard__recordPage',
    attributes: {
recordId : row.Id,
objectApiName : 'Contact',
actionName : 'view',
    },
});
}

}