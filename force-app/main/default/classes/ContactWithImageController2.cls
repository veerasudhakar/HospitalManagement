public with sharing class ContactWithImageController2 {
    
    @AuraEnabled(cacheable=true)
    public static List<Contact> trackingApp(string email){
        return [SELECT Id, Email, Name,Appointment_Date__c,SlotsAvailable__c,Status__c,CancelledSlot__c,Consult_doctor__r.Name  FROM Contact WHERE Email LIKE: email AND RecordType.Name = 'Patients' ];
    }
    @AuraEnabled
    public static List<Contact> cancelAppointment(string aptId, string em){
        List<Contact> s = new List<Contact>();
       Contact con = [SELECT Id, Appointment_Date__c,Status__c,CancelledSlot__c ,SlotsAvailable__c FROM Contact WHERE Id =: aptId AND RecordType.Name = 'Patients'];
        con.Status__c = 'Expired/Cancelled';
        con.CancelledSlot__c = con.SlotsAvailable__c;
        con.SlotsAvailable__c='';
        try{
            update con;
            s = [SELECT Id, Email, Name,Appointment_Date__c,SlotsAvailable__c,Status__c,CancelledSlot__c,Consult_doctor__r.Name  FROM Contact WHERE Email LIKE: em AND RecordType.Name = 'Patients' ];
        }
        catch(Exception e){
            system.debug(e);
            
        }
        return s;
    }
    @AuraEnabled(cacheable=true)
    public static List<ContactWithImageData> getContacts(string searchval01, string searchval02 , string searchval03) {
        system.debug('the location was '+searchval03);
        System.debug('the second value ' + searchval02);
        List<ContactWithImageData> contactsWithImageData = new List<ContactWithImageData>();
        system.debug('the input value is ' + searchval01);
        
        string query = 'Select Id, FirstName,Image_Url__c,LastName, MailingPostalCode,Account.Name,AccountId, Years_of_experience__c, Specialty__c, Email, Location__c, (SELECT Id, ContentDocument.LatestPublishedVersionId FROM ContentDocumentLinks) FROM Contact';
        
        // Get the ID of the Doctor record type
        Id doctorRecordTypeId = Schema.SObjectType.Contact.getRecordTypeInfosByName().get('Doctors').getRecordTypeId();
        
        // Filter the query by the Doctor record type
        query += ' WHERE RecordTypeId = \'' + doctorRecordTypeId + '\'';
        
        // Add search criteria to the query
        if (String.isNotBlank(searchval01)) {
            query += ' AND Name LIKE \'%' + searchval01 + '%\'';
        }
        if (String.isNotBlank(searchval02)) {
            query += ' AND Specialty__c = \'' + searchval02 + '\'';
        } 
        if(String.isBlank(searchval02) && String.isNotBlank(searchval03)){
            query += ' AND Location__c = \'' + searchval03 + '\'';
        }
        if(String.isNotBlank(searchval02) && String.isNotBlank(searchval03)){
            query += 'AND Specialty__c = \'' + searchval02 + '\' AND Location__c = \''+ searchval03 + '\'';
        }
        
        list<Contact> contacts = Database.query(query);
        
        System.debug('the contacts are ' + contacts);
        
        for (Contact contact : contacts) {
            if (contact.ContentDocumentLinks.size() > 0) {
                ContentDocumentLink cdl = contact.ContentDocumentLinks[0];
                ContentVersion cv = [SELECT VersionData, FileType FROM ContentVersion WHERE ContentDocumentId = :cdl.ContentDocumentId];
                contactsWithImageData.add(new ContactWithImageData(contact, cv));
            } else {
                contactsWithImageData.add(new ContactWithImageData(contact, null));
            }
        }
        
        return contactsWithImageData;
    }
    
    public class ContactWithImageData {
        @AuraEnabled public String Id;
        @AuraEnabled public String FirstName;
        @AuraEnabled public string Postalcode ;
        @AuraEnabled public String LastName;
        @AuraEnabled public Decimal Yearsofexp;
        @AuraEnabled public String AccountName ; 
        @AuraEnabled public String Email;
        @AuraEnabled public String imageData;
        @AuraEnabled public String imageFileType;
        @AuraEnabled public string Location;
        @AuraEnabled public string Specialty;
        @AuraEnabled public string AccountId;
        
        public ContactWithImageData(Contact contact, ContentVersion cv) {
            Id = contact.Id;
            AccountName = contact.Account.Name;
            FirstName = contact.FirstName;
            Postalcode = contact.MailingPostalCode;
            LastName = contact.LastName;
            Yearsofexp = contact.Years_of_experience__c;
            Email = contact.Email;
            Location = contact.Location__c;
           Specialty = contact.Specialty__c;
            AccountId=contact.AccountId;
            if (cv != null) {
                imageData = EncodingUtil.base64Encode(cv.VersionData);
                imageFileType = cv.FileType;
            }
        }
    }

    
}