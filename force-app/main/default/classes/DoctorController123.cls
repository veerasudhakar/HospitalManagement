public class DoctorController123 {
      @AuraEnabled(cacheable=true)
    public static List<Map<String, String>> getDoctorOptions() {
        List<Map<String, String>> options = new List<Map<String, String>>();
        List<Doctor__c> doctors = [SELECT Id, Name FROM Doctor__c];
        for (Doctor__c doctor : doctors) {
            Map<String, String> option = new Map<String, String>();
            option.put('value', doctor.Id);
            option.put('label', doctor.Name);
            options.add(option);
        }
        return options;
    }

    @AuraEnabled(cacheable=true)
    public static List<Patient__c> getPatientRecords(String doctorId) {
        List<Patient__c> patientRecords = [SELECT Id, Name, Appointment_Date__c, Status__c
                                           FROM Patient__c
                                           WHERE Consult_doctor__c = :doctorId AND Status__c = 'Scheduled'];
        return patientRecords;
    }

}