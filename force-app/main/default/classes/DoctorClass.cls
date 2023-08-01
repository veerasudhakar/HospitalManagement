public class DoctorClass {
     @AuraEnabled(cacheable=true)
    public static List<Doctor__c> getSpecialties() {
        return [SELECT Id, Name,Specialty__c FROM Doctor__c];
    }

    @AuraEnabled(cacheable=true)
    public static Doctor__c getDoctorBySpecialtyId(Id specialtyId) {
        return [SELECT Id, Name, Specialty__c /* Add other doctor attributes here */
                FROM Doctor__c
                WHERE Specialty__c = :specialtyId
                LIMIT 1];
    }

}