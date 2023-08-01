import { LightningElement, wire, api } from 'lwc';
import getRelatedRecordsForContact from '@salesforce/apex/myAppointment.RelatedRecordsController';

const columns = [
    { label: 'Name', fieldName: 'Name', type: 'text' },
    { label: 'Appointment Date', fieldName: 'Appointment_Date__c', type: 'Date' },
    { label: 'Doctor', fieldName: 'DoctorName',  type: 'text' },
    { label: 'Contact', fieldName: 'ContactName',  type: 'text'},
    { label: 'SlotsAvailable', fieldName: 'SlotsAvailable__c' },
    // Add more columns as needed for your related records
];

export default class MyAppointments extends LightningElement {

      @wire(getRelatedRecordsForContact, { contactId: '$contactId' })
  wiredAppointments({ error, data }) {
    if (data) {
      this.data = data.map(Appointment => ({
        ...Appointment,
        DoctorName: Appointment.Doctor__r.Name,
        ContactName: Appointment.Contact__r.Name
      }));
      this.error = undefined;
    } else if (error) {
      this.error = error;
      this.data = undefined;
    }
  }
    
    relatedRecords;
    columns = columns;

    handleTabActive() {
        this.fetchRelatedRecords();
    }

    fetchRelatedRecords() {
        // Assuming you have the Contact Id available in some way
        let contactId = '0035i00002Rt56RAAR'; // Replace with the actual Contact Id
        getRelatedRecordsForContact({ contactId: contactId })
            .then((result) => {
                this.relatedRecords = result;
            })
            .catch((error) => {
                // Handle the error, if needed
                console.error('Error fetching related records:', error);
            });
    }
}