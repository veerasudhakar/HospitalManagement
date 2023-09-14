public with sharing class OppoDatatableController {
    @AuraEnabled(cacheable=true)
    public static List<Opportunity> oppolist(string searchText){
        try {
           if(string.isEmpty(searchText)){
            return [Select Id,Name,StageName,CloseDate from Opportunity];
           }else{
searchText = '%'+searchText+'%';
return[Select Id,Name,StageName,CloseDate from Opportunity where Name LIKE:searchText];
           }  
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
   
    @AuraEnabled(cacheable=true)
    public static List<Contact> getcontacts(){
        try {
            return [Select Id,Name,Email,LeadSource from Contact];
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}