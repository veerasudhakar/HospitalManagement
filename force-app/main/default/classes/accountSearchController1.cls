public with sharing class accountSearchController1 {
   @AuraEnabled(Cacheable=true)
    public static List<Account> getAccount(string searchText) {
        try {
            if(string.isEmpty(searchText)){
                return[Select Id,Name,Industry from Account];
            }else{
                searchText = '%'+searchText+'%';
                return[Select Id,Name,Industry from Account where Name LIKE:searchText];
            }
           
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static List<Contact> getAccountContacts(string accountId){
        try {
return[Select Id,Name from Contact where accountId=:accountId];
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
   
}