import { LightningElement, wire, track } from 'lwc';
import getContacts from '@salesforce/apex/ContactWithImageController2.getContacts';

//for speciality picklist 
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';

import CONTACT_OBJECT from '@salesforce/schema/Contact';
import getAvailableSlots from '@salesforce/apex/PicklistController.getAvailableSlots';

//handle save contact
import saveContact from '@salesforce/apex/creatingpatientcontroller.patientcreationmethod';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import { refreshApex } from '@salesforce/apex';
export default class ContactWithImage extends LightningElement {

 

  @track contacts = [];
  visibleContacts
  error;


  picklistValues;
  locationvalues;
  @track selectedValue = '';
  @track mylocationvalues = '';
  doctorId;

  @track myValue = '';


  selectedDate;
  availableSlots;
  @track errorMsg;

//citis logo start
		@track cities = [
        {
            id: 1,
            name: 'New Delhi',
            logoUrl: 'https://www.apollohospitals.com/wp-content/themes/apollohospitals/assets-v3/images/delhi_city.svg'
        },
        {
            id: 2,
            name: 'Bangalore',
            logoUrl: 'https://www.apollohospitals.com/wp-content/themes/apollohospitals/assets-v3/images/bangalore_city.svg'
        },
				 {
            id: 3,
            name: 'Hyderabad',
            logoUrl: 'https://www.apollohospitals.com/wp-content/themes/apollohospitals/assets-v3/images/hyderabad_city.svg'
        },
				 {
            id: 4,
            name: 'Chennai',
            logoUrl: 'https://www.apollohospitals.com/wp-content/themes/apollohospitals/assets-v3/images/chennai_city.svg'
        },
				{
            id: 5,
            name: 'Mumbai',
            logoUrl: 'https://www.apollohospitals.com/wp-content/themes/apollohospitals/assets-v3/images/mumbai_city.svg'
        },
				{
            id: 6,
            name: 'Lucknow',
            logoUrl: 'https://www.apollohospitals.com/wp-content/themes/apollohospitals/assets-v3/images/lucknow_city.svg'
        },
        // Add more cities with their respective logo URLs
    ];
		
//phone num strt
   // contact number functionality
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
//ends here







