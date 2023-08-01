public class UserDetails{
    @AuraEnabled (cacheable=true)
    public static List<Doctor__c> getCurrentUserDoctorRecords() {
        // Step 1: Get the current user's ID
        String currentUserId = UserInfo.getUserId(); 
        // Step 2: Query the doctor__c records where Owner__c (lookup to User) is the current user 
        List<Doctor__c> currentUserDoctors = [SELECT Id, Name,phone__c,Email__c,Specialty__c  FROM Doctor__c WHERE OwnerId = :currentUserId]; 
        return currentUserDoctors; 
    }
}