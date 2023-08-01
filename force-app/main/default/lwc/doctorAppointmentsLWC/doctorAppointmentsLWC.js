import { LightningElement, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { getRecord } from 'lightning/uiRecordApi';
import getDoctorAppointments from '@salesforce/apex/AppointmentController.getDoctorAppointments';

export default class DoctorAppointmentsLWC extends LightningElement {
    @wire(CurrentPageReference) pageRef;

    doctorAppointments;
    error;

    connectedCallback() {
        // Get the doctor's email from the URL query parameters
        const doctorUserEmail = this.pageRef.state.c__doctorEmail;

        if (doctorUserEmail) {
            this.loadAppointments(doctorUserEmail);
        } else {
            this.error = 'Doctor email not provided in the URL.';
        }
    }

    loadAppointments(doctorUserEmail) {
        getDoctorAppointments({ doctorUserEmail })
            .then((result) => {
                this.doctorAppointments = result;
                this.error = undefined;
            })
            .catch((error) => {
                console.error('Error fetching doctor appointments:', error);
                this.error = 'Error fetching doctor appointments.';
            });
    }
}