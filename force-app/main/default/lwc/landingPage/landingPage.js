import { LightningElement,wire,track  } from 'lwc';
 import doctorData from '@salesforce/apex/ShowDoctorData.retrieveDoctors';
import { NavigationMixin } from 'lightning/navigation';
// import Courosal1 from '@salesforce/resourceUrl/Courosal1';
export default class LandingPage extends NavigationMixin (LightningElement) {

 @track allDoctors ;
 @wire(doctorData)
 allDoctorsData({data, error}){
     if(data){
         console.log('data',data);
         this.allDoctors = data;
   } else if(error){
        console.log('error', error);
     }
 }
handleButtonClick() {
        // Navigate to a URL
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
               url:"https://wisseninfotech-cb-dev-ed.develop.my.site.com/Patient1Site/s/login/?startURL=%2FPatient1Site%2Fs%2F%3Ft%3D1688016377986"
            }
        });
  // Replaces the current page in your browser history with the URL
}
}