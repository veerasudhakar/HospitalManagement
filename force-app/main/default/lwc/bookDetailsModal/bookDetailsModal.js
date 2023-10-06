import { LightningElement,api } from 'lwc';

export default class BookDetailsModal extends LightningElement {

    @api book;

    closeModal() {
        // Dispatch an event to close the modal
        const closeModalEvent = new CustomEvent('closemodal');
        this.dispatchEvent(closeModalEvent);
    }
}