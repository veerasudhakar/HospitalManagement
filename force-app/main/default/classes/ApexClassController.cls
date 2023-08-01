public with sharing class ApexClassController {
    @AuraEnabled
    public static void updateDoctorRecord(Map<String, Object> doctorData) {
        try {
            Doctor__c doctorRecord = new Doctor__c(
                Id = (String)doctorData.get('Id'),
                Name = (String)doctorData.get('Name'),
                Phone__c = (String)doctorData.get('Phone__c'),
                Email__c = (String)doctorData.get('Email__c'),
                Image_Url__c = (String)doctorData.get('Image_Url__c'),
                Specialty__c = (String)doctorData.get('Specialty__c'),
                Description__c = (String)doctorData.get('Description__c')
                // Add other fields as needed
            );
            update doctorRecord;
        } catch (Exception ex) {
            throw new AuraHandledException('Error while updating the Doctor record: ' + ex.getMessage());
        }
    }
}