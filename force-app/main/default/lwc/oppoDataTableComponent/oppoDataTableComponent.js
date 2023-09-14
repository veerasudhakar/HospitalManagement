import { LightningElement,wire } from 'lwc';
import oppolist from '@salesforce/apex/OppoDatatableController.oppolist';
import {NavigationMixin} from 'lightning/navigation';
const COLUMNS = [
    {label : 'Name', fieldName : 'Name'},
    {label : 'stagename', fieldName : 'StageName'},
    {label : 'closeDate', fieldName : 'CloseDate'},
    {type : 'button', 
    typeAttributes: { label: 'View', name: 'view', title: 'View', iconName: 'utility:preview' },
}
]
export default class OppoDataTableComponent extends NavigationMixin(LightningElement) {

    columns = COLUMNS;
    oppoList = [];
    searchText='';
@wire (oppolist, {searchText : '$searchText'})

wiredoppolist({data,error}){

if(data){
    console.log(data,'data');
   this.oppoList = data;
   console.log(this.oppoList);
}else if(error){
    this.error = error;
    console.log(error);
}
}

handleClick(event){

    const actionName = event.detail.action.name;
    const row = event.detail.row;
    console.log(row,'row');
    
    this[NavigationMixin.Navigate]({
        type : 'standard__recordPage',
        attributes: {
    recordId : row.Id,
    objectApiName : 'Opportunity',
    actionName : 'view',
        },
    });
    }
// handleClick(){
//     oppolist()
//     .then((result) =>{
//         this.oppoList = result;
//         this.error = undefined;
//     })
//     .catch((error)=>{
//         this.error = error;
//         this.oppoList = undefined;
//     });

// }
handleSaerchHandler(event){
   
this.searchText = event.target.value;
if(this.searchText ===''){
this.refreshData;
}
}

refreshData(){
    oppolist({searchText : ''})
    .then(result=>{
        this.oppoList = result;
    })
    .catch(error=>{
        this.error=error;
    }
        );

    
}

// filtersearch = '';

// handleSaerchHandler(event){
//     console.log('event',event);
// this.filtersearch = event.target.value.toLowerCase();
// console.log(this.filtersearch);
// this.applyFilter();
// }

// applyFilter(){
// const filteredData=this.oppoList.filter(opportunity=>{
//     return(
//         opportunity.Name.toLowerCase().includes(this.filtersearch) ||
//         (opportunity.stageName.toLowerCase().includes(this.filtersearch)) ||
//         (opportunity.CloseDate.toLowerCase().inlucdes(this.filtersearch))
//     );
// });
// this.oppoList = filteredData;
// }


}