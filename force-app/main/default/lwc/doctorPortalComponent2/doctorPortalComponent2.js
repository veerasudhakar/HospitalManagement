import { LightningElement,track,wire } from 'lwc';
import getPatientRecordsByEmail from '@salesforce/apex/DoctorRelatedPatients.getPatientRecordsByEmail';
//import filterRecordsByCriteria from '@salesforce/apex/SampleController.filterRecordsByCriteria';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import Id from '@salesforce/user/Id';

import UserNameFIELD from '@salesforce/schema/User.Name';
import userEmailFIELD from '@salesforce/schema/User.Email';
export default class DoctorPortalComponent2 extends LightningElement {
@track patientRecords;



currentUserEmail
   @wire(getRecord, { recordId: Id, fields: [UserNameFIELD, userEmailFIELD]}) 
    currentUserInfo({error, data}) {
        if (data) {         
           this.currentUserEmail = data.fields.Email.value;
            console.log('data.fields.Name.value',data.fields.Name.value)
            console.log('data.fields.Email.value',data.fields.Email.value)
        } else if (error) {
            // this.error = error ;
            console.error(error)
        }
    }

    // filterCriteria;

    // @wire(filterRecordsByCriteria, { filterCriteria: '$filterCriteria' })
    // patientRecords;

    // handleFilterChange(event) {
    //     this.filterCriteria = event.target.value;
    // }


  @wire(getPatientRecordsByEmail,{ email: '$currentUserEmail' })
  ptData({data,error}){
    if(data){
      console.log('pt',data)
      this.patientRecords = data
    }else if(error){
       console.error(error);
    }
  }

  viewPatientHandleClick(event){
    console.log(event.target.value)
  }
}