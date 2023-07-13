public with sharing class PicklistController {
    @AuraEnabled(cacheable=true)
    public static List<String> getAvailableSlots(String selectedDate , string doctorid) {
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
}