import { LightningElement, track, wire } from 'lwc';
import DoctorDetails from '@salesforce/apex/UserDetails.getCurrentUserDoctorRecords';
import { NavigationMixin } from 'lightning/navigation';
import Doctor_object from '@salesforce/schema/Doctor__c';

import NAME_FIELD from '@salesforce/schema/Doctor__c.Name';
import PHONE__c_FIELD from '@salesforce/schema/Doctor__c.Phone__c';
import EMAIL__c_FIELD from '@salesforce/schema/Doctor__c.Email__c';
import Location__FIELD from '@salesforce/schema/Doctor__c.Location__c';
import SPECIALTY__c_FIELD from '@salesforce/schema/Doctor__c.Specialty__c';

import Experience__FIELD from '@salesforce/schema/Doctor__c.Experience__c';
import DESCRIPTION__c_FIELD from '@salesforce/schema/Doctor__c.Description__c';
// import IMAGE_URL__c_FIELD from '@salesforce/schema/Doctor__c.Image_Url__c';

import Languages_Known__FIELD from '@salesforce/schema/Doctor__c.Languages_Known__c';
import Biograph__FIELD from '@salesforce/schema/Doctor__c.Biograph__c';
import { refreshApex } from '@salesforce/apex';
export default class ProfileComponent extends NavigationMixin(LightningElement)
{
    @track imageUrl;
    @track recordId;
    @track file;
    isReadOnly = false;
    @track selectedRecordId;
    @track record;
    @track error;
    viewmode = true;
    @track isModalOpen = false;
    @track fields = [NAME_FIELD, PHONE__c_FIELD, EMAIL__c_FIELD, Location__FIELD, SPECIALTY__c_FIELD, Experience__FIELD, DESCRIPTION__c_FIELD, Languages_Known__FIELD, Biograph__FIELD,];
    ObjectApiName = Doctor_object;
    refreshdata
    get acceptedFormats() {
        return ['.pdf', '.png', '.jpg', '.jpeg'];
    }
    @wire(DoctorDetails)
    Details(result) {
        this.refreshdata = result;
        if (result.data) {

            this.record = result.data;
            //this.error = undefined;
            console.log(JSON.stringify(this.record))
        }
        else if (result.error) {
            this.error = result.error;
            //this.record = undefined

        }
    }
    @track DoctorList;

    connectedCallback() {

        DoctorDetails()

            .then(result => {

                this.DoctorList = result;

            })

            .catch(error => {

                this.DoctorList = error;

            });

    }

    // handelbutton() {
    //     this.viewmode = false;
    //     refreshApex(this.refreshdata)

    // }
    handleClick(event) {

        const recordId = event.target.value;
        this.selectedRecordId = recordId;
        this.isModalOpen = true;
        console.log('selected record id', recordId)
    }
    closeModal(event) {
        console.log('onsubmit: ' + event.detail.fields);
        this.isModalOpen = false;
    }
    submitDetails() {
        // to close modal set isModalOpen tarck value as false
        //Add your code to call apex method or do some processing
        this.isModalOpen = false;
    }
    // handlesubmit() {
    //     this.isModalOpen = false;


    // }
    handleCancel() {
        this.isModalOpen = false;
    }

    refreshhandelbutton() {
        refreshApex(this.refreshdata)

    }
     handleSubmit(event) {
        event.preventDefault();
 this.viewmode = false;
   this.isModalOpen = false;
     refreshApex(this.refreshdata)
        // Save the form
        this.template.querySelector('lightning-record-edit-form').submit();
         
         
    }

    // handleSubmit(event) {


    //     console.log('onsubmit event recordEditForm' + event.detail.fields);
    //     this.viewmode = false;
    //     this.isModalOpen = false;
    //     //      updateDoctorImage({ doctorId: this.doctorId, imageData: this.newImageUrl })
    //     // .then(() => {
    //     //     // Handle success, e.g., show a success message.
    //     // })
    //     // .catch((error) => {
    //     //     // Handle error, e.g., show an error message.
    //     // });


    // }
    handleSuccess(event) {
        console.log('onsuccess event recordEditForm', event.detail.id);
    }
    //    handleFileChange(event) {
    //         const file = event.target.files[0];
    //         if (file) {
    //             // Perform any validation on the file, if needed.
    //             // For example, check file size or file type.
    //             this.readFile(file);
    //         }
    //    }
    //  readFile(file) {
    //     const reader = new FileReader();
    //     reader.onloadend = () => {
    //         // Store the image data as Base64 in imageUrl.
    //         this.imageUrl = reader.result;
    //     };
    //     reader.readAsDataURL(file);
    // }
    // get imageData() {
    //     return this.imageUrl;
    // }
}