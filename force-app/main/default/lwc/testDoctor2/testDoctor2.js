import { LightningElement, wire ,track} from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getEventAttendees from '@salesforce/apex/DoctorRelatedAppointmentExample.getEventAttendees';
import cancelAppointments from '@salesforce/apex/DoctorRelatedAppointmentExample.cancelAppointment1';

import getListdataall from '@salesforce/apex/DoctorRelatedAppointmentExample.getListdata';
import { refreshApex } from '@salesforce/apex';

const COLUMNS = [
    { label: 'Appointment Name', fieldName: 'appName12' },
    { label: 'Patient Name', fieldName: 'Pname12' },
    { label: 'Start Date', fieldName: 'StartEndDate12' },
    { label: 'Email', fieldName: 'email12' },
    { label: 'Status', fieldName: 'status12' },
    {
        type: 'button',
        label: 'Cancel',
        typeAttributes: {
            label: 'Cancel',
            name: 'cancel',
            disabled: { fieldName: 'isDisabled' } // Disable the button based on field value
        }
    }
];


export default class TestDoctor2 extends LightningElement {
    columns = COLUMNS;
    appointments = [];

    @wire(getEventAttendees)
    wiredAppointments({ error, data }) {
        if (data) {
            this.appointments = data.map(appointment => ({
                ...appointment,
                isDisabled: appointment.status12 === 'Cancelled' // Set the disabled property based on status
            }));
        }
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;

        if (actionName === 'cancel') {
            this.cancelAppointment(row.Id);
        }
    }

    cancelAppointment(appointmentId) {
        cancelAppointments({ appointmentId })
            .then(() => {
                // Refresh the data after successful cancellation
                return refreshApex(this.wiredAppointments);
            })
            .catch(error => {
                console.error('Error cancelling appointment: ', error);
            });
    }
}