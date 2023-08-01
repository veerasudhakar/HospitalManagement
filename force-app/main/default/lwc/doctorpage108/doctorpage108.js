import { LightningElement, track, wire } from 'lwc';
import doctorData from '@salesforce/apex/ShowDoctorData.retrieveDoctors';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';

import DOCTOR_OBJECT from '@salesforce/schema/Doctor__c';
export default class Doctorpage108 extends LightningElement {

 @track doctorInput = ''
 @track allDoctors;
 @track Specilatyvalue=''
 @track Specilatyoptions
 @track valueLocation=''
 @track Locationoptions


  @wire(doctorData,{doctortext:'$doctorInput',specilaty:'$Specilatyvalue',location:'$valueLocation'})
    allDoctorsData({ data, error }) {
        if (data) {
            console.log('data', data);
            this.allDoctors = data;
        } else if (error) {
            console.log('error', error);
        }
    }
     @wire(getObjectInfo, { objectApiName: DOCTOR_OBJECT })
    contactObjectInfo;

     @wire(getPicklistValues, { recordTypeId: '$contactObjectInfo.data.defaultRecordTypeId', fieldApiName: 'Doctor__c.Specialty__c' })
    getPicklistValues({ data, error }) {
        if (data) {
            this.Specilatyoptions = data.values.map(option => {
                return {
                    label: option.label,
                    value: option.value
                };
            });
        } else if (error) {
            console.error(error);
        }
    }
    @wire(getPicklistValues, { recordTypeId: '$contactObjectInfo.data.defaultRecordTypeId', fieldApiName: 'Doctor__c.Location__c' })
    getlocationValues({ data, error }) {
        if (data) {
            this.Locationoptions = data.values.map(option => {
                return {
                    label: option.label,
                    value: option.value
                };
            });
        } else if (error) {
            console.error(error);
        }

    }
    searchHandler(event) {
       
        this.doctorInput = event.target.value
        console.log('this.doctorInput',this.doctorInput)
    }
    handleChangeSpecilaty(event) {
        this.Specilatyvalue = event.target.value
        console.log(' this.Specilatyvalue', this.Specilatyvalue)
    }
    handleChangeLocation(event) {
        this.valueLocation = event.target.value
        console.log(' this.valueLocation', this.valueLocation)
    }
     handleRefreshButtonClick(){
        this.doctorInput=''
        this.Specilatyvalue=''
        this.valueLocation=''
    }

}