  handleDateChange(event) {
    this.selectedDate = event.target.value;
    console.log('the doc id to pass' + this.doctorId);
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
      this.doctorId = this.doctorId;
      
      console.log('doctor id was ' + this.doctorId);
      this.getSlots();
    }
  }



  selectedSlot;
  handleSlotSelection(event) {
    this.selectedSlot = event.target.value;
    console.log('Selected time slot:', this.selectedSlot);
  }


  getSlots() {
    console.log('doc id ' + this.doctorId);
    getAvailableSlots({ selectedDate: this.selectedDate, doctorid: this.doctorId })
      .then(result => {
        console.log('slotsss....'+result);
        this.availableSlots = result.map(slot => {
          return { label: slot, value: slot };
        });
      })
      .catch(error => {
        console.error(error);
      });
  }

  handle  (event) {
    //const value = event.target.dataset.value;
    // Do something with the value...
    alert('hello');
  }



  @track myDatetime;
  @track showError = false;
  @track errorMessage = '';
  active = false;

  handleDatetimeChange(event) {
    this.myDatetime = event.target.value;
    // const selectedDate = new Date(this.myDatetime);

  }

  @wire(getContacts, { searchval01: '$myValue', searchval02: '$selectedValue', searchval03: '$mylocationvalues' })
  wiredGetContacts({ error, data }) {
    if (data) {
      this.contacts = data;
      console.log('data',data)
    } else if (error) {
      this.error = error.body.message;
    }
  }

  //Data of patient booking appointment

  @track doctorFirstName;
  @track doctorLastName;
  @track accountName;

  //Boolean tracked variable to indicate if modal is open or not default value is false as modal is closed when page is loaded 
  @track isModalOpen = false;
  handlebookappointment(event) {
    this.isModalOpen = true;
    this.doctorId = event.target.dataset.id;
    console.log(this.doctorId);
    this.doctorFirstName = event.target.dataset.firstname;
    this.doctorLastName = event.target.dataset.lastname;
    this.accountName = event.target.value;
    console.log('acc Name',this.accountName)
    this.selectedDate = '';
    return refreshApex (this.getAvailableSlots , this.wiredGetContacts);
    //return refreshApex();
    //console.log('the doctor name is '+this.doctorId + ' ' + this.doctorLastName);
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

  renderedCallback() {
    var today = new Date();
    var time = today.getHours()
    console.log('time---' + time)
    if (today.getHours() >= 10 && today.getHours() <= 13) {
      this.active = true;
    } else if (today.getHours() >= 17 && today.getHours() <= 21) {
      this.active = true;
    }
    else {
      this.active = false;
    }

  }


  handleChange(event) {
    this.myValue = event.target.value;
    console.log('search function ' + this.myValue);
    console.log('search function ' + event.target.value);
  }
 
  
  get hasContacts() {
    
    return this.contacts.length > 0;

  }

  get showNoDoctorsMessage() {
        return !this.hasContacts;
    }

   get contactsWithImageUrl() {
     
    if (this.hasContacts) {
      return this.contacts.map((contact) => ({
        ...contact,
         imageUrl: contact.imageFileType && contact.imageData ? `data:image/${contact.imageFileType};base64,${contact.imageData}` : 'https://blogtimenow.com/wp-content/uploads/2014/06/hide-facebook-profile-picture-notification.jpg'
      }));
    } else {
      return [];
      
    }
  } 



  // for picklist value 
  @wire(getObjectInfo, { objectApiName: CONTACT_OBJECT })
  contactObjectInfo;

  @wire(getPicklistValues, { recordTypeId: '$contactObjectInfo.data.defaultRecordTypeId', fieldApiName: 'Contact.Specialty__c' })
  getPicklistValues({ data, error }) {
    if (data) {
      this.picklistValues = data.values.map(option => {
        return {
          label: option.label,
          value: option.value
        };
      });
    } else if (error) {
      console.error(error);
    }
  }

  @wire(getPicklistValues, { recordTypeId: '$contactObjectInfo.data.defaultRecordTypeId', fieldApiName: 'Contact.Location__c' })
  getlocationValues({ data, error }) {
    if (data) {
      this.locationvalues = data.values.map(option => {
        return {
          label: option.label,
          value: option.value
        };
      });
    } else if (error) {
      console.error(error);
    }

  }

  handleValueSelection(event) {
    this.selectedValue = event.detail.value;
    console.log('selected location ' + event.detail.value);
  }
  handlelocationselection(event) {
    this.mylocationvalues = event.detail.value;
    console.log('the location is '+event.detail.value);
  }

  handleRefreshButtonClick() {
    this.selectedValue = '';
    this.myValue = '';
    this.mylocationvalues = '';
    this.template.querySelector('lightning-input').value = '';
  }





  @track firstname;
  @track lastName;
  @track address;
  @track email;
  @track phone;








  handleNameChange(event) {
    this.firstname = event.target.value;
    console.log('patient firstName' + this.firstname);
  }
  handlelastnameinp(event) {
    this.lastName = event.target.value;
    console.log('patient lastName' + this.lastName);
  }
  handleaddressinp(event) {
    this.address = event.target.value;
    console.log('patient address' + this.address);
  }
  handlePhoneNumberChange(event) {
    this.phone = event.target.value;
    console.log('patient phone' + this.phone);
  }
  handleemailinput(event) {
    this.email = event.target.value;
    console.log('patient email' + this.email);
  }






  handleConfirmAppointment(event) {
    const selectedDate = new Date(this.selectedDate);
    const currentDate = new Date();
    // Check if input fields are not null
    console.log('selectedDate  ',this.selectedDate)


    if (selectedDate > new Date().setHours(0, 0, 0, 0) ||  selectedDate.toDateString() == new Date().toDateString()) {

      if (this.firstname && this.lastName && this.email && this.address && this.conNum && this.selectedSlot) {

        // Create contact object
        var contact = { sobjectType: 'Contact' };
        contact.Consult_doctor__c = this.doctorId;
        console.log('consultant doctor id was ' + this.doctorId);
        contact.FirstName = this.firstname;
        contact.LastName = this.lastName;
        contact.Email = this.email;
        contact.MailingStreet = this.address;
        contact.Phone = this.conNum;
        //contact.Appointment_Date__c = this.myDatetime;
        console.log('doc id on selecting appointment ' + this.selectedDate);
        contact.Appointment_Date__c = this.selectedDate;
        contact.SlotsAvailable__c = this.selectedSlot;
        contact.AccountId=this.accountName
        console.log('patient slot booking date ' + this.selectedDate);
        // Call Apex method to save contact 
        



        if (this.selectedDate != null) {
          saveContact({ patientContact: contact })
            .then(result => {
              // Handle successful save
              this.dispatchEvent(
                new ShowToastEvent({
                  title: 'Success',
                  message: 'Appointment Applied Succesfully',
                  variant: 'success'
                })
              );
              this.closeModal();
              window.location.reload();
               
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
        this.dispatchEvent(
          new ShowToastEvent({
            title: 'Fields cannot be empty',
            message: 'Please fill in all required fields',
            variant: 'sticky'
          })
        );
      }
    } else {
      alert('Invalid appointment date please select the date from the current date forward ');
    }




// this.handlebookappointment();
  }


  handleKeyPress(event) {
    const charCode = event.which || event.keyCode;
    const charStr = String.fromCharCode(charCode);

    // Allow only numeric digits
    if (!/^\d$/.test(charStr)) {
      event.preventDefault();
    }

    // Limit the input length to 10 digits
    if (this.phone.length >= 10 && charCode !== 8) {
      event.preventDefault();
      //alert('Please enter a 10-digit numeric phone number.');
    }
  }

      updateContactHandler(event){
        this.visibleContacts=[...event.detail.records]
        console.log(event.detail.records)

    }

}