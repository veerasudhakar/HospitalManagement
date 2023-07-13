public class Patient_Records {
    @AuraEnabled(cacheable=true)
    public static List<Patient__c> fetchPatients(){
        return [SELECT Id, Name, Email__c, Appointment_Date__c, AccountId__c, Phone__c, SlotsAvailable__c,
                Appointment_No__c, Consult_doctor__c,
                Status__c, Image_Url__c, First_Name__c, Last_Name__c FROM Patient__c];
        
    }
    @AuraEnabled(cacheable=true)
    public static List<String> getAvailableSlots(String selectedDate, string doctorid) {
        System.debug('the doctor id was '+doctorid);
        system.debug('selected date was '+selectedDate);
        //system.debug('the doctor id was '+doctid);
        // Convert the selectedDate string to a Date value
        Date appointmentDate = Date.valueOf(selectedDate);
        Map<String, Id> patientsMap = new Map<String, Id>();
        //List<Patient__c> patientsList = new List<Patient__c>();
        
        Date today = System.today();
        string datetoday = string.valueOf(today);
        
        //patients data
        List<Patient__c> patients = [SELECT Id,Consult_doctor__c,SlotsAvailable__c FROM Patient__c WHERE Appointment_Date__c = :appointmentDate AND Consult_doctor__c =:doctorid];
        
        if(!patients.isEmpty()){
            System.debug('patients are not empty');
        } else {
            System.debug('patients are empty');
        }
        for(Patient__c patient : patients){
            System.debug('patient--> '+patient);
            patientsMap.put(patient.SlotsAvailable__c, patient.Id);
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
        system.debug('currentTimeString--> '+currentTimeString);
        
        List<String> slotsToRemove = new List<String>();
        
        if(selectedDate == datetoday){
            for(String slot : availableSlots){
                
                if(slot>=currentTimeString){
                    if(!patientsMap.containsKey(slot)){
                        slotsToRemove.add(slot);
                    }
                }
                
            } 
        }else{
            for(String slot : availableSlots){
                if(!patientsMap.containsKey(slot)){
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
    public static void createPatient(Patient__c patientObj){
        //System.debug('from lwc'+patientObj);
        Patient__c cosss = patientObj;
        cosss.Status__c = 'Scheduled';
        //system.debug('the insertion id was '+cosss.RecordTypeId);
        if(patientObj.Appointment_Date__c !=null){
            //System.debug('the checked appointment date was '+patientObj.Appointment_Date__c);
        }
            try {
                insert cosss;
                //return patientObj;
            } catch (Exception exp) {
                throw new AuraHandledException(exp.getMessage());
            }
    }
    // @AuraEnabled
    // public static Id createPatient(String patient){
        
    //     //The following logic to be replaced with your respective event object
    //     if(String.isBlank(patient)){
    //         return null;
    //     }
    //     Map<String, Object> patientMap = (Map<String, Object>) JSON.deserializeUntyped(patient);
        
    //     Patient__c newPatient = new Patient__c();
    //     //newEvent.Name = eventMap.get('title') != null ? (String)eventMap.get('title') : null;
    //     //newEvent.Email__c = eventMap.get('email') != null ? (String)eventMap.get('email') : null;
    //     newPatient.First_Name__c = patientMap.get('firstname') != null ? (String)patientMap.get('firstname') : null;
    //     newPatient.Last_Name__c = patientMap.get('lastname') != null ? (String)patientMap.get('lastname') : null;
        
        
    //     // String startdate = eventMap.get('start') != null ? 
    //     //     ((String)eventMap.get('start')).replace('T', ' ').replace('.000Z', '') : 
    //     // null;
    //     // String endDate = eventMap.get('end') != null ? 
    //     //     ((String)eventMap.get('end')).replace('T', ' ').replace('.000Z', '') : 
    //     // null;
        
    //     newPatient.Appointment_Date__c = appointmentdate != null ? Date.valueOfGmt(appointmentdate) : null;
    //     //newPatient.Email__c = endDate != null ? Datetime.valueOfGmt(endDate) : null;
    //     newPatient.Email__c = patientMap.get('Email') != null ? (String)patientMap.get('Email') : null;
    //     newPatient.Phone__c = patientMap.get('Phone') != null ? (String)patientMap.get('Phone') : null;
        
    //     // newEvent.Course__c = eventMap.get('Course') != null ? (String)eventMap.get('Course') : null;
    //     // newEvent.Email__c = eventMap.get('Email') != null ? (String)eventMap.get('Email') : null;
    //     // newEvent.IsAllDayEvent = eventMap.get('start') != null ? eventMap.get('start') : null;
    //     insert newEvent;
    //     system.debug('newEvent'+newEvent);
    //     Program__c p=[Select Id,CreatedBy.Name,CreatedBy.Email,Email__c from Program__c where Id=:newEvent.Id][0];
    //     newEvent.Name=p.CreatedBy.Name;
    //     newEvent.Email__c=p.CreatedBy.Email;
    //     update newEvent;
    //     return newEvent.Id;
        
    // }
}