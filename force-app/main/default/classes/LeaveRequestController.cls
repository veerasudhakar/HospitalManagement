public with sharing class LeaveRequestController {
    @AuraEnabled(cacheable=true)
    public static List<LeaveRequest__c> getMyLeaves(){
        try {

            List<LeaveRequest__c> myleaves = new List<LeaveRequest__c>();

            myleaves =  [SELECT Id, Name, From_Date__c, Manager_Comment__c, Reason__c, Status__c, 
            To_Date__c, User__c FROM LeaveRequest__c where
             User__c=:UserInfo.getUserId() ORDER By createdDate DESC];
             return myLeaves;
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<LeaveRequest__c> getLeaveRequests(){
        try {
            
            List<LeaveRequest__c> myLeaves = new List<LeaveRequest__c>();
            myLeaves = [SELECT Id, Name, From_Date__c, Manager_Comment__c, Reason__c, Status__c, 
            To_Date__c, User__r.ManagerId,User__r.Name FROM LeaveRequest__c where User__r.ManagerId=:UserInfo.getUserId() ORDER BY createdDate DESC];

            return myLeaves;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}