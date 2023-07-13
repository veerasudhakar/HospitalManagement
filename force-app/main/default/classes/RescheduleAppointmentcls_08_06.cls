public class RescheduleAppointmentcls_08_06 {
     @AuraEnabled(Cacheable=true)
    public static list<Contact> methodgetappointments(string email ){
        system.debug(email);
        list<Contact> coo = [SELECT Id,Name, FirstName, LastName,Email, phone,Appointment_Date__c,SlotsAvailable__c, Consult_doctor__c,Consult_doctor__r.Name,Consult_doctor__r.Specialty__c,Consult_doctor__r.Location__c, Consult_doctor__r.FirstName, Consult_doctor__r.LastName,Consult_doctor__r.Appointment_Date__c,Consult_doctor__r.SlotsAvailable__c
FROM Contact WHERE Email LIKE: email AND RecordType.Name = 'Patients'];
      
        return coo ;

        
    }
    @AuraEnabled(Cacheable=true)
    public static list<String> methodslots(String selectedDate ,  string doctorid){
        System.debug('the doctor id was '+doctorid);
        system.debug('selected date was '+selectedDate);
        //system.debug('the doctor id was '+doctid);
        // Convert the selectedDate string to a Date value
        Date appointmentDate = Date.valueOf(selectedDate);
        Map<String, Id> contactsMap = new Map<String, Id>();
        
        Date today = System.today();
        string datetoday = string.valueOf(today);
        
        //patients data
        List<Contact> contacts = [SELECT Id, SlotsAvailable__c , Consult_doctor__c FROM Contact WHERE Appointment_Date__c = :appointmentDate AND Consult_doctor__c =:doctorid];
        
        if(!contacts.isEmpty()){
            System.debug('contacts are not empty');
        } else {
            System.debug('contacts are empty');
        }
        for(Contact contact : contacts){
            contactsMap.put(contact.SlotsAvailable__c, contact.Id);
        }
        
        
        List<String> availableSlots = new List<String>();
        List<Shifttimings__c> shiftTimingsList = [ SELECT Id, Shift_time__c  FROM Shifttimings__c ORDER BY CreatedDate ASC ]; 
        for(Shifttimings__c ss : shiftTimingsList){
            System.debug('the shift timings was '+ss.Shift_time__c);
            availableSlots.add(ss.Shift_time__c);
        }
        
        Time currentTime = System.now().time();
        // Convert Time to String using String.valueOf() method
        String currentTimeString = String.valueOf(currentTime);
        
        List<String> slotsToRemove = new List<String>();
        
        if(selectedDate == datetoday){
            for(String slot : availableSlots){
                
                if(slot>=currentTimeString){
                    if(!contactsMap.containsKey(slot)){
                        slotsToRemove.add(slot);
                    }
                }
                
            } 
        }else{
            for(String slot : availableSlots){
                if(!contactsMap.containsKey(slot)){
                    slotsToRemove.add(slot);
                } 
            }
        }
        
        
        //availableSlots.removeAll(slotsToRemove);
        system.debug('Available slots are  '+slotsToRemove);
        
        //System.debug('the available slots are '+availableSlots);       
        
        return slotsToRemove;
    }
    @AuraEnabled
    public static List<Contact> confirmingreschedulemethod(String selectedDate , string patientId, string selectedslot, string email){
       // system.debug('the doctor Id '+doctorId);
        system.debug('patient Id'+patientId);
        system.debug('date '+selectedDate);
        System.debug('selected slot '+selectedslot);
        Date appointmentDate = Date.valueOf(selectedDate);
        list<Contact> coss = [select id ,Appointment_Date__c,SlotsAvailable__c,Consult_doctor__c from contact where id =: patientId];
        list<Contact> cffd = new list<Contact>();
        list<Contact> coo = new list<Contact>();
        for(contact csd : coss){
            csd.Appointment_Date__c = appointmentDate;
            csd.SlotsAvailable__c = selectedslot ;
            cffd.add(csd);
        }
        try{
           update cffd ; 
            coo = [SELECT Id,Name, FirstName, LastName,Email, phone,Appointment_Date__c,SlotsAvailable__c, Consult_doctor__c,Consult_doctor__r.Name,Consult_doctor__r.Specialty__c,Consult_doctor__r.Location__c, Consult_doctor__r.FirstName, Consult_doctor__r.LastName,Consult_doctor__r.Appointment_Date__c,Consult_doctor__r.SlotsAvailable__c
FROM Contact WHERE Email LIKE: email AND RecordType.Name = 'Patients'];
        }catch (exception e){
            System.debug('error '+e);
        }
        return coo;
    }
    }