import { LightningElement, wire , track} from 'lwc';

import doctorData from '@salesforce/apex/ShowDoctorData.retrieveDoctors';
export default class DoctorComponent extends LightningElement {
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
handlebookappointment(){
    alert('Still we are working on Appointment component');
}
}