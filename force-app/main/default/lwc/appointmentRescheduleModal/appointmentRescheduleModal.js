import { LightningElement,api } from 'lwc';

export default class AppointmentRescheduleModal extends LightningElement {
    @api isOpen = false;
    @api appointmentId;

    newAppointmentDate = '';

    handleDateChange(event) {
        this.newAppointmentDate = event.target.value;
    }

    rescheduleAppointment() {
        // Call a method in your main LWC component to perform the rescheduling action
        this.dispatchEvent(new CustomEvent('reschedule', { detail: { appointmentId: this.appointmentId, newAppointmentDate: this.newAppointmentDate } }));
        this.isOpen = false;
    }
}