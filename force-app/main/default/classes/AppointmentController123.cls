public with sharing class AppointmentController123 {
    @AuraEnabled(cacheable=true)
    public static List<Contact> getDoctorContacts(String doctorUsername) {
        return [SELECT Id, Name, Email FROM Contact WHERE Id IN (SELECT Contact__c FROM Appointment__c WHERE Doctor__r.Username = :doctorUsername)];
    }

    @AuraEnabled(cacheable=true)
    public static List<Appointment__c> getContactAppointments(Id contactId) {
        return [SELECT Id, Name, Date__c, Description__c FROM Appointment__c WHERE Contact__c = :contactId];
    }
}