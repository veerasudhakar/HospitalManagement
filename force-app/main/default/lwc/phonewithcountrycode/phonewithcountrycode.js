import { LightningElement , track } from 'lwc';
export default class Phonewithcountrycode extends LightningElement {
@track phoneNumber;
  @track countryCode;
  
  countryCodes = [
    { label: '+1', value: '1' },
    { label: '+91', value: '91' },
    // Add more country codes as needed
  ];
  
  handlePhoneNumberChange(event) {
    this.phoneNumber = event.target.value;
  }
  
  handleCountryCodeChange(event) {
    this.countryCode = event.target.value;
  }
}