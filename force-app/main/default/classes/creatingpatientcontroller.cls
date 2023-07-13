public class creatingpatientcontroller {

    @AuraEnabled
    public static string patientcreationmethod(Contact patientContact){
        System.debug('the new patient was '+patientContact);
        Id doctorRecordTypeId = Schema.SObjectType.Contact.getRecordTypeInfosByName().get('Patients').getRecordTypeId();
        system.debug('the patients id was '+doctorRecordTypeId);
        patientContact.RecordTypeId = doctorRecordTypeId;
        Contact cosss = patientContact;
        cosss.Status__c = 'Scheduled';
        system.debug('the insertion id was '+cosss.RecordTypeId);
        if(patientContact.Appointment_Date__c !=null){
            System.debug('the checked appointment date was '+patientContact.Appointment_Date__c);
        }
        try{
            insert cosss ;
            return 'success';
        }catch (exception e){
            system.debug('the error was '+e);
            return e.getMessage();
        }
    }
}