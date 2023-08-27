import { LightningElement, wire, api,track } from 'lwc';
import Id from '@salesforce/user/Id';
import { getRecord } from 'lightning/uiRecordApi';
import UserNameFIELD from '@salesforce/schema/User.Name';
import userEmailFIELD from '@salesforce/schema/User.Email';
import userId from '@salesforce/schema/User.Id';
// import { updateRecord } from 'lightning/uiRecordApi';
import RelatedRecordsController from '@salesforce/apex/myAppointment.RelatedRecordsController';
import getAvailableSlots from '@salesforce/apex/myAppointment.getAvailableSlots';
import rescheduleAppointment from '@salesforce/apex/myAppointment.rescheduleAppointment';
import cancelAppointment from '@salesforce/apex/myAppointment.cancelAppointment';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
// import APPOINTMENT_DATE_FIELD from '@salesforce/schema/Appointment__c.Appointment_Date__c';
// import STATUS_FIELD from '@salesforce/schema/Appointment__c.Status__c';

const COLUMNS = [
    { label: 'Contact Name', fieldName: 'Name', type: 'text' },
    { label: 'Email', fieldName: 'Email', type: 'email' },
    // { label: 'Phone', fieldName: 'Phone', type: 'Phone' },
    { label: 'Gender', fieldName: 'Gender__c', type: 'text' },
    { label: 'Date of Birth', fieldName: 'Date_Of_Birth__c', type: 'date' },
    { label: 'Age', fieldName: 'Age__c', type: 'number' },
    { label: 'Appointment Name', fieldName: 'AppointmentName', type: 'text', sortable: true },
    { label: 'Appointment Date', fieldName: 'Appointment_Date__c', type: 'date' },
    { label: 'Slots Available', fieldName: 'SlotsAvailable__c', type: 'text' },
    { label: 'Status', fieldName: 'Status__c', type: 'text' },
];
export default class PatientOwnerAppointments extends LightningElement {
     currentUser;
    columns = COLUMNS;
    @track appointmentData = [];
   @track initialLoad = true; 

    recordIdForm=''

    @track filterCriteria = 'all';
    availableSlots
    //defaultAppointmentData = [];
    //contactId

    @wire(getRecord, { recordId: Id, fields: [UserNameFIELD, userEmailFIELD, userId ]}) 
    currentUserInfo({error, data}) {
        if (data) {
          this.currentUser = data.fields.Email.value
        } else if (error) {
            this.error = error ;
        }
    }

    handleFilterChange(event) {
        this.filterCriteria = event.target.value;
        this.applyFilter();
    }

    //For the Date Functionality
    
    unfilteredData = [];
    @track selectedFilterDate = '';

    handleDateFilterChange(event) {
        this.selectedFilterDate = event.target.value;
        this.applyDateFilter();
        console.log('this.selectedFilterDate', this.selectedFilterDate);
      //   if (this.selectedFilterDate === '' || this.selectedFilterDate === null) {
      //     this.appointmentData = this.unfilteredData;
      // } else {
      //     this.applyDateFilter();
      // }
      
    }

    applyDateFilter() {
        if (!this.selectedFilterDate) {
            // If no filter date is selected, show all records
            this.appointmentData = [...this.unfilteredData];
        } else {
            // Filter records based on the selected date
            this.appointmentData = this.unfilteredData.filter(record => {
                return record.Appointment_Date__c === this.selectedFilterDate;
            });
        }
      
    }

    clearDateFilter() {
      // Clear the selected date and show all records
      this.selectedFilterDate = '';
        this.appointmentData = [...this.unfilteredData];
  }

    //clear the Date filter
    
