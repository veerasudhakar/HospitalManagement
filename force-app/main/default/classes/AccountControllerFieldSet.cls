public with sharing class AccountControllerFieldSet {
    @AuraEnabled(cacheable=True)//Get Account Records
    public static List<Account> getAccountList(){
         return AccountFieldSetCtrl.getAccount();
    }
}