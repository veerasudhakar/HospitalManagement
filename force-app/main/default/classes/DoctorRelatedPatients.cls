public class DoctorRelatedPatients {

     @Auraenabled(cacheable=true)
    public static List<Patient__c> getPatientRecordsByEmail(String email) {
        List<Doctor__c> doctors = [SELECT Id FROM Doctor__c WHERE Email__c = :email];
        system.debug('email.'+email);
        if (doctors.isEmpty()) {
            return new List<Patient__c>(); // Return an empty list if no doctor found
        }
        
        Id doctorId = doctors[0].Id;
        List<Patient__c> patientRecords = [SELECT Id, Name, Appointment_Date__c, Status__c,Last_Name__c,First_Name__c,SlotsAvailable__c,Phone__c
                                           FROM Patient__c
                                           WHERE Consult_doctor__c = :doctorId AND Status__c = 'Scheduled'];
         system.debug('patientRecords.'+patientRecords);
        return patientRecords;
    }
}