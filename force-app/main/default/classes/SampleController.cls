public with sharing class SampleController {
    @AuraEnabled(cacheable=true)
    public static List<Patient__c> filterRecordsByCriteria(String filterCriteria) {
        Date startDate;
        Date endDate = Date.today();
        if (filterCriteria == 'week') {
            startDate = endDate.toStartOfWeek();
        } else if (filterCriteria == 'month') {
            startDate = endDate.toStartOfMonth();
        } else {
            return null; // Invalid criteria
        }

        return [SELECT Id, Name, Appointment_Date__c FROM Patient__c WHERE Appointment_Date__c >= :startDate AND Appointment_Date__c <= :endDate];
    }
}