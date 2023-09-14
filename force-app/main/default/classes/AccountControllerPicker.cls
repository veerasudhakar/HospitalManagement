public with sharing class AccountControllerPicker {
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccountNames() {
        return [SELECT Id, Name FROM Account];
    }

    @AuraEnabled(cacheable=true)
    public static Account getAccountDetails(Id accountId) {
        return [SELECT Id, Name, Industry FROM Account WHERE Id = :accountId];
    }
}