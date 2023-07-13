import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { createRecord } from 'lightning/uiRecordApi';
import ACCOUNT_OBJECT from '@salesforce/schema/Account';
import NAME_FIELD from '@salesforce/schema/Account.Name';
import PARENT_FIELD from '@salesforce/schema/Account.ParentId';
export default class RecordApiExample extends LightningElement {
    handleSubmit(event) {
        event.preventDefault(); // Prevent default form submission
        const fields = event.detail.fields;
        
        createRecord({ apiName: ACCOUNT_OBJECT.objectApiName, fields })
            .then(result => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Record created successfully',
                        variant: 'success'
                    })
                );
                // Handle any additional logic or redirection after successful record creation
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });
    }

}