import { LightningElement,track,wire } from 'lwc';
import getBio from '@salesforce/apex/DoctorInfo.getBio';
export default class DoctorDetailPage extends LightningElement {
    dtrDetail
    @wire(getBio)
    dtrData({data,error}){
        if(data){
            this.dtrDetail = data
        }else if(error){
            console.log(error)
        }
    }
}