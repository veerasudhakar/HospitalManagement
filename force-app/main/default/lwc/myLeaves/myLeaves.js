import { LightningElement ,wire} from 'lwc';
import getMyLeaves from '@salesforce/apex/LeaveRequestController.getMyLeaves';
export default class MyLeaves extends LightningElement {


    MyLeaves = [];
    myLeaveswiredResult;
@wire(getMyLeaves)
wiredmyLeaves(result){
    this.myLeaveswiredResult = result;

    if(result.data){
        this.MyLeaves = result.data;
    }

    if(result.error){
        console.log()
    }
}



}