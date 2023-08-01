public without sharing class DoctorBiography
{
    @AuraEnabled(cacheable=true)
    public static List<Doctor__c> getDoctors(Id recordId) {
        return [SELECT Name,Biograph__c FROM Doctor__c WHERE Id =:recordId ];
    }
}