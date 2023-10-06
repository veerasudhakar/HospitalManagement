import { LightningElement,api,wire} from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import BORROW_OBJECT from '@salesforce/schema/Borrowed_Books__c';
import BOOK_ID from '@salesforce/schema/Borrowed_Books__c.Book_ID__c';
import BORROW_DATE from '@salesforce/schema/Borrowed_Books__c.Borrowed_Date__c';
import MEMBER_ID from '@salesforce/schema/Borrowed_Books__c.Member_ID__c';
import CONTACT from '@salesforce/schema/Borrowed_Books__c.Contact__c';
import insertBorrowedBook from '@salesforce/apex/BookController.insertBorrowedBook';
import getCurrentContact from '@salesforce/apex/BookController.getCurrentContact';
export default class BookAboutComponent extends LightningElement {
    borrowedBook = {};
    @api bookdata;
    bookName
    bookId

    fields = [CONTACT];
    async renderedCallback(){
        console.log('bookdata.....'+(JSON.stringify(this.bookdata[0])));
        this.bookName = this.bookdata[0];
        this.bookId = this.bookdata[1];
        
    }
    
    bookid1 = BOOK_ID;
    borrowdate = BORROW_DATE;
    memberId = MEMBER_ID;
    contact = CONTACT;

    rec = {
        Book_ID__c : this.bookid1,
        Borrowed_Date__c : this.borrowdate,
        Member_ID__c : this.memberId,
        Contact__c : ''
    };

    @wire(getCurrentContact, { fields: '$fields' })
wiredgetcontacts({data, error}){
    if(data){
        this.rec.Contact__c = data.Id;
        console.log(data.Id);
    }
    if(error){
        console.log(error);
    }
}



    handleBorrowedChange(event){
        this.rec.Borrowed_Date__c = event.target.value;
        console.log(this.rec.Borrowed_Date__c);
        console.log((JSON.stringify(this.bookdata,'bookdata')));
        console.log(this.bookdata.Id,'bookdata[0].Id');
        console.log(this.bookdata.Name,'bookdata[1].Name');
    }

    handlebookChange(event){
this.rec.Book_ID__c = event.target.value;
console.log(this.rec.Book_ID__c);
    }

    handleMemberChange(event){
this.rec.Member_ID__c = event.target.value;
console.log(this.rec.Member_ID__c);
    }

    handleContactChange(event){
        this.rec.Contact__c = event.target.value;
        console.log(this.rec.Contact__c);
    }

    handleClick() {
        insertBorrowedBook({ borrowedBook : this.borrowedBook })
            .then(result => {
                this.borrowedBook = result;
                console.log('result');
                this.error = undefined;
                if(this.borrowedBook !== undefined) {
                    this.rec.Borrowed_Date__c = '';
                    this.rec.Book_ID__c = '';
                    this.rec.Member_ID__c = '';
                    this.rec.Contact__c = '';
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'Borrowed Book Created Successfully',
                            variant: 'success',
                        }),
                    );
                }
                
                console.log(JSON.stringify(result));
                console.log("result", this.message);
            })
            .catch(error => {
                this.borrowedBook = undefined;
                this.error = error;
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error creating record',
                        message: error.body.message,
                        variant: 'error',
                    }),
                );
                console.log("error", JSON.stringify(this.error));
            });
    }

    @api book;

    cancelClickHandler() {
        // Dispatch an event to close the modal
        const closeModalEvent = new CustomEvent('cancelclickhandler');
        console.log('closeModalEvent',closeModalEvent);
        this.dispatchEvent(closeModalEvent);
        console.log('this.dispatchEvent');
    }

}