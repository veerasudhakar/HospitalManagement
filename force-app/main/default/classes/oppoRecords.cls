public class oppoRecords {

    /*
  public static LIst<Opportunity> oppoRecords(){

    List<Opportunity> oppolist= [Select Id,Name,stageName from Opportunity];
    return oppolist;
    
  }
  
  public static List<Schema.FieldSetMember> readFieldSet(String OppoRecords, String Opportunity)
{
    Map<String, Schema.SObjectType> GlobalDescribeMap = Schema.getGlobalDescribe(); 
    Schema.SObjectType SObjectTypeObj = GlobalDescribeMap.get(Opportunity);
    Schema.DescribeSObjectResult DescribeSObjectResultObj = SObjectTypeObj.getDescribe();

    //system.debug('====>' + DescribeSObjectResultObj.FieldSets.getMap().get(fieldSetName));

    Schema.FieldSet fieldSetObj = DescribeSObjectResultObj.FieldSets.getMap().get(OppoRecords);

    //List<Schema.FieldSetMember> fieldSetMemberList =  fieldSetObj.getFields();
    //system.debug('fieldSetMemberList ====>' + fieldSetMemberList);  
    return fieldSetObj.getFields(); 
}  
*/
}