public with sharing class ShowDoctorData {

    @AuraEnabled(cacheable=true)
    public static List<Doctor__c> retrieveDoctors(String doctortext,String specilaty,String location){
        
        String query = 'SELECT Id, Name, Location__c, Email__c, Specialty__c, DoctorId__c,Languages_Known__c,Image_Url__c,Description__c, Experience__c FROM Doctor__c';
        if(doctortext !='' || specilaty !='' || location!=''){
           query+=' WHERE ';
            if(doctortext !=''){
                query+='Name LIKE \'%' + doctortext + '%\'';
                if(specilaty !='' || location !='' ){
                    query+=' AND ';
                }
            }
             if(specilaty !=''){
                query+= 'Specialty__c = \'' + specilaty + '\'';
                  if(location !='' ){
                    query+=' AND ';
                }
            }
             if(location !=''){
                query+='Location__c = \'' + location + '\'';
            }
        }
        system.debug('query-> '+query);
         List<Doctor__c> allDoctorData = database.query(query);
        return allDoctorData; 
    }
    @AuraEnabled(cacheable=true)
    public static Boolean getUserLoginStatus() {
        return UserInfo.getSessionId() != null;
    }
}