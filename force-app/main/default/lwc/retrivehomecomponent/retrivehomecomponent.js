import { LightningElement, wire, track, api } from 'lwc';
import doctorData from '@salesforce/apex/ShowDoctorData.retrieveDoctors';
import getUserInfo from '@salesforce/apex/ShowDoctorData.getUserLoginStatus';
import getAvailableSlots from '@salesforce/apex/myAppointment.getAvailableSlots';
import insertAccountMethod from '@salesforce/apex/BookAppointment.myappointment';
import userContactDetails from '@salesforce/apex/BookAppointment.userContactDetails';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import Id from '@salesforce/user/Id';
import { getRecord } from 'lightning/uiRecordApi';
import UserNameFIELD from '@salesforce/schema/User.Name';
import UserIDFIELD from '@salesforce/schema/User.Id';
import userEmailFIELD from '@salesforce/schema/User.Email';
import userIsActiveFIELD from '@salesforce/schema/User.IsActive';
import userAliasFIELD from '@salesforce/schema/User.Alias';
import getBio from '@salesforce/apex/DoctorInfo.getBio';
import { refreshApex } from '@salesforce/apex';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';

import DOCTOR_OBJECT from '@salesforce/schema/Doctor__c';
import CONTACT_OBJECT from '@salesforce/schema/Contact';

//  import Healthtip1_IMG from '@salesforce/resourceUrl/Healthtip1';
// import 	Healthtip2_IMG from '@salesforce/resourceUrl/Healthtip2';
// import Courosal3_IMG from '@salesforce/resourceUrl/Courosal3';
import { NavigationMixin, CurrentPageReference } from 'lightning/navigation';

export default class retrivehomecomponent extends NavigationMixin(LightningElement) {
    //      healthImg = Healthtip1_IMG;
    //     investImg = Healthtip2_IMG;
    //  fruitsImg = Courosal3_IMG;
    carouselImages = [
        'https://wisseninfotech-cb-dev-ed.develop.my.site.com/resource/1688642694000/Healthtip1?',
        'https://wisseninfotech-cb-dev-ed.develop.my.site.com/resource/1688541974000/Healthtip2?',
        'https://wisseninfotech-cb-dev-ed.develop.my.site.com/resource/1688546878000/Courosal3?'
    ];



    @track allDoctors;
    @track doctorInput = ''
    @track isButtonDisabled = false;
    @track isButtonDisabled1 = true;
    @track Specilatyoptions
    @track Locationoptions
    @track valueLocation=''
    @track statesValue;
    @track Specilatyvalue=''
   // @track Languages
   gender
    timer
    currentUserName=''
    currentUserEmail=''
    contactDetails
    contactRecordId
    genderOptions
    contactInput=false
    @wire(getRecord, { recordId: Id, fields: [UserNameFIELD,UserIDFIELD, userEmailFIELD, userIsActiveFIELD, userAliasFIELD ]}) 
    currentUserInfo({error, data}) {
        if (data) {
             this.currentUserName = data.fields.Name.value;            
            this.currentUserEmail = data.fields.Email.value;
            // this.currentIsActive = data.fields.IsActive.value;
            // this.currentUserAlias = data.fields.Alias.value;
            console.log('data.fields.Name.value',data.fields.Name.value)
            console.log('data.fields.Email.value',data.fields.Email.value)
            console.log('data.fields.Id.value',data.fields.Id.value)
        } else if (error) {
            // this.error = error ;
            console.error(error)
        }
    }

    @wire(userContactDetails,{loginUser:'$currentUserEmail'})
    userContact({data,error}){
        if(data){
            this.contactDetails=data
            this.contactRecordId=data.Id
            console.log(this.contactDetails)
            if(this.contactDetails.Date_Of_Birth__c ==undefined && this.contactDetails.Phone ==undefined && this.contactDetails.Address__c==undefined && this.contactDetails.Gender__c==undefined){
                this.contactInput=true
            }
        }else if(error){
            console.error(error)
        }
    }

    @track dtrDetail
    // @wire(getBio)
    // dtrData({data,error}){
    //     if(data){
    //         this.dtrDetail = data
    //     }else if(error){
    //         console.log(error)
    //     }
    //This is New Code Anoither new code
    // }


