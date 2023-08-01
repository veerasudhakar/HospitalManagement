import { LightningElement, wire } from 'lwc';
import validatePhone from '@salesforce/apex/PhoneValidationController.validatePhone';

export default class PhoneField extends LightningElement {
  phoneNumber;

  handleChange(event) {
    const input = event.target;
    const value = input.value;

    // Remove any non-numeric characters from the input value
    const numericValue = value.replace(/\D/g, '');

    // Update the input value with the numeric-only value
    input.value = numericValue;

    // Store the numeric value in the component property
    this.phoneNumber = numericValue;

    // Perform server-side validation
    validatePhone({ phoneNumber: this.phoneNumber })
      .then(result => {
        // Handle the validation result
        if (!result.isValid) {
          // Display an error message to the user
          input.setCustomValidity(result.errorMessage);
          input.reportValidity();
        } else {
          // Clear any previous error messages
          input.setCustomValidity('');
          input.reportValidity();
        }
      })
      .catch(error => {
        // Handle any errors that occur during the server-side validation
        console.error('Error during phone validation:', error);
      });
  }
}