    //For The Slots and doctor id and Appointment Id
     // for the selected date Functionality
  handleDateChange(event) {
    this.selectedDate = event.target.value;
    //console.log('the doc id to pass' + this.doctorId);
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
      //this.doctorId = this.doctorId;

      //console.log('doctor id was ' + this.doctorId);
      this.getSlots();
    }
  }
  selectedSlot;
  handleSlotSelection(event) {
    this.selectedSlot = event.target.value;
    console.log('Selected time slot:', this.selectedSlot);
  }

  doctorIdap
  getSlots() {
    console.log('doc id ' + this.doctorIdap);
    
    getAvailableSlots({ selectedDate: this.selectedDate, doctorid: this.doctorIdap})
      .then(result => {
        console.log('slotsss....' + result);
        this.availableSlots = result.map(slot => {
          return { label: slot, value: slot };
        });

      })
      .catch(error => {
        console.error(error);
      });
  }


    handleReschedule(event) {
        const appointmentId = event.currentTarget.dataset.recordid;
        this.recordIdForm = appointmentId;
       this.doctorIdap=event.target.value
        this.showModal = true;
    }

    @track showModal = false;

    hideModalBox() {
        this.showModal = false;
        // this.newAppointmentDate = '';
    }

    confirmReschedule() {
        this.showModal = false;
        rescheduleAppointment({appointmentId:this.recordIdForm,newAppointmentDate:this.selectedDate,newSlot:this.selectedSlot})
        .then(()=>{
            refreshApex(this.resultData);
            this.dispatchEvent(
                new ShowToastEvent({
                  title: 'Success',
                  message: 'Appointment Rescheduled Successfully',
                  variant: 'success'
                })
              );
            console.log('success')
            this.showModal = false;
        })
        .catch(error=>{
            console.log(error)
        })
       
    }

    //Cancel Appointment
    @track showCancelModal = false;
    // @track cancelReason = '';
    @track cancelOthers = '';

    

    handleCancelAppointment(event) {
      const appointmentId = event.currentTarget.dataset.recordid;
      this.recordIdForm = appointmentId;
      this.showCancelModal = true;
  }

  value = 'Forgetting about the appointment';

  get options() {
    return [
        { label: 'Forgetting about the appointment', value: 'Forgetting about the appointment' },
        { label: 'Work-related issues', value: 'Work-related issues' },
        { label: 'Not notified about the appointment', value: 'Not notified about the appointment' },
        { label: 'Transportation', value: 'Transportation' },
    ];
}

handleCancelReasonChange(event) {
    this.value = event.target.value;
    console.log(event.target.value);
}

handleCancelOthersChange(event) {
    this.cancelOthers = event.target.value;
}

hideCancelModal() {
    this.showCancelModal = false;
    this.cancelReason = '';
    this.cancelOthers = '';
}

