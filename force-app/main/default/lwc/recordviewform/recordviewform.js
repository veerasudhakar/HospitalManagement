import { LightningElement, api, track,wire } from 'lwc';
import getCurrentUserDoctorRecords from '@salesforce/apex/UserDetails.getCurrentUserDoctorRecords';
import NAME_FIELD from '@salesforce/schema/Doctor__c.Name';
import PHONE__c_FIELD from '@salesforce/schema/Doctor__c.Phone__c';
import EMAIL__c_FIELD from '@salesforce/schema/Doctor__c.Email__c';
import IMAGE_URL__c_FIELD from '@salesforce/schema/Doctor__c.Image_Url__c';
import SPECIALTY__c_FIELD from '@salesforce/schema/Doctor__c.Specialty__c';
import DESCRIPTION__c_FIELD from '@salesforce/schema/Doctor__c.Description__c';

export default class ViewForm extends LightningElement {
    @api doctorList;
    @track selectedRecordId;
    @track isEditMode = false;
    @track selectedDoctor;

     fields=[NAME_FIELD,PHONE__c_FIELD,EMAIL__c_FIELD,IMAGE_URL__c_FIELD,SPECIALTY__c_FIELD,DESCRIPTION__c_FIELD];
     ObjectApiName=Doctor_object;
     @wire(getCurrentUserDoctorRecords)
     Details({error,data}){
     if(data){
         this.record=data;
         this.error=undefined;
    
     }
     else if(error){
         this.error=error;
         this.record=undefined
         
     }
     }
      @track DoctorList;




    connectedCallback(){

        DoctorDetails()

        .then(result =>{

            this.DoctorList=result;

        })

        .catch(error=>{

            this.DoctorList= error;

        });

    }

    handleClick(event) {
        this.selectedRecordId = event.target.dataset.recordId;
        // Find the selected doctor in the list of doctors
        this.selectedDoctor = this.doctorList.find((doctor) => doctor.Id === this.selectedRecordId);
    }

    handleEdit() {
        this.isEditMode = true;
    }
}