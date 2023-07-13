import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { createRecord } from 'lightning/uiRecordApi';
import CASE_OBJECT from '@salesforce/schema/Case';

export default class RaiseCase extends LightningElement {
    showform = true;
    @api recordId;

    caseNumber;
    subject;
    priority;
    origin;
    description;

    handleSubmit=(event)=> {
        event.preventDefault();
        this.showform = false;

        const fields = event.detail.fields;
        const recordInput = { apiName: CASE_OBJECT.objectApiName, fields };

        createRecord(recordInput)
            .then(caseRecord => {
                this.caseNumber = caseRecord.fields.CaseNumber.value;
                this.subject = caseRecord.fields.Subject.value;
                this.priority = caseRecord.fields.Priority.value;
                this.origin = caseRecord.fields.Origin.value;
                this.description = caseRecord.fields.Description.value;

                const toastEvent = new ShowToastEvent({
                    title: 'Success!',
                    message: `Case ${this.caseNumber} - ${this.subject} was created with ID: ${caseRecord.id}`,
                    variant: 'success'
                });
                this.dispatchEvent(toastEvent);
            })
            .catch(error => {
                console.error('Error creating case: ', error);
                const event = new ShowToastEvent({
                    title: 'Error',
                    message: 'An error occurred while creating the case',
                    variant: 'error',
                });
                this.dispatchEvent(event);
            });
    }
}