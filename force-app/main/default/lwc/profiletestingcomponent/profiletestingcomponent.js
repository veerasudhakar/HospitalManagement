import { LightningElement, track, wire } from 'lwc';
import DoctorDetails from '@salesforce/apex/UserDetails.getCurrentUserDoctorRecords';
import { NavigationMixin } from 'lightning/navigation';
import Doctor_object from '@salesforce/schema/Doctor__c';
import NAME_FIELD from '@salesforce/schema/Doctor__c.Name';
import PHONE__c_FIELD from '@salesforce/schema/Doctor__c.Phone__c';
import EMAIL__c_FIELD from '@salesforce/schema/Doctor__c.Email__c';
import IMAGE_URL__c_FIELD from '@salesforce/schema/Doctor__c.Image_Url__c';
import SPECIALTY__c_FIELD from '@salesforce/schema/Doctor__c.Specialty__c';
import DESCRIPTION__c_FIELD from '@salesforce/schema/Doctor__c.Description__c';
import { refreshApex } from '@salesforce/apex';
export default class ProfileComponent extends NavigationMixin(LightningElement)
{
    @track selectedRecordId;
    @track record;
    @track error;
    viewmode = true;
    @track isModalOpen = false;
    fields = [NAME_FIELD, PHONE__c_FIELD, EMAIL__c_FIELD, IMAGE_URL__c_FIELD, SPECIALTY__c_FIELD, DESCRIPTION__c_FIELD];
    ObjectApiName = Doctor_object;
    refreshdata
    @wire(DoctorDetails)
    Details(result) {
        this.refreshdata = result;
        if (result.data) {

            this.record = result.data;
            //this.error = undefined;
    console.log(JSON.stringify(this.record ))
        }
        else if (result.error) {
            this.error = result.error;
            //this.record = undefined

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

    handelbutton() {
        this.viewmode = false;
        refreshApex(this.refreshdata)

    }
    handleClick(event) {

        const recordId = event.target.value;
        this.selectedRecordId = recordId;
        this.isModalOpen = true;
        console.log('selected record id', recordId)
    }
    closeModal() {
        // to close modal set isModalOpen tarck value as false
        this.isModalOpen = false;
    }
    submitDetails() {
        // to close modal set isModalOpen tarck value as false
        //Add your code to call apex method or do some processing
        this.isModalOpen = false;
    }
    handlesubmit() 
    {
         if (event.target.name === 'firstName') {
      this.firstName = event.target.value
    }
    if (event.target.name === 'lasttName') {
      this.lastName = event.target.value
    }
        this.isModalOpen = false;
        
       
    }
    handlecancel() {
        this.isModalOpen = false;
    }

    refreshhandelbutton(){
         refreshApex(this.refreshdata)
    }

}