    @wire(doctorData,{doctortext:'$doctorInput',specilaty:'$Specilatyvalue',location:'$valueLocation'})
    allDoctorsData({ data, error }) {
        if (data) {
            console.log('data', data);
            this.allDoctors = data;
        } else if (error) {
            console.log('error', error);
        }
    }
    @wire(CurrentPageReference)
    getPageReferenceParameters(currentPageReference) {
      console.log('currentPageReference....'+currentPageReference);
      console.log('currentPageReference.state....'+currentPageReference.state.t);
      this.statesValue = currentPageReference.state.t;
      //  if (currentPageReference) {
      //     console.log(currentPageReference);
      //     console.log(currentPageReference.state);
          
      //  }
      }

      @wire(getObjectInfo, { objectApiName: CONTACT_OBJECT })
      contactInfo;
  
          @wire(getPicklistValues, { recordTypeId: '$contactInfo.data.defaultRecordTypeId', fieldApiName: 'Contact.Gender__c' })
      getPicklistGender({ data, error }) {
          if (data) {
              this.genderOptions = data.values.map(option => {
                  return {
                      label: option.label,
                      value: option.value
                  };
              });
              console.log(' this.genderOptions ', this.genderOptions)
          } else if (error) {
              console.error(error);
          }
      }


      
    @wire(getUserInfo)
    wiredUserInfo({ error, data }) {
        if (data) {
            this.isButtonDisabled = true;
            this.isButtonDisabled1 = false;
        } else if (error) {
            // Handle error, if necessary
            console.error('Error fetching user info:', error);
        }
    }

    searchHandler(event) {
       
        this.doctorInput = event.target.value
        console.log('this.doctorInput',this.doctorInput)
    }

    // handleClick() {
    //     //Perform your desired actions here
    //     this[NavigationMixin.Navigate]({
    //         type: 'standard__webPage',
    //         attributes: {
    //             url: "https://wisseninfotech-cb-dev-ed.develop.my.site.com/Patient1Site/s/login/?startURL=%2FPatient1Site%2Fs%2F%3Ft%3D1688016377986"
    //         }
    //     });
    // }


    // for picklist value 
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
    //New Component Appointment
 @track isShowModal = false;
 @track homePage=true
 @track doctorDetail = false
 @track doctorIdap=''

 connectedCallback(){
  if(sessionStorage.getItem('dtrId')){
    console.log('connectedCallback sessionId',sessionStorage.getItem('dtrId'))
    this.doctorDetail=true
      this.homePage=false
    this.doctorIdap=sessionStorage.getItem('dtrId')
    getBio({recordId: this.doctorIdap})
    .then(result=>{
      this.dtrDetail = result
      sessionStorage.clear()
      console.log(' result.data connected Callback', result)
    }).catch(error=>{
      console.log(error)
    })
  }
 }

     aboutDoctor(event) {  
      this.doctorDetail=true
      this.homePage=false
        console.log('doctorId',event.target.value)
        this.doctorIdap = event.target.value
         sessionStorage.setItem('dtrId',this.doctorIdap)
        console.log('sessionId',sessionStorage.getItem('dtrId'))
        getBio({recordId:this.doctorIdap})
        .then(result=>{
          this.dtrDetail = result
          console.log(' result.data', result)
        }).catch(error=>{
          console.log(error)
        })
    
    }

    hideModalBox() {  
        this.isShowModal = false;
    }

    backHome(){
      this.doctorDetail=false
      this.homePage=true
    }

    bookAppointment(){
      
 if(this.currentUserName==''){
  console.log('this.statesValue.....'+this.statesValue)
  console.log('this.currentUserName.....'+this.currentUserName)
  if(this.statesValue === undefined){
    this[NavigationMixin.Navigate]({
      type: 'standard__webPage',
      attributes: {
          url: "https://wisseninfotech-cb-dev-ed.develop.my.site.com/Patient1Site/s/login/"
      }
  });
  this.doctorDetail=true
  this.homePage=false
  }
  // else if(this.statesValue != undefined) {
  //   //this.isShowModal = true;
  //   this.doctorDetail=true
  //   this.homePage=false
  // }
}else{
  

      this.isShowModal=true
    }
  }

  @track patientid;
  @track error;
  // objectName=patientObj ;
  // fieldList=[patName,patphone,patDate,patslotav,patstatus]
  // successHandler(event){
  //     console.log(event.detail.id)
  // }
  // @track getPatientRecord={
  // Name:patName,
  // Phone:patphone,
  // //Email:patEmail,
  // //AppointmentNo:patapNo,
  // Appointmentdate:patDate,
  // //Consultdoctor:patAvDoctor,
  // SlotsAvailable: patslotav

