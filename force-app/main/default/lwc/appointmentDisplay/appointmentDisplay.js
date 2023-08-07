import { LightningElement, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import getDoctorContacts from '@salesforce/apex/AppointmentController123.getDoctorContacts';
import getContactAppointments from '@salesforce/apex/AppointmentController123.getContactAppointments';

export default class AppointmentDisplay extends LightningElement {
    doctorContacts;
    contactAppointments;

    // Change the Doctor's Username based on your requirement
    doctorUsername = 'doctor.username@example.com';

    @wire(getDoctorContacts, { doctorUsername: '$doctorUsername' })
    wiredDoctorContacts({ error, data }) {
        if (data) {
            this.doctorContacts = data;
        } else if (error) {
            console.error(error);
        }
    }

    handleContactSelection(event) {
        const contactId = event.target.dataset.contactId;
        this.loadContactAppointments(contactId);
    }

    loadContactAppointments(contactId) {
        getContactAppointments({ contactId })
            .then(result => {
                this.contactAppointments = result;
            })
            .catch(error => {
                console.error(error);
            });
    }
}