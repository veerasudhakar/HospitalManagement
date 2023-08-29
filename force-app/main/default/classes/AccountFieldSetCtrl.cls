public class AccountFieldSetCtrl {
    @AuraEnabled(Cacheable = true)
    //Creating a queryString where we add fields name as per FieldSet and       fetch accounts as per queryString.
    public static List<Account> getAccount() {
        try {
            String queryString = 'select id';
            for (Schema.FieldSetMember fieldSet : SObjectType.Account.FieldSets.Account_Feild_Set.getFields()) {
                queryString += ',' + fieldSet.getFieldPath();
            }
            queryString += ' from Account limit 100';
            return Database.query(queryString);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled
   // Create Map of Label and fieldName to use this map in columns of datatable
    public static string getFieldLableAndFieldAPI(){
        List<Map<String ,String>> listOfFieldSet  = new  List<Map<String ,String>>();
        try {
            for(Schema.FieldSetMember fieldset : SObjectType.Account.FieldSets.Account_Feild_Set.getFields()) {
                Map<String ,String> lableAPIMap = new Map<String ,String>();
                lableAPIMap.put(fieldset.getLabel(),fieldset.getFieldPath());
                listOfFieldSet.add(lableAPIMap);
            }
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
        return JSON.serialize(listOfFieldSet);

    }
}