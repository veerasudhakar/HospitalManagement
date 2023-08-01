import { LightningElement, wire,api } from 'lwc';
import getAvailableSlots from '@salesforce/apex/PicklistController.getAvailableSlots';
export default class AppointmentCmp extends LightningElement {
 
  selectedDate;
    availableSlots;

    handleDateChange(event) {
        this.selectedDate = event.target.value;
        this.getSlots();
    }

    @wire(getAvailableSlots, { selectedDate: '$selectedDate' })
    slotsCallback({ error, data }) {
        if (data) {
            this.availableSlots = data.map(slot => {
                return { label: slot, value: slot };
            });
        } else if (error) {
            console.error(error);
        }
    }

    getSlots() {
        getAvailableSlots({ selectedDate: this.selectedDate })
            .then(result => {
                this.availableSlots = result.map(slot => {
                    return { label: slot, value: slot };
                });
            })
            .catch(error => {
                console.error(error);
            });
    }
}