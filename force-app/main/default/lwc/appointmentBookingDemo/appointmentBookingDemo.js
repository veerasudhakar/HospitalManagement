import { LightningElement, wire, api, track } from 'lwc';
import { getRecord, getFieldValue, updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import CONTACT_OBJECT from '@salesforce/schema/Contact';
import APPOINTMENT_OBJECT from '@salesforce/schema/Appointment__c';

const FIELDS = [
  'Contact.Name',
  'Contact.Email',
  'Contact.MobilePhone',
  // Add other contact fields as needed
];

const APPOINTMENT_FIELDS = [
  'Appointment__c.Name',
  'Appointment__c.Appointment_Date__c',
  'Appointment__c.SlotsAvailable__c',
  // Add other appointment fields as needed
];

export default class AppointmentBooking extends LightningElement {
  @api recordId; // Contact Id for existing appointments

  @track contact = {};
  @track appointment = {};
  @track isNewAppointment = false;
  @track isExistingAppointment = false;

  @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
  wiredContact({ error, data }) {
    if (data) {
      this.contact = { ...data.fields };
    } else if (error) {
      console.error('Error loading contact', error);
    }
  }

  @wire(getRecord, { recordId: '$recordId', fields: APPOINTMENT_FIELDS })
  wiredAppointment({ error, data }) {
    if (data) {
      this.appointment = { ...data.fields };
      this.isExistingAppointment = true;
    } else if (error) {
      // New appointment (no existing record found)
      this.isNewAppointment = true;
    }
  }

  get appointmentDate() {
    return getFieldValue(this.appointment, 'Appointment__c.Appointment_Date__c');
  }

  get slotsAvailable() {
    return getFieldValue(this.appointment, 'Appointment__c.SlotsAvailable__c');
  }

  bookAppointment() {
    // Implement booking logic here
    // For example, create a new Appointment record using the data from the component and the selected Contact (this.contact.Id)
    // After successful booking, show a toast message and navigate to a success page

    // Sample toast message
    this.dispatchEvent(
      new ShowToastEvent({
        title: 'Success',
        message: 'Appointment booked successfully!',
        variant: 'success',
      })
    );
  }

  editAppointment() {
    // Enable edit mode for appointment fields
    // Implement update logic when the user edits the appointment details and saves

    // Sample toast message
    this.dispatchEvent(
      new ShowToastEvent({
        title: 'Success',
        message: 'Appointment updated successfully!',
        variant: 'success',
      })
    );
  }
}