import { LightningElement,wire } from 'lwc';
import getPatients from '@salesforce/apex/Patientdatacontroller.getPatients';
const columns = [
    { label: 'Patient ID', fieldName: 'Name', type: '	Auto Number' },
    { label: 'First Name', fieldName: 'First_Name__c', type: 'text' },
    { label: 'Last Name', fieldName: 'Last_Name__c', type: 'text' },
    { label: 'Age', fieldName: 'Age__c', type: 'Number' },
    { label: 'Email', fieldName: 'Email__c', type: 'Email' },
    { label: 'Status', fieldName: 'Status__c', type: 'Picklist' },
];
export default class Doctordatatable extends LightningElement {
     columns = columns;
    patientData = [];

    @wire(getPatients)
    wiredPatients({ error, data }) {
        if (data) {
            this.patientData = data;
        } else if (error) {
            // Handle error
            console.error(error);
        }
    }
}