confirmCancellation() {
    // Call the Apex method to cancel the appointment with reason and other details
    cancelAppointment({
        appointmentId: this.recordIdForm,
        reason: this.value,
        others: this.cancelOthers
    })
    .then(() => {
        console.log('Appointment canceled successfully');
        refreshApex(this.resultData);
        // Display a success toast
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Appointment Cancelled Successfully',
                variant: 'success'
            })
        );
       this.showCancelModal = false;
    })
    .catch(error => {
        console.error('Error canceling appointment:', error);
        // Display an error toast
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error',
                message: 'An error occurred while canceling the appointment.',
                variant: 'error'
            })
        );
    });
}
    // cancelAppointmentHandler(event) {
    //     const appointmentId = event.currentTarget.dataset.recordid;
    
        
    //     cancelAppointment({ appointmentId:appointmentId })
    //         .then(() => {
    //             console.log('Appointment canceled successfully');
    //             refreshApex(this.resultData);
    //             this.dispatchEvent(
    //                 new ShowToastEvent({
    //                   title: 'Success',
    //                   message: 'Appointment Cancelled Successfully',
    //                   variant: 'success'
    //                 })
    //               );
                
    //         })
    //         .catch(error => {
    //             console.error('Error canceling appointment:', error);
    //         });
    // }
   

    

    // @wire(RelatedRecordsController, { userEmail: '$currentUser' })
    // wiredRecords({ error, data }) {
    //     if (data) {
    //         this.defaultAppointmentData = data; // Store default data
    //         this.appointmentData = data; // Display data on component load
    //     } else if (error) {
    //         console.error('Error fetching data:', error);
    //     }
    // }

    //BUttons for the Disable

    isButtonDisabled(status) {
        return status === 'Completed' || status === 'Cancelled';
    }

    resultData

    @wire(RelatedRecordsController, { userEmail: '$currentUser', filter: '$filterCriteria' })
    wiredRecords(result) {
    this.resultData=result
        if (result.data) {
            this.unfilteredData = result.data.map(record => ({
                ...record,
                isRescheduleButtonDisabled: this.isButtonDisabled(record.Status__c) || record.Appointment_Date__c < new Date().toISOString().split('T')[0],
                isCancelButtonDisabled: this.isButtonDisabled(record.Status__c) || record.Appointment_Date__c < new Date().toISOString().split('T')[0]
            }));
            this.appointmentData = result.data.map(record => ({
                ...record,
                isRescheduleButtonDisabled: this.isButtonDisabled(record.Status__c),
                isCancelButtonDisabled: this.isButtonDisabled(record.Status__c)
            }));
            this.appointmentData = [...this.unfilteredData];
           // this.appointmentData = data
            console.log('appData',result.data)

            if (this.initialLoad) {
                this.initialLoad = false;
            } else {
                this.applyFilter();
            }
        } else if (result.error) {
            console.error('Error fetching data:', result.error);
        }
    }

    

    // handleRowAction(event) {
    //     const contactId = event.detail.row.Id;
      
    // }
    @track showDoctorField = false; // New variable to track the visibility of the Doctor field
    @track selectedDoctor = '';

    appointmentHandleClick(event){
        this.recordIdForm=event.currentTarget.dataset.recordid
        console.log('this.recordIdForm',this.recordIdForm)
        // var rowIdofTable = this.template.querySelector('tr').key;
        // alert(rowIdofTable)
        this.showDoctorField = true;
        this.selectedDoctor = event.target.dataset.doctorname;
        
    }

    
    

    @track searchCriteria = '';

    handleSearchChange(event) {
        this.searchCriteria = event.target.value.toLowerCase();
    
        if (this.searchCriteria === '' || this.searchCriteria === null) {
            this.relatedData = this.unfilteredData;
        } else {
            this.applyFilter();
        }
    }
    
    
    
    applyFilter() {
        if (this.unfilteredData && this.unfilteredData.length > 0) {
            refreshApex(this.unfilteredData);
            const filteredData = this.unfilteredData.filter(record => {
                const lowerCaseStatus = record.Status__c ? record.Status__c.toLowerCase() : '';
                return (
                    record.Name.toLowerCase().includes(this.searchCriteria) ||
                    lowerCaseStatus.includes(this.searchCriteria) ||
                    (record.Doctor__r && record.Doctor__r.Specialty__c.toLowerCase().includes(this.searchCriteria)) ||
                    (record.Doctor__r && record.Doctor__r.Name.toLowerCase().includes(this.searchCriteria))
                );
            });
    
            this.appointmentData = filteredData;
        }
//This is the Date Filter Functionality 

        // if (this.unfilteredData && this.unfilteredData.length > 0) {
        //     refreshApex(this.unfilteredData);
        //     let filteredData = this.unfilteredData;

        //     if (this.filterCriteria === 'today') {
        //         const today = new Date().toISOString().split('T')[0];
        //         filteredData = filteredData.filter(record => {
        //             return record.Appointment_Date__c === today && !this.isButtonDisabled(record.Status__c);
        //         });
        //     } else if (this.filterCriteria === 'week') {
        //         const today = new Date();
        //         const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
        //         const endOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (6 - today.getDay()));
        //         filteredData = filteredData.filter(record => {
        //             const appointmentDate = new Date(record.Appointment_Date__c);
        //             return appointmentDate >= startOfWeek && appointmentDate <= endOfWeek && !this.isButtonDisabled(record.Status__c);
        //         });
        //     } else {
        //         filteredData = filteredData.filter(record => !this.isButtonDisabled(record.Status__c));
        //     }

        //     this.appointmentData = filteredData;
        // }
    }
    
    
    
    // applyFilter() {
    //     if (this.unfilteredData && this.unfilteredData.length > 0) {
    //         const filteredData = this.unfilteredData.filter(record => {
    //             return (
    //                 record.Name.toLowerCase().includes(this.searchCriteria) ||
    //                 (record.Status__c.toLowerCase().includes(this.searchCriteria)) ||
    //                 (record.Doctor__r && record.Doctor__r.Specialty__c.toLowerCase().includes(this.searchCriteria)) ||
    //                 (record.Doctor__r && record.Doctor__r.Name.toLowerCase().includes(this.searchCriteria))
                   
    //             );
    //         });
    
    //         this.appointmentData = filteredData;
    //     }
    // }

    // @wire(RescrescheduleAppointment, { appointmentId: '$selectedAppointmentId', newAppointmentDate: '$newAppointmentDate' })
    // rescheduleResult({ error, data }) {
    //     if (data) {
    //         // Handle successful rescheduling, maybe refresh data or show a success message
    //         this.showModal = false;
    //         this.selectedAppointmentId = null;
    //         this.newAppointmentDate = null;
    //     } else if (error) {
    //         // Handle error, maybe show an error message
    //     }
    // }

    // handleReschedule(event) {
    //     const appointmentId = event.detail.appointmentId;
    //     const newAppointmentDate = event.detail.newAppointmentDate;

    //     this.selectedAppointmentId = appointmentId;
    //     this.newAppointmentDate = newAppointmentDate;
    // }

    // searchAppointments() {
    //     // Call the server method with the search criteria
    //     RelatedRecordsController({ userEmail: this.currentUser, searchCriteria: this.searchCriteria })
    //         .then(result => {
    //             this.appointmentData = result;
    //         })
    //         .catch(error => {
    //             console.error('Error fetching data:', error);
    //         });
    // }
    // @wire(RelatedRecordsController, { userEmail:'$currentUser', searchCriteria: '$searchCriteria' })
    // searchrecords({data, error} ){
    //     if (data) {
    //         this.appointmentData = data
    //       } else if (error) {
    //           this.error = error ;
    //       }

    // }
  

    // clearSearch() {
    //     this.searchCriteria = ''; // Clear the search criteria
    //     // this.appointmentData = []; // Clear the displayed data
    //     // this.refreshPage(); // Call method to refresh the page
    // }

    // refreshPage() {
    //     // Reload the component to display the original data
    //     location.reload();
    // }

}
