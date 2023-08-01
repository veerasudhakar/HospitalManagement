public class DoctorInfo {
    @AuraEnabled(cacheable=true)
    public static List<Doctor__c> getBio(String recordId) {
        List<Doctor__c> doctors = new List<Doctor__c>();
        
        try {
            // Perform a null check on recordId before querying the database
            if (recordId != null && recordId.trim() != '') {
                doctors = [SELECT Id, Name, Image_Url__c, Specialty__c,Location__c,Languages_Known__c,Biograph__c 
                           FROM Doctor__c WHERE Id = :recordId];
            }
        } catch (Exception ex) {
            // Handle any exceptions that may occur during the query
            System.debug('Exception occurred: ' + ex.getMessage());
            // You can also add a custom error message to return to the Lightning component
            // doctors.add(new Doctor__c(Name = 'Error', Biograph__c = 'Unable to retrieve data.'));
        }
        
        return doctors;
    }
}