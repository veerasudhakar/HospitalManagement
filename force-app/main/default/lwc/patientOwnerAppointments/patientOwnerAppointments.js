import { LightningElement, wire, api } from 'lwc';
import Id from '@salesforce/user/Id';
import { getRecord } from 'lightning/uiRecordApi';
import UserNameFIELD from '@salesforce/schema/User.Name';
import userEmailFIELD from '@salesforce/schema/User.Email';
import userId from '@salesforce/schema/User.Id';
import RelatedRecordsController from '@salesforce/apex/myAppointment.RelatedRecordsController';

const COLUMNS = [
    { label: 'Contact Name', fieldName: 'Name', type: 'text' },
    { label: 'Email', fieldName: 'Email', type: 'email' },
    { label: 'Gender', fieldName: 'Gender__c', type: 'text' },
    { label: 'Date of Birth', fieldName: 'Date_Of_Birth__c', type: 'date' },
    { label: 'Age', fieldName: 'Age__c', type: 'number' },
    { label: 'Appointment Name', fieldName: 'AppointmentName', type: 'text', sortable: true },
    { label: 'Appointment Date', fieldName: 'Appointment_Date__c', type: 'date' },
    { label: 'Slots Available', fieldName: 'SlotsAvailable__c', type: 'text' },
    { label: 'Status', fieldName: 'Status__c', type: 'text' },
];
export default class PatientOwnerAppointments extends LightningElement {
     currentUser;
    columns = COLUMNS;
    appointmentData = [];
    //contactId

    @wire(getRecord, { recordId: Id, fields: [UserNameFIELD, userEmailFIELD, userId ]}) 
    currentUserInfo({error, data}) {
        if (data) {
          this.currentUser = data.fields.Email.value
        } else if (error) {
            this.error = error ;
        }
    }

    @wire(RelatedRecordsController, { userEmail: '$currentUser' })
    wiredRecords({ error, data }) {
        if (data) {
            // this.data = data.map((record) => ({
            //     ...record,
            //     AppointmentName: record.Appointments__r ? record.Appointments__r[0].Name : '',
            // }));
            this.appointmentData = data
            console.log('appData',data)

        } else if (error) {
            console.error('Error fetching data:', error);
        }
    }

    handleRowAction(event) {
        const contactId = event.detail.row.Id;
      
    }

    appointmentHandleClick(event){
        var rowIdofTable = this.template.querySelector('tr').key;
        alert(rowIdofTable)
    }

}