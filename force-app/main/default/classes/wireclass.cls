public class wireclass 
{
    @AuraEnabled(cacheable=true)
 public static list<account> getacc()
 {
     list<account> lst= [select id,name,phone from account];

     return lst;
 }
}