  // };

  @track firstName = '';
  @track lastName = '';
  @track email = '';
  @track phone = '';
  @track address = '';
  @track availableSlots = [];
  @track selectedDate = ''
  @track dateOFBirth=''
  @track age='';
  @ track ageTamplate =false;
  //doctorId = 'a065i00000OC2WtAAL'
  doctorId
  dob

  handleChange(event) {
    // if (event.target.name === 'firstName') {
    //   this.firstName = event.target.value
    // }
    // if (event.target.name === 'lasttName') {
    //   this.lastName = event.target.value
    // }
    // if (event.target.name === 'Email') {
    //   this.email = event.target.value
    // }
    if (event.target.name === 'gender') {
      this.gender = event.target.value
    }
    if (event.target.name === 'address') {
      this.address = event.target.value
    }
     if (event.target.name === 'DateofBirth') {
         this.dateOFBirth=event.target.value;
          const dobDate = new Date(this.dateOFBirth);
        const currentDate = new Date();
        const ageInMilliseconds = currentDate - dobDate;
        const ageInYears = ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);

        // Round the age to the nearest integer
        this.age = Math.floor(ageInYears);
        console.log('age'+ this.age);
        // this.ageTamplate=true;

    }
  }

  //Country Code and Mobile Number Data Started
  
    @track conNum = '';
    countryNuber = '';

    @track countryCodes = [
        { label: '+91  (IND)', value: '91' },
        { label: '+1   (USA)', value: '1' },
        { label: '+44  (UK)', value: '44' },
        { label: '+61  (AUS)', value: '61' },
        { label: '+33  (FRA)', value: '33' },
        { label: '+49  (GER)', value: '49' },
        { label: '+39  (ITA)', value: '39' },
        { label: '+81  (JAP)', value: '81' },
        { label: '+86  (CHI)', value: '86' },
        { label: '+52  (MEX)', value: '52' },
        { label: '+55  (BRA)', value: '55' },
        { label: '+971 (UAE)', value: '971' },
        { label: '+966 (SAR)', value: '966' },
        { label: '+65  (SIN)', value: '65' },
        { label: '+82  (SKO)', value: '82' },
        { label: '+64  (NZE)', value: '64' },
        // Add more country codes as needed
    ];
    @track contactNumberPattern = ''; // Regex pattern for contact number validation

    handleCountryCodeChange(event) {
        const selectedCountryCode = event.detail.value;
        this.countryNuber = selectedCountryCode;
        console.log('selectedCountryCode' + selectedCountryCode)
        // Define contact number pattern based on the selected country code
        this.contactNumberPattern = this.getContactNumberPattern(selectedCountryCode);
        // Define placeholder based on the selected country code
        this.contactNumberPlaceholder = this.getContactNumberPlaceholder(selectedCountryCode);
    }

    getContactNumberPattern(countryCode) {
        // Define regex patterns for each country's contact number format
        // You can add more patterns as needed
        switch (countryCode) {
            case '1':
                return '^\\d{10}$'; // Example pattern: +11234567890
            case '91':
                return '\\d{10}$'; // Example pattern: +911234567890
            case '44':
                return '^\\d{10}$'; // Example pattern: +441234567890
            case '61':
                return '^\\d{10}$'; // Example pattern: +611234567890
            case '33':
                return '^\\d{9}$'; // Example pattern: +33123456789
            case '49':
                return '^\\d{11}$'; // Example pattern: +491234567890
            case '39':
                return '^\\d{10}$'; // Example pattern: +391234567890
            case '81':
                return '^\\d{10}$'; // Example pattern: +811234567890
            case '86':
                return '^\\d{11}$'; // Example pattern: +861234567890
            case '52':
                return '^\\d{10}$'; // Example pattern: +521234567890
            case '55':
                return '^\\d{11}$'; // Example pattern: +551234567890
            case '971':
                return '^\\d{9}$'; // Example pattern: +971123456789
            case '966':
                return '^\\d{9}$'; // Example pattern: +966123456789
            case '65':
                return '^\\d{8}$'; // Example pattern: +6512345678
            case '82':
                return '^\\d{10}$'; // Example pattern: +821234567890
            case '86':
                return '^\\d{11}$'; // Example pattern: +861234567890
            case '966':
                return '^\\d{9}$'; // Example pattern: +966123456789
            case '61':
                return '^\\d{10}$'; // Example pattern: +611234567890
            case '64':
                return '^\\d{9}$'; // Example pattern: +64123456789
            // Add more cases for other country codes
            default:
                return ''; // Default pattern if country code is not selected
        }
    }

    getContactNumberPlaceholder(countryCode) {
        // Define placeholders for each country's contact number format
        // You can add more placeholders as needed
        switch (countryCode) {
            case '1':
                return '(XXX) XXX-XXXX'; // Example placeholder: +1 (123) 456-7890
            case '91':
                return 'XXXXX-XXXXX'; // Example placeholder: +91 12345-67890
            case '44':
                return 'XXXX XXXXXX'; // Example placeholder: +44 1234 567890
            case '61':
                return 'XXXX XXX XXX'; // Example placeholder: +61 1234 567 890
            case '33':
                return 'XX XX XX XX'; // Example placeholder: +33 12 34 56 78
            case '49':
                return 'XXXX XXXXXXX'; // Example placeholder: +49 1234 567890
            case '39':
                return 'XXX XXXXXXX'; // Example placeholder: +39 123 4567890
            case '81':
                return 'XXX-XXXX-XXXX'; // Example placeholder: +81 123-4567-8901
            case '86':
                return 'XXX-XXXX-XXXX'; // Example placeholder: +86 1234-5678-9012
            case '52':
                return 'XXXX XXXXXXX'; // Example placeholder: +52 1234 567890
            case '55':
                return 'XX XXXXX-XXXX'; // Example placeholder: +55 12 34567-8901
            case '971':
                return 'XXXXXXXXX'; // Example placeholder: +971 123456789
            case '966':
                return 'XXXXXXXXX'; // Example placeholder: +966 123456789
            case '65':
                return 'XXXX XXXX'; // Example placeholder: +65 1234 5678
            case '82':
                return 'XXXX-XXXX-XXXX'; // Example placeholder: +82 1234-5678-9012
            case '86':
                return 'XXXX-XXXX-XXXX'; // Example placeholder: +86 1234-5678-9012
            case '966':
                return 'XXXXXXXXX'; // Example placeholder: +966 123456789
            case '61':
                return 'XXXX XXX XXX'; // Example placeholder: +61 1234 567 890
            case '64':
                return 'XXX XXX XXX'; // Example placeholder: +64 123 456 789
            // Add more cases for other country codes
            default:
                return ''; // Default placeholder if country code is not selected
        }
    }

    handleContactNumberBlur(event) {
        let cNumber = event.target.value;
        console.log('cNumber event.target.value' + event.target.value)
        console.log('cNumber' + cNumber)
        this.conNum = '+' + this.countryNuber + ' ' + cNumber;
        console.log('this.conNum ' + this.conNum )
        const contactNumberInput = this.template.querySelector('lightning-input');
        console.log('contactNumberInput' + contactNumberInput)
        if (!contactNumberInput.checkValidity()) {
            // Handle invalid contact number format here
            // You can display an error message or perform any required action
            this.contactNumberInputerrormsg = 'Please enter a valid Contact Number.';
        }
    }
    //Country Code Ended
