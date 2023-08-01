public with sharing class DoctorSearchController {
    @AuraEnabled(cacheable=true)
    public static List<Doctor__c> performSearch(String specialityValue, String doctorValue) {
        List<Doctor__c> searchResults = new List<Doctor__c>();
        
        // Implement your search logic based on the Speciality and Doctor fields
        // For example, you can query the doctors based on the field values
        
        // Sample code to perform the search
        searchResults = [SELECT Id, Name, Specialty__c, DoctorId__c FROM Doctor__c WHERE Specialty__c =: specialityValue AND DoctorId__c =: doctorValue];
        
        return searchResults;
    }
    @AuraEnabled(cacheable=true)
    public static list<Doctor__c> getmydoctor(string doctorname){
        list<Doctor__c> myselectedDoctor = [select Id, Name, Specialty__c,Description__c,Image_Url__c, DoctorId__c FROM Doctor__c where Name =: doctorname];
        system.debug('myselectedDoctor'+myselectedDoctor);
        return myselectedDoctor;
    }
}