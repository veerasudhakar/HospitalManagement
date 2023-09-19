public with sharing class contactApexExample {
    @AuraEnabled(cacheable=true)
    public static List<Contact> getcontacts(){
        try {

            return[Select Id,Name,LeadSource from Contact];
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}