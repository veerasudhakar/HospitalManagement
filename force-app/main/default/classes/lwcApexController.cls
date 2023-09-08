public with sharing class lwcApexController {
    @AuraEnabled
    
   public static List<Account> getAccounts(string searchText){
    if(string.isEmpty(searchText)){
        return [Select id,Name,Industry from Account];
    }else{
        searchtext = '%'+searchText+'%';
        return [Select id,Name,Industry from Account Where Name Like:searchtext]; 

    }
   }

@AuraEnabled
public static List<Contact> getAccountContacts(string accountId){
    try {
        return [Select id,LastName from Contact Where AccountId=:accountId];
    } catch (Exception e) {
        throw new AuraHandledException(e.getMessage());
    }
}
}