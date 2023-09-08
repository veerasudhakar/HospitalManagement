public with sharing class accountRecordsExample {
    @AuraEnabled(Cacheble=true)

    public static  AccountRecords(accountid){

        List<Account> accounts = [Select Id,Name,Industry from Account Where Id In:accountid];
        return accounts;
    }
   
}