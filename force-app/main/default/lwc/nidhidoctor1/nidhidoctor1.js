import { LightningElement, api, wire } from 'lwc';
import getBio from '@salesforce/apex/DoctorInfo.getBio';

export default class DoctorInfo extends LightningElement {
  @api recordId;
  doctor;

  @wire(getBio, { recordId: '$recordId' })
  wiredDoctor({ data, error }) {
    if (data) {
      this.doctor = data[0]; // Assuming you expect a single doctor record
    } else if (error) {
      console.error('Error fetching doctor information:', error);
    }
  }
}