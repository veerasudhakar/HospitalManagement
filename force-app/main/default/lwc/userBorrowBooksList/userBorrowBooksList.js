import { LightningElement,wire,track } from 'lwc';
import getListBooks from '@salesforce/apex/BookController.getListBooks';
import Id from '@salesforce/user/Id';
import { getRecord } from 'lightning/uiRecordApi';
import UserNameFIELD from '@salesforce/schema/User.Name';
import userEmailFIELD from '@salesforce/schema/User.Email';
import userIsActiveFIELD from '@salesforce/schema/User.IsActive';
import userAliasFIELD from '@salesforce/schema/User.Alias';
  
const COLUMNS = [
    {label: 'Name', fieldName : 'Name'},
    { label: 'Book Name', fieldName: 'bookName' },
    { label: 'Member Name', fieldName: 'memberName' },
    { label: 'Borrowed Date', fieldName: 'borrowedDate', type: 'date' },
    // { label: 'Actual Returned Date', fieldName: 'actualReturnedDate', type: 'date' },
    { label: 'Return Date', fieldName: 'returnDate', type: 'date' },
];


export default class UserBorrowBooksList extends LightningElement {
    currentUser;
    @track error;
    @track userId = Id;
    @track currentUserName;
    @track currentUserEmail;
    @track currentIsActive;
    @track currentUserAlias;
@track booksList=[];
@track columns = COLUMNS;


@wire(getRecord, { recordId: Id, fields: [UserNameFIELD, userEmailFIELD, userIsActiveFIELD, userAliasFIELD ]}) 
    currentUserInfo({error, data}) {
        if (data) {
            this.currentUserName = data.fields.Name.value;
            this.currentUserEmail = data.fields.Email.value;
            this.currentIsActive = data.fields.IsActive.value;
            this.currentUserAlias = data.fields.Alias.value;
        } else if (error) {
            this.error = error ;
        }
    }

@wire(getListBooks, {userEmail : '$currentUserEmail'})
wiredborrowedBooks({data, error}){
    console.log('Email...'+JSON.stringify(this.userId));
    if(data){
        this.booksList = data;
        console.log('data...'+JSON.stringify(data));
    }
    if(error){
        this.booksList = undefined;
        console.log(undefined);
    }
}
}
