public with sharing class opportunityController {
   @AuraEnabled(cacheable=true)
   public static List<Opportunity> oppoList(String opportunityIds){
    List<Id> idsList = opportunityIds.split(',');
    return [SELECT Id, Name, CloseDate, StageName, Amount FROM Opportunity WHERE Id IN :idsList];
   }
   
   
}