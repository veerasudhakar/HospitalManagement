public class ContactFieldSetController {
    @AuraEnabled(cacheable=true)
        public static List<Contact> fetchContactFieldSetData(){
            String queryString = 'SELECT Id';
            List<Contact> conList = new List<Contact>();
    
            for(Schema.FieldSetMember fld :SObjectType.Contact.FieldSets.contact_Feild_Set.getFields()) {
                queryString += ', ' + fld.getFieldPath();
            }
    
            queryString += ' FROM Contact LIMIT 10';
             
            conList = Database.query(queryString);
            return conList;
        }
    
        @AuraEnabled(cacheable=true)
        public static String getFieldSet(String Contact, String contact_Feild_Set) {
            String result = '';
            try{
                SObjectType objToken = Schema.getGlobalDescribe().get(Contact);
                Schema.DescribeSObjectResult d = objToken.getDescribe();
                Map<String, Schema.FieldSet> fieldSetMap = d.fieldSets.getMap();
    
                if(fieldSetMap.containsKey(contact_Feild_Set)){
                    for(Schema.FieldSetMember f : fieldSetMap.get(contact_Feild_Set).getFields()) {
                         
                        if(String.isNotBlank(result)){
                            result += ',';
                        }
    
                        String jsonPart = '{';
                        jsonPart += '"required":"' + (f.getDBRequired() || f.getRequired()) + '",';
                        jsonPart += '"type":"' + (f.getType()) + '",';
                        jsonPart += '"label":"' + (f.getLabel()) + '",';
                        jsonPart += '"name":"' + f.getFieldPath() + '"';
                        jsonPart += '}';
                        result += jsonPart;
                    }
                }
            }
            catch(Exception ex){
                result += ex.getLineNumber() + ' : ' + ex.getMessage();
            }
            return '['+result+']';
        }
    }