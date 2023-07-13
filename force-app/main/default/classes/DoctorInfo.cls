public class DoctorInfo {
 @AuraEnabled(cacheable=true)
  public static List<Doctor__c> getBio() {
    //  system.debug([SELECT ID,Name,Image_Url__c,Specialty__c, Biograph__c FROM Doctor__c where id=:doctorid ]);
  return [SELECT ID,Name,Image_Url__c,Specialty__c, Biograph__c FROM Doctor__c where id= 'a065i00000OC3FcAAL' ];
  }
}