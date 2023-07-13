import { LightningElement , wire , track} from 'lwc';
import getallrescheduleappointments from '@salesforce/apex/RescheduleAppointmentcls_08_06.methodgetappointments';


import getAvailableSlots from '@salesforce/apex/RescheduleAppointmentcls_08_06.methodslots';
import updateRecordData from '@salesforce/apex/RescheduleAppointmentcls_08_06.confirmingreschedulemethod';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class RescheduleComponent extends LightningElement {
doctorid
selectedRowId;
selectedDate
  @track isPopupVisible = false;

  @track isShowModal = false;

inputEmail = 'nilivinod143@gmail.com';
@track myappointmentsare ;

@wire(getallrescheduleappointments , {email :'$inputEmail'})
allmyrelatedappointments({error , data }){
if(data){
console.log(data);
this.myappointmentsare = data;

}else if(error){
console.log('no data');
}
}

 availableSlots;
 handleDateChange(event) {
     this.selectedDate = event.target.value;
   //  console.log('doctor id was '+this.doctorId)
     var rowId = event.target.dataset.id; // Access the row ID from the dataset
      this.doctorId = rowId 
  // Perform any logic or action with the selected date and row ID
  console.log('Selected Date: ' + this.selectedDate);
  console.log('Row ID: ' +  this.doctorId);
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




 selectedSlot;
  handleSlotSelection(event) {
    this.selectedSlot = event.target.value;
    console.log('Selected time slot:', this.selectedSlot);
  }


patientid ;
handleClick(event) {
   
   const rowId = event.target.dataset.id;
   var appointmentId = event.target.dataset.string;
   this.patientid = appointmentId;
   console.log('patientidwas'+appointmentId);
  this.selectedRowId = rowId; // Store the row ID in a class variable
  this.isShowModal = true;
}


getSlots() {
  //  console.log('doc id ' + this.doctorId);
  console.log('the doc id was in getting slots '+this.doctorId)
    getAvailableSlots({ selectedDate: this.selectedDate ,  doctorid: this.doctorId })
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



closePopup(){
   this.isPopupVisible = false; 
}
hideModalBox() {  
        this.isShowModal = false;
    }

handleconfirmToo(){
  
      console.log(this.patientid);
      //alert('date '+this.selectedDate+'slot'+this.selectedSlot);
      
          updateRecordData({patientId:this.patientid, selectedDate: this.selectedDate , selectedslot:this.selectedSlot})
      .then(result => {
        // Handle the response from Apex, if needed
        console.log('Record updated successfully');
        this.showToast('Success', 'Record updated successfully', 'success');
        
      })
      .catch(error => {
        // Handle any error that occurs during the Apex call
        console.error(error);
        this.showToast('Error', 'An error occurred while updating the record', 'error');
      });
      this.isPopupVisible = false;
      this.isShowModal = false;
 }

       
    handleConfirmReschedule(){
      this.isShowModal = false;
      this.isPopupVisible = true;
      
  }

  showToast(title, message, variant) {
    const toastEvent = new ShowToastEvent({
      title: title,
      message: message,
      variant: variant
    });
    this.dispatchEvent(toastEvent);
  }
    }