public with sharing class Patientdatacontroller {
     @AuraEnabled(cacheable=true)
      public static List<Patient__c> getPatients() {
        return [SELECT Id, Name, First_Name__c, Last_Name__c,Age__c, Email__c, Status__c FROM Patient__c];
    }

}