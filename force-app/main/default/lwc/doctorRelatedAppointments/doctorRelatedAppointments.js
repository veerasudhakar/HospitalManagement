import { LightningElement, wire, track } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
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

@track relatedData;
  currentUserId

 

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
        this.relatedData = data;
        if (this.initialLoad) {
            this.initialLoad = false; // Set the flag to false after initial load
        } else {
            this.applyFilter(); // Apply filter when data is received or filter criteria changes
        }
        this.applyFilter(); // Apply filter when data is received or filter criteria changes
    } else if (error) {
        // Handle error
    }
}


// filterCriteria;
//     @wire(getRelatedData, { userId: '$currentUserId' })
//     wiredRelatedData({ error, data }) {
//         if (data) {
//             console.log('data',this.relatedData)
//             this.relatedData = data;
//         } else if (error) {
//             // Handle error
//         }
//     }


}