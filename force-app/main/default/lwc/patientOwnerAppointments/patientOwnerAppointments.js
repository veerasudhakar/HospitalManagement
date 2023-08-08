import { LightningElement, wire, api,track } from 'lwc';
import Id from '@salesforce/user/Id';
import { getRecord } from 'lightning/uiRecordApi';
import UserNameFIELD from '@salesforce/schema/User.Name';
import userEmailFIELD from '@salesforce/schema/User.Email';
import userId from '@salesforce/schema/User.Id';
import RelatedRecordsController from '@salesforce/apex/myAppointment.RelatedRecordsController';

const COLUMNS = [
    { label: 'Contact Name', fieldName: 'Name', type: 'text' },
    { label: 'Email', fieldName: 'Email', type: 'email' },
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
    appointmentData = [];
    recordIdForm=''
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

    // @wire(RelatedRecordsController, { userEmail: '$currentUser' })
    // wiredRecords({ error, data }) {
    //     if (data) {
    //         this.defaultAppointmentData = data; // Store default data
    //         this.appointmentData = data; // Display data on component load
    //     } else if (error) {
    //         console.error('Error fetching data:', error);
    //     }
    // }
    @wire(RelatedRecordsController, { userEmail: '$currentUser' })
    wiredRecords({ error, data }) {
        if (data) {
            // this.data = data.map((record) => ({
            //     ...record,
            //     AppointmentName: record.Appointments__r ? record.Appointments__r[0].Name : '',
            // }));
            this.appointmentData = data
            console.log('appData',data)

        } else if (error) {
            console.error('Error fetching data:', error);
        }
    }

    handleRowAction(event) {
        const contactId = event.detail.row.Id;
      
    }

    appointmentHandleClick(event){
        this.recordIdForm=event.currentTarget.dataset.recordid
        console.log('this.recordIdForm',this.recordIdForm)
        // var rowIdofTable = this.template.querySelector('tr').key;
        // alert(rowIdofTable)
    }

    @track searchCriteria = '';

    handleSearchChange(event) {
        this.searchCriteria = event.target.value;
    }

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
    @wire(RelatedRecordsController, { userEmail:'$currentUser', searchCriteria: '$searchCriteria' })
    searchrecords({data, error} ){
        if (data) {
            this.appointmentData = data
          } else if (error) {
              this.error = error ;
          }

    }
  

    clearSearch() {
        this.searchCriteria = ''; // Clear the search criteria
        // this.appointmentData = []; // Clear the displayed data
        // this.refreshPage(); // Call method to refresh the page
    }

    // refreshPage() {
    //     // Reload the component to display the original data
    //     location.reload();
    // }

}