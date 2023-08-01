public class AppointmentController {
    @AuraEnabled(cacheable=true)
    public static List<Appointment__c> getDoctorAppointments(String doctorUserEmail) {
        // Query appointments related to the doctor's userEmail
        return [SELECT Id, Name, Doctor__c, Appointment_Date__c, Status__c, SlotsAvailable__c, Contact__c 
                FROM Appointment__c
                WHERE Doctor__r.Email__c = :doctorUserEmail];
    }

}