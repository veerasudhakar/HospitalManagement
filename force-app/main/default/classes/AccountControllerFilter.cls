public with sharing class AccountControllerFilter {
    @AuraEnabled(cacheable=true)
    public static List<String> fetchPicklistValues(String objectName, String fieldName) {
        List<String> picklistValues = new List<String>();
        Schema.SObjectType sObjectType = Schema.getGlobalDescribe().get(objectName);
        Schema.DescribeSObjectResult describeSObjectResult = sObjectType.getDescribe();
        Schema.DescribeFieldResult describeFieldResult = describeSObjectResult.fields.getMap().get(fieldName).getDescribe();
 
        for (Schema.PicklistEntry picklistEntry : describeFieldResult.getPicklistValues()) {
            picklistValues.add(picklistEntry.getValue());
        }
 
        return picklistValues;
    }
 
    @AuraEnabled(cacheable=true)
    public static String getFieldType(String objectName, String fieldName) {
        Map<String, Schema.SObjectType> schemaMap = Schema.getGlobalDescribe();
        Schema.SObjectType objectSchema = schemaMap.get(objectName);
        Schema.DescribeSObjectResult describe = objectSchema.getDescribe();
        Map<String, Schema.SObjectField> fieldMap = describe.fields.getMap();
        Schema.DescribeFieldResult fieldDescribe = fieldMap.get(fieldName).getDescribe();
        return fieldDescribe.getType().name();
    }
 
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts() {
        return [
            SELECT Id, Name, Phone, Industry, CreatedDate, LastModifiedDate,Rating,Test__c,Type
            FROM Account
            WITH SECURITY_ENFORCED
            ORDER BY Name ASC,LastModifiedDate DESC 
        ];
    }
}