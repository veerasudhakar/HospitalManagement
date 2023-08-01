import { LightningElement, wire, api, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import HEALTH_IMG from '@salesforce/resourceUrl/Health';
import INVEST_IMG from '@salesforce/resourceUrl/Invest';
import FRUITS_IMG from '@salesforce/resourceUrl/Fruits';
import getApp from '@salesforce/apex/ContactWithImageController2.trackingApp';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import cancelAppointment from '@salesforce/apex/ContactWithImageController2.cancelAppointment';
import getallrescheduleappointments from '@salesforce/apex/RescheduleAppointmentcls_08_06.methodgetappointments';
import getAvailableSlots from '@salesforce/apex/RescheduleAppointmentcls_08_06.methodslots';
import updateRecordData from '@salesforce/apex/RescheduleAppointmentcls_08_06.confirmingreschedulemethod';


export default class HomePage extends NavigationMixin(LightningElement) {
    healthImg = HEALTH_IMG;
    investImg = INVEST_IMG;
    fruitsImg = FRUITS_IMG;
    trackModel = false;
    homePage = true;
    error = false;
    trackModel2 = false;
    inputValue = '';
    inputValue2 = '';
    ptData = [];
    scheduledData = [];
    completedData = [];
    ecData = [];




    doctorid
    selectedRowId;
    selectedDate
    @track isPopupVisible = false;

    @track isShowModal = false;

    @track myappointmentsare;

    submitTrack2(event) {
        console.log('second model')
        getallrescheduleappointments({ email: this.inputValue2 })
            .then(result => {
            console.log('getallrescheduleappointments result......'+JSON.stringify(result));
            this.trackData2 = true;
            this.homePage = false;
            this.trackData = false;
            this.trackModel = false;
            this.error = false;
            this.trackModel2 = false;
            this.myappointmentsare = result;
        })
    }
    availableSlots;
    handleDateChange(event) {
        this.selectedDate = event.target.value;
        //  console.log('doctor id was '+this.doctorId)
        var rowId = event.target.dataset.id; // Access the row ID from the dataset
        this.doctorId = rowId
        // Perform any logic or action with the selected date and row ID
        console.log('Selected Date: ' + this.selectedDate);
        console.log('Row ID: ' + this.doctorId);
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


    patientid;
    handleClick(event) {

        const rowId = event.target.dataset.id;
        var appointmentId = event.target.dataset.string;
        this.patientid = appointmentId;
        console.log('patientidwas' + appointmentId);
        this.selectedRowId = rowId; // Store the row ID in a class variable
        this.isShowModal = true;
    }


    getSlots() {
        //  console.log('doc id ' + this.doctorId);
        console.log('the doc id was in getting slots ' + this.doctorId)
        getAvailableSlots({ selectedDate: this.selectedDate, doctorid: this.doctorId })
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



    closePopup() {
        this.isPopupVisible = false;
    }
    hideModalBox() {
        this.isShowModal = false;
    }

    handleconfirmToo() {

        console.log(this.patientid);
        //alert('date '+this.selectedDate+'slot'+this.selectedSlot);

        updateRecordData({ patientId: this.patientid, selectedDate: this.selectedDate, selectedslot: this.selectedSlot, email : this.inputValue2 })
            .then(result => {
                // Handle the response from Apex, if needed
            console.log('getallrescheduleappointments result......'+JSON.stringify(result));
            this.trackData2 = true;
            this.homePage = false;
            this.trackData = false;
            this.trackModel = false;
            this.error = false;
            this.trackModel2 = false;
            this.myappointmentsare = [];
            let resultArray = result;
                        this.myappointmentsare = resultArray.map((record, index) => {
                            return { ...record, index: index + 1 };
                        })
                console.log('Record updated successfully');
                this.showToast('Success', 'Record updated successfully', 'success');

            })
            .catch(error => {
                // Handle any error that occurs during the Apex call
                console.error(error);
                this.showToast('Error', 'An error occurred while updating the record', 'error');
            });
        this.isPopupVisible = false;
        this.isShowModal = false;
    }


    handleConfirmReschedule() {
        this.isShowModal = false;
        this.isPopupVisible = true;

    }

    showToast(title, message, variant) {
        const toastEvent = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(toastEvent);
    }

    @track cities = [
        {
            id: 'New Delhi',
            name: 'New Delhi',
            logoUrl: 'https://www.apollohospitals.com/wp-content/themes/apollohospitals/assets-v3/images/delhi_city.svg'
        },
        {
            id: 'Bangalore (Bengaluru)',
            name: 'Bangalore',
            logoUrl: 'https://www.apollohospitals.com/wp-content/themes/apollohospitals/assets-v3/images/bangalore_city.svg'
        },
        {
            id: 'Hyderabad',
            name: 'Hyderabad',
            logoUrl: 'https://www.apollohospitals.com/wp-content/themes/apollohospitals/assets-v3/images/hyderabad_city.svg'
        },
        {
            id: 'Chennai',
            name: 'Chennai',
            logoUrl: 'https://www.apollohospitals.com/wp-content/themes/apollohospitals/assets-v3/images/chennai_city.svg'
        },
        {
            id: 'Mumbai',
            name: 'Mumbai',
            logoUrl: 'https://www.apollohospitals.com/wp-content/themes/apollohospitals/assets-v3/images/mumbai_city.svg'
        },
        {
            id: 'Lucknow',
            name: 'Lucknow',
            logoUrl: 'https://www.apollohospitals.com/wp-content/themes/apollohospitals/assets-v3/images/lucknow_city.svg'
        },
    ];

    trackAppointment() {
        this.trackModel = true;
    }
    closeModal() {
        this.trackModel = false;
        this.trackModel2 = false;
    }
    trackApp(event) {
        this.inputValue = event.target.value;
        this.error = false;
    }
    trackApp2(event) {
        this.inputValue2 = event.target.value;
        this.error = false;
    }
    submitTrack() {
        if (this.inputValue != '') {
            getApp({ email: this.inputValue })
                .then(result => {
                    console.log('tracking result.....' + result.length);
                    console.log('data...' + result);
                    if (result.length > 0) {

                        let resultArray = result;
                        this.ptData = resultArray.map((record, index) => {
                            return { ...record, index: index + 1 };
                        })
                        for (let i = 0; i < result.length; i++) {
                            if (result[i].Status__c == 'Scheduled') {
                                console.log('result[i].data.Status__c ....' + result[i].Status__c);
                                this.scheduledData.push(result[i]);
                            }
                            if (result[i].Status__c == 'Completed') {
                                console.log('result[i].data.Status__c ....' + result[i].Status__c);
                                this.completedData.push(result[i]);
                            }
                            if (result[i].Status__c == 'Expired/Cancelled') {
                                console.log('result[i].data.Status__c ....' + JSON.stringify(result[i]));
                                this.ecData.push(result[i]);
                            }
                        }
                        let resultArray2 = this.scheduledData;
                        this.scheduledData = resultArray2.map((record, index) => {
                            return { ...record, index: index + 1 };
                        })
                        let resultArray3 = this.completedData;
                        this.completedData = resultArray3.map((record, index) => {
                            return { ...record, index: index + 1 };
                        })
                        let resultArray4 = this.ecData;
                        this.ecData = resultArray4.map((record, index) => {
                            return { ...record, index: index + 1 };
                        })
                        console.log('scheduledData-->', this.scheduledData)
                        this.homePage = false;
                        this.trackData = true;
                        this.trackData2 = false;
                        this.trackModel = false;
                        this.error = false;
                    }
                    else if (result.length == 0) {
                        if (this.inputValue != null) {
                            this.error = true;
                        }
                    }
                })
        }
    }
    
    backToHome() {
        this.homePage = true;
        this.trackModel = false;
        this.trackModel2 = false;
        this.trackData = false;
        this.trackData2 = false;
    }
    cancelApt(event) {
        console.log(event.target.value)
        console.log(event.target.name)

        cancelAppointment({ aptId: event.target.value, em: event.target.name })
            .then(result => {
                console.log('result...' + result);
                if (result) {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'Your Appointment was Cancelled Successfully',
                            variant: 'Success'
                        })
                    );
                    if (result.length > 0) {

                        this.ptData = [];
                        this.scheduledData = [];
                        this.completedData = [];
                        this.ecData = [];

                        let resultArray = result;
                        this.ptData = resultArray.map((record, index) => {
                            return { ...record, index: index + 1 };
                        })
                        for (let i = 0; i < result.length; i++) {
                            if (result[i].Status__c == 'Scheduled') {
                                console.log('result[i].data.Status__c ....' + result[i].Status__c);
                                this.scheduledData.push(result[i]);
                            }
                            if (result[i].Status__c == 'Completed') {
                                console.log('result[i].data.Status__c ....' + result[i].Status__c);
                                this.completedData.push(result[i]);
                            }
                            if (result[i].Status__c == 'Expired/Cancelled') {
                                console.log('result[i].data.Status__c ....' + JSON.stringify(result[i]));
                                this.ecData.push(result[i]);
                            }
                        }
                        let resultArray2 = this.scheduledData;
                        this.scheduledData = resultArray2.map((record, index) => {
                            return { ...record, index: index + 1 };
                        })
                        let resultArray3 = this.completedData;
                        this.completedData = resultArray3.map((record, index) => {
                            return { ...record, index: index + 1 };
                        })
                        let resultArray4 = this.ecData;
                        this.ecData = resultArray4.map((record, index) => {
                            return { ...record, index: index + 1 };
                        })
                        this.homePage = false;
                        this.trackModel = false;
                        this.error = false;
                    }
                    else if (result.length == 0) {
                        if (this.inputValue != null) {
                            this.error = true;
                        }
                    }
                }
            })
    }

    navPage() {
        this[NavigationMixin.Navigate]({
            type: 'standard__navItemPage',
            attributes: {
                apiName: 'Patient_Appointment',
            },
        });
    }


    resecheduleAppointment() {
        this.trackModel = false
        this.trackModel2 = true;
    }
}