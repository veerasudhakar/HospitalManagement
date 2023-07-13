import { LightningElement, wire, track} from 'lwc';
import Doctorsinfo from '@salesforce/apex/DoctorInfo.getBio';

export default class GetDataDisplayData extends LightningElement {
  @track allDoctors ;
  @wire(Doctorsinfo)

  allDoctorsData({data, error}){
    if(data){
        console.log('data',data);
        this.allDoctors = data;
  } else if(error){
       console.log('error', error);
    }
}

}