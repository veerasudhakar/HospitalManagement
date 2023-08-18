import { LightningElement, wire, track } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
// import { loadStyle } from 'lightning/platformResourceLoader';
// import STYLES from '@salesforce/resourceUrl/styles';
import Id from '@salesforce/user/Id';
import UserIDFIELD from '@salesforce/schema/User.Id';
import getRelatedData from '@salesforce/apex/DoctorRelatedAppointments.getRelatedData';
//import filterRecordsByCriteria from '@salesforce/apex/SampleController.filterRecordsByCriteria';
const FIELDS = [
    // Add the necessary fields from the Appointment__c object that you want to display
    'Appointment__c.Id',
    'Appointment__c.Name',
    'Appointment__c.Doctor__c',
    'Appointment__c.Appointment_Date__c',
    'Appointment__c.SlotsAvailable__c',
    'Appointment__c.Status__c',
    'Appointment__c.Doctor__r.Name',
    'Appointment__c.Doctor__r.Email__c',
    'Appointment__c.Doctor__r.user__c',
    'Appointment__c.Contact__r.Name',
    'Appointment__c.Contact__r.Email',
];

 

export default class DoctorRelatedAppointments extends LightningElement {

   // @track relatedData;
   @track filterCriteria = 'all';
   @track initialLoad = true; 

@track relatedData = [];
@track unfilteredData = [];
// @track filteredRelatedData = [];
  currentUserId
  recordIdForm=''

 

    @wire(CurrentPageReference)
    currentPageReference;

 

    @wire(getRecord, {recordId: Id,fields: [UserIDFIELD] })
      currentUserInfo({error, data}) {
        if (data) {
             this.currentUserId= data.fields.Id.value;            

 

            console.log('data.fields.Id.value',data.fields.Id.value)
        } else if (error) {
            // this.error = error ;
            console.error(error)
        }
      }

      handleFilterChange(event) {
        this.filterCriteria = event.target.value;
        this.applyFilter();
    }

   

    @wire(getRelatedData, { userId: '$currentUserId', filter: '$filterCriteria' })
    wiredRelatedData({ error, data }) {
        if (data) {
            this.unfilteredData = data; // Store the unfiltered data
            this.relatedData = data;
            if (this.initialLoad) {
                this.initialLoad = false;
            } else {
                this.applyFilter();
            }
        } else if (error) {
            // Handle error
        }
    }

// wiredRelatedData({ error, data }) {
//     if (data) {
//         this.relatedData = data;
//         if (this.initialLoad) {
//             this.initialLoad = false; // Set the flag to false after initial load
//         } else {
//             this.applyFilter(); // Apply filter when data is received or filter criteria changes
//         }
//         // this.applyFilter(); // Apply filter when data is received or filter criteria changes
//     } else if (error) {
//         // Handle error
//     }
// }

// connectedCallback() {
//     loadStyle(this, STYLES)
//         .then(() => {
//             console.log('Styles loaded successfully.');
//         })
//         .catch(error => {
//             console.log('Error loading styles:', error);
//         });
// }

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
        const filteredData = this.unfilteredData.filter(record => {
            return (
                record.Name.toLowerCase().includes(this.searchCriteria) ||
                record.Status__c.toLowerCase().includes(this.searchCriteria) ||
                (record.Contact__r && record.Contact__r.Name.toLowerCase().includes(this.searchCriteria))
            );
        });

        this.relatedData = filteredData;
    }
}



// handleSearchChange(event) {
//     this.searchCriteria = event.target.value.toLowerCase();
//     this.applyFilter(); // Call applyFilter to update the displayed data
// }

// applyFilter() {
//     if (this.relatedData && this.relatedData.length > 0) {
//         const filteredData = this.relatedData.filter(record => {
//             return (
//                 record.Name.toLowerCase().includes(this.searchCriteria) ||
//                 record.Status__c.toLowerCase().includes(this.searchCriteria) ||
//                 (record.Contact__r && record.Contact__r.Name.toLowerCase().includes(this.searchCriteria))
//             );
//         });

//         this.relatedData = filteredData;
//     }
//     else{
//         this.filteredRelatedData = this.relatedData;
//     }
// }


appointmentHandleClick(event){
    this.recordIdForm=event.currentTarget.dataset.recordid
    console.log('this.recordIdForm',this.recordIdForm)
    // var rowIdofTable = this.template.querySelector('tr').key;
    // alert(rowIdofTable)
}


}