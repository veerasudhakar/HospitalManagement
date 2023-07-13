import { LightningElement } from 'lwc';

export default class MyComponent extends LightningElement {
    handleButtonClick() {
        const recordForm = this.template.querySelector('lightning-record-form');
        recordForm.reset();
        recordForm.submit();
    }

    handleSuccess(event) {
        // Handle success event
        console.log('Record created/updated successfully:', event.detail.id);
    }

    handleCancel() {
        // Handle cancel event
        console.log('Record form cancelled by the user.');
    }
}