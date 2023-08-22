public with sharing class myAppointment {
    

    @AuraEnabled(cacheable=true)
     public static List<Appointment__c> RelatedRecordsController(string userEmail, String filter) {
    List<Appointment__c> appointments;
    if (filter == 'all') {
        
        appointments = [SELECT Name, Appointment_Date__c, Doctor__r.Specialty__c,Doctor__r.Name, Contact__c, Contact__r.Name,Contact__r.Email,Contact__r.Phone, SlotsAvailable__c,Status__c 
        FROM Appointment__c WHERE Contact__r.Email = :userEmail];
    } else {
       
        Date startDate;
        Date endDate;
        if (filter == 'today') {
            startDate = Date.today();
            endDate = startDate;
        } else if (filter == 'week') {
            startDate = Date.today().toStartOfWeek();
            endDate = startDate.addDays(6);
        } else if (filter == 'month') {
            startDate = Date.today().toStartOfMonth();
            endDate = startDate.addMonths(1).addDays(-1);
        }

       
        appointments = [SELECT Name, Appointment_Date__c, Doctor__r.Specialty__c,Doctor__r.Name, Contact__c, Contact__r.Name,Contact__r.Email, SlotsAvailable__c,Status__c 
        FROM Appointment__c WHERE Contact__r.Email = :userEmail AND CreatedDate >= :startDate AND CreatedDate <= :endDate];
    }
       

    return appointments;
}
    /*
     @AuraEnabled(cacheable=true)
    public static List<Appointment__c> RelatedRecordsController(string userEmail, Date selectedDate) {
    List<Appointment__c> appointments;

    appointments = [SELECT Name, Appointment_Date__c, Doctor__r.Specialty__c, Doctor__r.Name, Contact__c, Contact__r.Name, Contact__r.Email, Contact__r.Phone, SlotsAvailable__c, Status__c 
                    FROM Appointment__c 
                    WHERE Contact__r.Email = :userEmail AND Appointment_Date__c = :selectedDate];

    return appointments;
}
*/
    /*
    @AuraEnabled(cacheable=true)
    
     public static List<Appointment__c> RelatedRecordsController(string userEmail, Date selectDate) {
    List<Appointment__c> appointments;
         system.debug('');
          Date selectedDate = Date.valueOf(selectDate); // Convert the string to Date
  
         if(userEmail!=''&& userEmail != null){
             system.debug('userEmail'+userEmail);
              appointments = [SELECT Name, Appointment_Date__c, Doctor__r.Specialty__c, Doctor__r.Name, Contact__c, Contact__r.Name, Contact__r.Email, SlotsAvailable__c, Status__c 
FROM Appointment__c WHERE Contact__r.Email = :userEmail ];
         }else if(selectDate != null){
             system.debug('date'+selectDate);
            List<Appointment__c> clist = new List<Appointment__c>([
        SELECT Name, Doctor__c, Appointment_Date__c, SlotsAvailable__c, Status__c,
            Doctor__r.Name, Doctor__r.Email__c, Doctor__r.user__c, Doctor__r.Specialty__c, 
            Contact__r.Name, Contact__r.Gender__c, Contact__r.Email, Contact__r.Age__c,
            Contact__r.Date_Of_Birth__c
        FROM Appointment__c
        WHERE Appointment_Date__c = :selectDate 
    ]);  
         }else{
              appointments = [SELECT Name, Appointment_Date__c, Doctor__r.Specialty__c,Doctor__r.Name, Contact__c, Contact__r.Name,Contact__r.Email,Contact__r.Phone, SlotsAvailable__c,Status__c 
        FROM Appointment__c];
         }
       
    return appointments;
}
*/
    
       @AuraEnabled(cacheable=true)
    public static List<String> getAvailableSlots( String selectedDate, string doctorid) {
         
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
       // List<Patient__c> patients = [SELECT Id,Consult_doctor__c,SlotsAvailable__c FROM Patient__c WHERE Appointment_Date__c = :appointmentDate AND Consult_doctor__c =:doctorid];
        
        List<Appointment__c> allAppointmenst = [SELECT Id , Name , Appointment_Date__c ,Status__c, Contact__c , Doctor__c , SlotsAvailable__c from Appointment__c where Appointment_Date__c =:appointmentDate AND Doctor__c =:doctorid AND Status__c='Scheduled'];
        if(!allAppointmenst.isEmpty()){
            System.debug('patients are not empty');
        } else {
            System.debug('patients are empty');
        }
        for(Appointment__c patient : allAppointmenst){
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
        
        if(selectedDate == datetoday ){
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
        //update appointment;
        return slotsToRemove;
         
    }
     @AuraEnabled
    public static void rescheduleAppointment(Id appointmentId,Date newAppointmentDate, String newSlot){
        List<Appointment__c> updateAppointment =new List<Appointment__c>() ;
        for(Appointment__c upApp :[SELECT Id, Appointment_Date__c, SlotsAvailable__c FROM Appointment__c WHERE Id = :appointmentId] ){
            upApp.Appointment_Date__c = newAppointmentDate;
            upApp.SlotsAvailable__c = newSlot;
            updateAppointment.add(upApp);
        }
        database.update(updateAppointment);
    }
    //This is Veera Sudhakar Cancel Appointment
     @AuraEnabled
    public static void cancelAppointment(Id appointmentId) {
    List<Appointment__c> appointmentsToUpdate = new List<Appointment__c>();
    for (Appointment__c appointment : [SELECT Id, Status__c, SlotsAvailable__c, Doctor__c, Appointment_Date__c FROM Appointment__c WHERE Id = :appointmentId]) {
        if (appointment.Appointment_Date__c >= Date.today()) {
            appointment.Status__c = 'Cancelled'; 
            appointmentsToUpdate.add(appointment);
        }
    }

    if (!appointmentsToUpdate.isEmpty()) {
        update appointmentsToUpdate;
    }
}
   
    /*
   @AuraEnabled
    public static void cancelAppointment(Id appointmentId) {
        List<Appointment__c> appointmentsToUpdate = new List<Appointment__c>();
       

        for (Appointment__c appointment : [SELECT Id, Status__c, SlotsAvailable__c, Doctor__c FROM Appointment__c WHERE Id = :appointmentId]) {
              if (appointment.Appointment_Date__c >= Date.today()) {
            appointment.Status__c = 'Cancelled'; 
            appointmentsToUpdate.add(appointment);

        
              }
             
        }

        if (!appointmentsToUpdate.isEmpty()) {
            update appointmentsToUpdate;
        }
    }
*/

    /*
     @AuraEnabled
    public static void rescheduleAppointment(Id appointmentId, Date newAppointmentDate, String newSlot) {
        try {
            Appointment__c appointment = [SELECT Id, Appointment_Date__c, SlotsAvailable__c FROM Appointment__c WHERE Id = :appointmentId];
            
            
            appointment.Appointment_Date__c = newAppointmentDate;
            appointment.SlotsAvailable__c = newSlot;
            
            update appointment;
        } catch(Exception e) {
            // Handle exceptions and return an error message or appropriate response
            throw new AuraHandledException('Error rescheduling appointment: ' + e.getMessage());
        }
    }
*/
    /*
    public static void rescheduleAppointment(Id appointmentId, Date newAppointmentDate, Integer newSlotsAvailable, String newShiftTiming) {
    Appointment__c appointment = [SELECT Id FROM Appointment__c WHERE Id = :appointmentId];
    if (appointment != null) {
        appointment.Appointment_Date__c = newAppointmentDate;
        appointment.SlotsAvailable__c = newSlotsAvailable;
        appointment.Shift_Time__c = newShiftTiming;
        update appointment;
    }
}
*/
        /*
    @AuraEnabled(cacheable=true)

   public static void rescheduleAppointment(Id appointmentId, DateTime newAppointmentDate) {
    Appointment__c existingAppointment = [SELECT Id, Name, Doctor__c, Appointment_Date__c, SlotsAvailable__c, Status__c, Contact__c
                                          FROM Appointment__c
                                          WHERE Id = :appointmentId AND Status__c = 'Scheduled' LIMIT 1];
    
    if (existingAppointment != null) {
        // Update appointment details
        existingAppointment.Appointment_Date__c = newAppointmentDate.date(); // Convert DateTime to Date
        existingAppointment.Status__c = 'Rescheduled'; // Update status to 'Rescheduled' or your choice
        
        update existingAppointment;
    } else {
        // Handle case where no valid appointment was found
    }
}
/*
    public static void rescheduleAppointment(Id appointmentId, Date newAppointmentDate, Integer newSlotsAvailable) {
        try {
            Appointment__c appointment = [SELECT Id, Appointment_Date__c, SlotsAvailable__c FROM Appointment__c WHERE Id = :appointmentId LIMIT 1];
            
            if (appointment != null) {
                appointment.Appointment_Date__c = newAppointmentDate;
                appointment.SlotsAvailable__c = newSlotsAvailable;
                
                update appointment;
            } else {
                throw new AuraHandledException('Appointment not found');
            }
        } catch (Exception ex) {
            throw new AuraHandledException('Error rescheduling appointment: ' + ex.getMessage());
        }
    }
*/
}