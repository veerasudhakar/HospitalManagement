public with sharing class BookController {
    /*
    @AuraEnabled(cacheable=true)
    public static List<Book__c> getBooks(string searchText) {
        if (string.isEmpty(searchText)) {
            return [SELECT Id, Name, Date_of_arrival__c, Book_ID__c, Author__c, Type__c, Price_of_the_book__c, Description__c, Image_Url__c FROM Book__c];
        } else {
            searchText = '%' + searchText + '%';
            return [
                SELECT Id, Name, Date_of_arrival__c, Book_ID__c, Author__c, Type__c, Price_of_the_book__c, Description__c, Image_Url__c
                FROM Book__c
                WHERE Name LIKE :searchText OR Author__c LIKE :searchText
            ];
        }
    }
    */
    /*
    @AuraEnabled(cacheable=true)
   public List<BookListWrapper> getborrowBooksList(string userEmail){

    List<BookListWrapper> wrapperbook = new List<BookListWrapper>();
    List<Borrowed_Books__c> books=[SELECT Id, Name, Book_ID__r.Name, Borrowed_Date__c, Member_ID__r.Name,
     Return_Date_c__c, Contact__c FROM Borrowed_Books__c WHERE Contact__r.Email=:userEmail];

     for(Borrowed_Books__c book : books){
        BookListWrapper wrappers = new BookListWrapper();
        wrappers.bookName = book.Book_ID__r.Name;
        wrappers.memberName = book.Member_ID__r.Name;
        wrappers.Name = book.Name;
        wrappers.returndate = book.Return_Date_c__c;
        wrappers.barroweddate = Borrowed_Date__c;
        wrapperbook.add(wrappers);
     }

return wrapperbook;
   }
      */
      
      @AuraEnabled(cacheable=true)
    public static List<BookListWrapper> getListBooks(string userEmail) {
        List<BookListWrapper> bookWrappers = new List<BookListWrapper>();

        List<Borrowed_Books__c> books = [SELECT Id,Name, Book_ID__r.Name, Member_ID__r.Name,
                                          Borrowed_Date__c, Actual_Returned_Date__c, Return_Date_c__c
                                          FROM Borrowed_Books__c
                                          WHERE Contact__r.Email = :userEmail];

        for (Borrowed_Books__c book : books) {
            BookListWrapper wrapper = new BookListWrapper();
            wrapper.bookName = book.Book_ID__r.Name;
            wrapper.memberName = book.Member_ID__r.Name;
            wrapper.borrowedDate = book.Borrowed_Date__c;
            wrapper.Name = book.Name;
            wrapper.returnDate = book.Return_Date_c__c;
            bookWrappers.add(wrapper);
        }

        return bookWrappers;
    }
    


    @AuraEnabled(cacheable=true)
    public static List<Book__c> getBooks(string searchText, string selectedType) {
        String searchQuery = 'SELECT Id, Name, Date_of_arrival__c, Book_ID__c, Author__c, Type__c, Price_of_the_book__c, Description__c, Image_Url__c FROM Book__c';

        if (!String.isEmpty(searchText) || !String.isEmpty(selectedType)) {
            searchQuery += ' WHERE';
        }

        if (!String.isEmpty(searchText)) {
            searchText = '%' + searchText + '%';
            searchQuery += ' (Name LIKE :searchText OR Author__c LIKE :searchText)';
        }

        if (!String.isEmpty(searchText) && !String.isEmpty(selectedType)) {
            searchQuery += ' AND';
        }

        if (!String.isEmpty(selectedType)) {
            searchQuery += ' Type__c = :selectedType';
        }
        System.debug('searchQuery'+searchQuery);
        return Database.query(searchQuery);
    }
    /*
    @AuraEnabled
    public static Borrowed_Books__c insertborrowMethod(Borrowed_Books__c borrowedBook){
        try {
            INSERT borrowedBook;
            RETURN borrowedBook;
        } catch (Exception EXP) {
            throw NEW AuraHandledException(EXP.getMessage());
        }
    }
*/

    @AuraEnabled
    public static void insertBorrowedBook(Borrowed_Books__c borrowedBook) {
        system.debug('borrowedBook'+borrowedBook);
        insert borrowedBook;
        //return borrowedBook;
    }

    @AuraEnabled(cacheable=true)
    public static Contact getCurrentContact() {
        // Get the current user's Id
        Id userId = UserInfo.getUserId();

        // Query for the Contact associated with the user's Id
        Contact currentContact = [SELECT Id FROM Contact WHERE OwnerId = :userId LIMIT 1];

        return currentContact;
    }


//     @AuraEnabled(cacheable=true)
// public static Book__c getBookById(Id bookId) {
//     return [SELECT Id, Name, Author__c, Image_Url__c FROM Book__c WHERE Id = :bookId LIMIT 1];
// }

// @AuraEnabled(cacheable=true)
// public static Contact getCurrentUserContact(Id userId) {
//     return [SELECT Id FROM Contact WHERE AccountId = :userId LIMIT 1];
// }
   
    
}