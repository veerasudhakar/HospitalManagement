public with sharing class myAppointment {
    @AuraEnabled(cacheable=true)
    public static List<Appointment__c> RelatedRecordsController(ID contactId) {
        return [SELECT Name, Appointment_Date__c, Doctor__r.Name,  Contact__r.Name , SlotsAvailable__c FROM Appointment__c WHERE Contact__c	 = :contactId];
    }
}