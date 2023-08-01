public with sharing class SearchController {
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContactSearchResults(String specialityValue, String locationValue) {
        // Query the Contact records based on the selected field values
        // Replace "Speciality__c" and "Location__c" with the API names of the fields you want to search on the Contact object
        String query = 'SELECT Id, Name FROM Contact WHERE Speciality__c = :specialityValue AND Location__c = :locationValue';
        return Database.query(query);
    }
}