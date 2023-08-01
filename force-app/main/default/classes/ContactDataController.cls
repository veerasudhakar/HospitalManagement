public class ContactDataController {
    @AuraEnabled(cacheable=true)
    public static list<Case> fetchContacts(){ 
        list<Case> lstContact =  [SELECT Id, Status,Case_No__c,Case_Owner_Name__c, Reason, Origin, Subject, Priority, Product__c FROM Case  ];
        System.debug('lstContact'+lstContact);
        return lstContact;     
    }

     @AuraEnabled(cacheable=true)
    public static list<Case> fetchContacts4(String fieldApi,String selectedValue){ 
        list<Case> lstContact = new list<Case>();
        //list<Case> lstContact =  [SELECT Id, Status,Case_No__c, Reason,Case_Owner_Name__c, Origin, Subject, Priority, Product__c FROM Case  ];
        String Query='SELECT Id, Status, Reason, Origin,Case_No__c,Case_Owner_Name__c, Subject, Priority, Product__c FROM Case ';
        if(fieldApi !='' && selectedValue !=''){
            Query=Query+' WHERE '+fieldApi+'=\''+selectedValue+'\'';
             System.debug('Query'+Query);
            lstContact = Database.query(Query);
             return lstContact;  
        }else{
             lstContact = Database.query(Query);
             return lstContact; 
        }        
    }
}