import { LightningElement, track, wire } from 'lwc';
import fetchContactFieldSetData from '@salesforce/apex/ContactFieldSetController.fetchContactFieldSetData';
import getFieldSet from '@salesforce/apex/ContactFieldSetController.getFieldSet';


export default class ContactLWC extends LightningElement {
    @track data;
    @track columns;
    @track error;

    @wire(getFieldSet, { sObjectName: 'Contact', fieldSetName: 'contact_Feild_Set' })
    wiredFields({ error, data }) {
        if (data) {
            data = JSON.parse(data);
            console.log(data);
            let cols = [];
            data.forEach(currentItem => {
                let col = { label: currentItem.label, fieldName: currentItem.name };
                cols.push(col);
            });
            this.columns = cols;
        } else if (error) {
            console.log(error);
            this.error = error;
            this.columns = undefined;
        }
    }

    @wire(fetchContactFieldSetData, {})
    wiredAccounts({ error, data }) {
        if (data) {
            this.data = data;
            console.log(this.data);
        } else if (error) {
            console.log(error);
            this.error = error;
            this.data = undefined;
        }
    }

    get isColumnsDataAvailable() {
        return this.data && this.columns;
    }
}