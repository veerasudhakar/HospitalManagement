import { LightningElement,track,api } from 'lwc';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
//import createPatientRecord from '@salesforce/apex/AppointmentBookingController.createPatientRecord';
export default class AppointmentForPatient extends LightningElement {
  @track isModalOpen = false;
  @track isModalOpen1 = false;
    @track doctorFirstName = '';
    @track doctorLastName = '';
    @track firstName = '';
    @track lastName = '';
    @track address = '';
    @track email = '';
    //@track selectedDate = '';
    //@track availableSlots = [];
    @track isDisabled = true;

    selectedDate;
  availableSlots;
  @track errorMsg;

    // Handle opening the modal
    handleOpenModal() {
        this.isModalOpen = true;
    }
    

    // Handle closing the modal
    closeModal() {
        this.isModalOpen = false;
    }

    // Handle changes in the First Name field
    handleNameChange(event) {
        this.firstName = event.target.value;
    }

    // Handle changes in the Last Name field
    handlelastnameinp(event) {
        this.lastName = event.target.value;
    }

    // Handle changes in the Address field
    handleaddressinp(event) {
        this.address = event.target.value;
    }

    // Handle changes in the Email field
    handleemailinput(event) {
        this.email = event.target.value;
    }

    // Handle changes in the Date field
    // handleDateChange(event) {
    //     this.selectedDate = event.target.value;
    // }
    
  handleDateChange(event) {
    this.selectedDate = event.target.value;
    console.log('the doc id to pass' + this.doctorId);
    //this.getSlots();
    // Compare the selected date with the current date
    const selectedDate = new Date(this.selectedDate);
    //const currentDate = new Date(Today);

    if (selectedDate < new Date().setHours(0, 0, 0, 0) && selectedDate.toDateString() !== new Date().toDateString()) {
      this.availableSlots = ''
      // Set an error message to display on the field
      this.errorMsg = '';
      this.dispatchEvent(
        new ShowToastEvent({
          title: 'Check appointment date',
          message: 'Invalid appointment date please select the date from the current date forward',
          variant: 'error'
        })
      );
      console.log(this.errorMsg);
      // alert('Dont choose date less than today');
      // this.availableSlots = '';

    } else {
      this.errorMsg = ''; // Clear the error message if the selected date is valid
      this.doctorId = this.doctorId;
      
      console.log('doctor id was ' + this.doctorId);
      this.getSlots();
    }
  }
getSlots() {
    console.log('doc id ' + this.doctorId);
    getAvailableSlots({ selectedDate: this.selectedDate, doctorid: this.doctorId })
      .then(result => {
        console.log('slotsss....'+result);
        this.availableSlots = result.map(slot => {
          return { label: slot, value: slot };
        });
      })
      .catch(error => {
        console.error(error);
      });
  }

    // Handle slot selection
    handleSlotSelection(event) {
        // Retrieve the selected slot
        const selectedSlot = event.detail.value;
        // Update the isDisabled flag based on the slot selection
        this.isDisabled = !selectedSlot;
    }

    // Handle confirming the appointment
    handleConfirmAppointment() {
        // Perform the logic to insert the patient record
        // Add your code here to insert the patient record using Apex or other means

        // Close the modal after confirming the appointment
        this.isModalOpen = false;
    }
     renderedCallback() {
    var today = new Date();
    var time = today.getHours()
    console.log('time---' + time)
    if (today.getHours() >= 10 && today.getHours() <= 13) {
      this.active = true;
    } else if (today.getHours() >= 17 && today.getHours() <= 21) {
      this.active = true;
    }
    else {
      this.active = false;
    }

  }
  handleConfirmAppointment(event) {
    const selectedDate = new Date(this.selectedDate);
    const currentDate = new Date();
    // Check if input fields are not null
    console.log('selectedDate  ',this.selectedDate)


    if (selectedDate > new Date().setHours(0, 0, 0, 0) ||  selectedDate.toDateString() == new Date().toDateString()) {

      if (this.firstname && this.lastName && this.email && this.address && this.conNum && this.selectedSlot) {

        // Create contact object
        var contact = { sobjectType: 'Contact' };
        contact.Consult_doctor__c = this.doctorId;
        console.log('consultant doctor id was ' + this.doctorId);
        contact.FirstName = this.firstname;
        contact.LastName = this.lastName;
        contact.Email = this.email;
        contact.MailingStreet = this.address;
        contact.Phone = this.conNum;
        //contact.Appointment_Date__c = this.myDatetime;
        console.log('doc id on selecting appointment ' + this.selectedDate);
        contact.Appointment_Date__c = this.selectedDate;
        contact.SlotsAvailable__c = this.selectedSlot;
        contact.AccountId=this.accountName
        console.log('patient slot booking date ' + this.selectedDate);
        // Call Apex method to save contact 
        



        if (this.selectedDate != null) {
          saveContact({ patientContact: contact })
            .then(result => {
              // Handle successful save
              this.dispatchEvent(
                new ShowToastEvent({
                  title: 'Success',
                  message: 'Appointment Applied Succesfully',
                  variant: 'success'
                })
              );
              this.closeModal();
              window.location.reload();
               
            })
            .catch(error => {
              // Handle error
              this.dispatchEvent(
                new ShowToastEvent({
                  title: 'Error',
                  message: error.body.message,
                  variant: 'error'
                })
              );
            });
        }



      } else {
        // Show error message if input fields are null
        this.dispatchEvent(
          new ShowToastEvent({
            title: 'Fields cannot be empty',
            message: 'Please fill in all required fields',
            variant: 'sticky'
          })
        );
      }
    } else {
      alert('Invalid appointment date please select the date from the current date forward ');
    }




// this.handlebookappointment();
  }
}