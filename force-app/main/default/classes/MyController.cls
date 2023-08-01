public with sharing class MyController {
    @AuraEnabled(cacheable=true)
    public static List<Doctor__c> searchDoctors(String searchTerm) {
        String searchQuery = '%' + searchTerm + '%';
        return [SELECT Id, Name FROM Doctor__c WHERE Name LIKE :searchQuery];
    }
}