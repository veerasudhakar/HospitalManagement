import { LightningElement, track, wire, api } from 'lwc';

import doctorData from '@salesforce/apex/ShowDoctorData.retrieveDoctors';
import getBio from '@salesforce/apex/DoctorInfo.getBio';
import { getPicklistValuesByRecordType } from 'lightning/uiObjectInfoApi';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import GUEST_OBJECT from '@salesforce/schema/Doctor__c';
import getselectedDoctor from '@salesforce/apex/DoctorSearchController.getmydoctor';
//import searchDoctors from '@salesforce/apex/SearchController.searchDoctors';
// import getDoctors from '@salesforce/apex/SearchController.getDoctors';\
 import { NavigationMixin } from 'lightning/navigation';
export default class GlobalPickListLWC extends NavigationMixin(LightningElement) {
   @track recordId;
@track doctors;
@track controllingValues = [];
@track dependentValues = [];
@track selectedType;
@track selectedMealPreference;
@track isEmpty = false;
@track error;
controlValues;
totalDependentValues = [];
@track data;
doctors;
@track mydoctor;
 @track doctorDetail = false
 @track doctorIdap=''
 @track isShowModal = false;

    @wire(getObjectInfo, { objectApiName: GUEST_OBJECT })
    objectInfo;

    // Picklist values based on record type
    @wire(getPicklistValuesByRecordType, { objectApiName: GUEST_OBJECT, recordTypeId: '$objectInfo.data.defaultRecordTypeId'})
    countryPicklistValues({ error, data }) {
        if (data) {
            this.error = null;
            let mealOptions = [{ label: '--None--', value: '--None--' }];
            data.picklistFieldValues.Specialty__c.values.forEach((key) => {
                mealOptions.push({
                    label: key.label,
                    value: key.value
                });
            });

            this.controllingValues = mealOptions;

            let typeOptions = [{ label: '--None--', value: '--None--' }];

            this.controlValues = data.picklistFieldValues.Doctors__c.controllerValues;

            this.totalDependentValues = data.picklistFieldValues.Doctors__c.values;

            this.totalDependentValues.forEach((key) => {
                typeOptions.push({
                    label: key.label,
                    value: key.value
                });
            });

            this.dependentValues = typeOptions;
        } else if (error) {
            this.error = JSON.stringify(error);
        }
    }

    handleMealPreferenceChange(event) {
        // Selected Meal Preference Value
        this.selectedMealPreference = event.target.value;
        this.isEmpty = false;
        let dependValues = [];

        if (this.selectedMealPreference) {
            // if Selected Meal Preference is none, return nothing
            if (this.selectedMealPreference === '--None--') {
                this.isEmpty = true;
                dependValues = [{ label: '--None--', value: '--None--' }];
                this.selectedMealPreference = null;
                this.selectedType = null;
                return;
            }

            // filter the total dependent values based on selected meal preference value
            this.totalDependentValues.forEach((conValues) => {
                if (conValues.validFor[0] === this.controlValues[this.selectedMealPreference]) {
                    dependValues.push({
                        label: conValues.label,
                        value: conValues.value
                    });
                }
            });

            this.dependentValues = dependValues;
        }
    }

 @track mydoctor ;
   handleMealTypeChange(event) {
    this.selectedType = event.target.value;
    console.log('doctor speciality', this.selectedType);

    if (this.selectedType) {
        // Find the corresponding dependent value object with the selected type
        const selectedDependentValue = this.totalDependentValues.find((value) => value.value === this.selectedType);
        if (selectedDependentValue) {
            console.log('selectedDependentValue:', selectedDependentValue); // Add this line to check the selectedDependentValue

            const recordId = selectedDependentValue.recordId; // Get the recordId
            console.log('recordId:', recordId);

            getselectedDoctor({ doctorname: this.selectedType })
                .then((result) => {
                    this.mydoctor = result;
                    console.log('Selected doctor:', this.mydoctor);
                    // Call any additional functions or perform operations with the recordId as needed
                    // ...

                    // Uncomment the following line to call the searchDoctors function
                    // this.searchDoctors();
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }
}


    searchDoctors() {
        if (this.selectedType) {
            // searchDoctors({ selectedDoctorValue: this.selectedType })
            //     .then((result) => {
            //         // Handle the returned doctor data
            //         // Assign the result to a property to display in the UI
            //         this.doctors = result;
            //     })
            //     .catch((error) => {
            //         // Handle the error
            //     });
        }
    }

    

    aboutDoctor(event) {  
      this.doctorDetail=true
      
        console.log('doctorId',event.target.value)
        this.doctorIdap = event.target.value
         sessionStorage.setItem('dtrId',this.doctorIdap)
        console.log('sessionId',sessionStorage.getItem('dtrId'))
        getBio({recordId:this.doctorIdap})
        .then(result=>{
          this.mydoctor = result
          console.log(' result.data', result)
        }).catch(error=>{
          console.log(error)
        })
    
    }
     backHome(){
      this.doctorDetail=false
      this.homePage=true
    }

     hideModalBox() {  
        this.isShowModal = false;
    }
   
}