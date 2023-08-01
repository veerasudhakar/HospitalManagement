import { LightningElement,track } from 'lwc';
import DOCTOR_OBJECT from '@salesforce/schema/Doctor__c';
import NAME_FIELD from '@salesforce/schema/Doctor__c.Name';
import EMAIL_FIELD from '@salesforce/schema/Doctor__c.Email__c';


export default class EditProfile extends LightningElement {
    // recordId = "a065i00000P3iKCAAZ";
    // objectApiName = DOCTOR_OBJECT;
    // @track fields = [NAME_FIELD,EMAIL_FIELD];

    //     handleSubmit(event) {
    //     //event.preventDefault(); // stop the form from submitting
    //     const fields = event.detail.fields;
    //     fields.LastName = 'My Custom Last Name'; // modify a field
    //     this.template.querySelector('lightning-record-form').submit(fields);
        
    // }

    //      handleCancel() {
    //     // Handle cancel button click, e.g., close the modal
    //     this.dispatchEvent(new CustomEvent('cancel'));
    // }
}