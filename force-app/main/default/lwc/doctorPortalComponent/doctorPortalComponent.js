import { LightningElement, wire, track } from 'lwc';
import getDoctorOptions from '@salesforce/apex/DoctorController123.getDoctorOptions';
import getPatientRecords from '@salesforce/apex/DoctorController123.getPatientRecords';

export default class DoctorPortalComponent extends LightningElement {
  @track selectedDoctorId;
  @track doctorOptions;
  @track patientRecords;

  // Retrieve doctor options for combobox
  @wire(getDoctorOptions)
  wiredDoctorOptions({ error, data }) {
    if (data) {
      this.doctorOptions = data;
    } else if (error) {
      console.error(error);
    }
  }

  // Handle doctor selection change
  handleDoctorSelection(event) {
    this.selectedDoctorId = event.target.value;
    this.loadPatientRecords();
  }

  // Load patient records based on selected doctor
  loadPatientRecords() {
    if (this.selectedDoctorId) {
      getPatientRecords({ doctorId: this.selectedDoctorId })
        .then((result) => {
          this.patientRecords = result;
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      this.patientRecords = null;
    }
  }
}