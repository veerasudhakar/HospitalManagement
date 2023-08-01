public class BookAppointment {
    
    @AuraEnabled
    public static Appointment__c myappointment(Appointment__c patientObj,Contact contactUpdate){
        system.debug('the appointment is '+ patientObj);
        //Contact c=[Select Id,Name,Email from Contact where Email=:UserInfo.getUserEmail() limit 1];
        //Contact c=[Select Id,Name,Email from Contact where Email=:loginUser limit 1];
       Contact contactToUpdate =contactUpdate;
        Appointment__c Appoin = patientObj ;
			system.debug('contactUpdate-> '+contactUpdate);
            if(Appoin.Appointment_Date__c!=null || contactUpdate !=null){
                try{
                    system.debug('about to book'+Appoin);
                    insert Appoin ;
                    update contactToUpdate;
                }
                catch (exception e){
                    system.debug('error'+e);
                }
            }
            return Appoin ; 
        
    }
    
    @AuraEnabled(cacheable=true)
    public static Contact userContactDetails(String loginUser){
        Contact c=[Select Id,Name,Email,Date_Of_Birth__c,Phone,Age__c,Gender__c,Address__c,Appointment_No__c  from Contact where Email=:loginUser limit 1];
        return c;
    }
    
}