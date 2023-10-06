import { LightningElement, wire } from 'lwc';
import getBooks from '@salesforce/apex/BookController.getBooks';

//import BOOK_DETAILS_MODAL from 'c/bookDetailsModal';
import { NavigationMixin } from 'lightning/navigation';
export default class BookList extends LightningElement {
    books;
    searchText='';
    selectedType = '';
    showBookDetailsModal = false;
  



    isBookSelected = false;
    selectedBookId = []
    @wire(getBooks, {searchText : '$searchText', selectedType : '$selectedType'})
    wiredBooks({ error, data }) {
        if (data) {
            this.books = data;
        } else if (error) {
            console.error(error);
        }
    }

    handleSearchHandler(event) {
        this.searchText = event.target.value;
        console.log(this.searchText);
    }

   //picklist functionality

   // Property to store the selected type
    typeOptions = [
                    { label: 'None', value: '' },
                    { label: 'Magzines', value: 'Magzines' },
                    { label: 'Periodicals', value: 'Periodicals' },
                    { label: 'Books', value: 'Books' },
                    { label: 'WhitePapers', value: 'WhitePapers' },
        
    ];
//    value = '';

//     get options() {
//         return [
//             { label: 'Magzines', value: 'Magzines' },
//             { label: 'Periodicals', value: 'Periodicals' },
//             { label: 'Books', value: 'Books' },
//             { label: 'WhitePapers', value: 'WhitePapers' },
//         ];
//     }

handleTypeChange(event) {
    this.selectedType = event.detail.value;
    console.log(this.selectedType);
}  

buyBook(event) {
    const bookId = event.currentTarget.dataset.bookId;
    const bookName = event.currentTarget.dataset.bookName;
    
    console.log(bookId,'bookId');
    console.log(bookName,'bookName');
    // Set the selected book ID and show the BookAboutComponent
    this.selectedBookId = []
    this.selectedBookId.push(bookId);
   this.selectedBookId.push(bookName);
    console.log(JSON.stringify(this.selectedBookId));
    this.isBookSelected = true;
    
    console.log('this.isBookSelected',this.isBookSelected);

    this[NavigationMixin.Navigate]({
        type: 'standard__component',
        attributes: {
            componentName: 'c-book-details-modal' // Change this to the actual child component name
            
        },
        state: {
            c__bookId: bookId
        }
    });

    this[NavigationMixin.Navigate]({
        type: 'standard__component',
        attributes: {
            componentName: 'c-book-about-component' // Change this to the actual child component name
            
        },
        state: {
            c__bookId: bookId
        }
    });
}

// cancelClickHandler(){
//     this.isBookSelected = false;
// }

handleCloseModal() {
    this.showBookDetailsModal = false;
}

handleCancelModal(){
    this.isBookSelected = false;
}

openBookDetailsModal(event) {
    const bookId = event.currentTarget.dataset.bookId;
    // Find the selected book based on bookId
    const selectedBook = this.books.find(book => book.Id === bookId);
    
    if (selectedBook && this.books) {
        this.selectedBook = selectedBook;
        this.showBookDetailsModal = true;
    } else {
        // Handle the case where the book with the specified ID was not found
        console.error('Book not found with ID:', bookId);
    }
}
}