/*
  const Consultdoctor=this.template.querySelector('.Consultdoctor')
        console.log('Consultdoctor',Consultdoctor.value)
                this.doctorId =Consultdoctor.value; 

*/

  // nameInpChange(event){
  // this.getPatientRecord.Name = event.target.value;
  // //window.console.log(this.getAccountRecord.Name);
  // }

  // phoneInpChange(event){
  // this.getPatientRecord.Phone = event.target.value;
  // //window.console.log(this.getAccountRecord.Phone);
  // }

  // typeInpChange(event){
  // this.getPatientRecord.Email = event.target.value;
  // //window.console.log(this.getAccountRecord.Type);
  // }

  // // websiteInpChange(event){
  // // this.getPatientRecord.Website = event.target.value;
  // // //window.console.log(this.getAccountRecord.Type);
  // // }

  // // accSiteChange(event){
  // // this.getPatientRecord.Site = event.target.value;
  // // //window.console.log(this.getAccountRecord.Type);
  // // }


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


  getSlots() {
    //console.log('doc id ' + this.doctorId);
    getAvailableSlots({ selectedDate: this.selectedDate, doctorid: this.doctorIdap })
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

  handleClick() {
    const selectedDate = new Date(this.selectedDate);
    const currentDate = new Date();
    // Check if input fields are not null
    console.log('selectedDate  ', this.selectedDate)


    if (selectedDate > new Date().setHours(0, 0, 0, 0) || selectedDate.toDateString() == new Date().toDateString()) {
      console.log(this.firstName, this.lastName, this.email, this.address,  this.conNum, this.selectedSlot ,this.dateOFBirth,this.age)

      if (this.selectedSlot ) {


        var appointment = { sobjectType: 'Appointment__c' };
        appointment.Doctor__c = this.doctorIdap;
        appointment.Appointment_Date__c = this.selectedDate;
        appointment.SlotsAvailable__c = this.selectedSlot;
        appointment.Contact__c=this.contactRecordId
        appointment.Status__c = 'Scheduled';

        var contact = {sobjectType: 'Contact'}
        //contact.Contact__c = this.doctorIdap;
        // contact.First_Name__c = this.firstName;
        // contact.Last_Name__c = this.lastName;
        // contact.Email__c = this.email;
         contact.Id = this.contactRecordId;
         contact.Address__c = this.address;
         contact.Phone = this.conNum;
        //contact.Appointment_Date__c = this.myDatetime;
        contact.Date_Of_Birth__c=this.dateOFBirth;
         contact.Age__c=this.age;
          contact.Gender__c=this.gender;
        //contact.AccountId=this.accountName
        console.log('doc id on selecting appointment ' + this.selectedDate);


        console.log('patient slot booking date ' + this.selectedDate);
        if (this.selectedDate != null) {
          insertAccountMethod({ patientObj: appointment, contactUpdate: contact  })
            .then(result => {
              console.log(JSON.stringify(result));
              // Handle successful save
              this.dispatchEvent(
                new ShowToastEvent({
                  title: 'Success',
                  message: 'Appointment Applied Succesfully',
                  variant: 'success'
                })
              );
              // return refreshApex (this.getAvailableSlots);
      location.reload();
                this.isShowModal=false
            })
            .catch(error => {
              // Handle error
              this.dispatchEvent(
                new ShowToastEvent({
                  title: 'Error',
                  message: error.body.message,
                  variant: 'error'
                })
              );
            });
        }
      } else {

        // Show error message if input fields are null
        // this.dispatchEvent(
        //   new ShowToastEvent({
        //     title: 'Fields cannot be empty',
        //     message: 'Please fill in all required fields',
        //     variant: 'sticky'
        //   })
        // );
      }
    } else {
      alert('Invalid appointment date please select the date from the current date forward ');
    }


  }
  //   @wire(getObjectInfo, { objectApiName: patientObj })
  //   patientObjectInfo;


  // picklistValues = []

  //   @wire(getPicklistValues, {
  //     recordTypeId: '01I5i0000028ojx',
  //     fieldApiName: patslotav,
  //   })
  //   getPicklistValuesForField({ data, error }) {
  //     if (error) {
  //       // TODO: Error handling
  //       console.error(error)
  //     } else if (data) {
  //       this.picklistValues = [...data.values]
  //     }
  //   }


  // statusValues = []

  //   @wire(getPicklistValues, {
  //     recordTypeId: '01I5i0000028ojx',
  //     fieldApiName: patstatus,
  //   })
  //   getPicklistValuesForField({ data, error }) {
  //     if (error) {
  //       // TODO: Error handling
  //       console.error(error)
  //     } else if (data) {
  //       this.statusValues = [...data.values]
  //     }
  //   }

  // saveAccountAction(){
  // window.console.log('before save' + this.createPatient);
  // insertAccountMethod({patientObj:this.getPatientRecord})
  // .then(result=>{
  // window.console.log(this.createPatient);
  // this.getPatientRecord={};
  // this.patientid=result.Id;
  // window.console.log('after save' + this.patientid);

  // const toastEvent = new ShowToastEvent({
  // title:'Success!',
  // message:'Appointment created successfully',
  // variant:'success'
  // });
  // this.dispatchEvent(toastEvent);
  // })
  // .catch(error=>{
  // this.error=error.message;
  // window.console.log(this.error);
  // });
  // }


  // connectedCallback() {
  //     console.log('getPatientRecord ', JSON.stringify(this.getPatientRecord));
  // }

}