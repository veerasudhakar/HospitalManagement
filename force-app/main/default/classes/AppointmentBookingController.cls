public class AppointmentBookingController {

   @AuraEnabled
    public static void createPatientRecord(Patient__c patient) {
        insert patient;
    }
}