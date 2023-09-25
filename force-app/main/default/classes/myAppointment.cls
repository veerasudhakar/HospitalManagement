public with sharing class myAppointment {
    @AuraEnabled(cacheable=true)
    public static List<Appointment__c> RelatedRecordsController(string userEmail, String filter) {
        List<Appointment__c> appointments;
        if (filter == 'all') {
            appointments = [SELECT Name, Appointment_Date__c, Doctor__r.Specialty__c,Doctor__r.Name, Contact__c, Contact__r.Name,Contact__r.Email,Contact__r.Phone, SlotsAvailable__c,Status__c 
                            FROM Appointment__c WHERE Contact__r.Email = :userEmail ORDER BY Name DESC];
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
                            FROM Appointment__c WHERE Contact__r.Email = :userEmail AND CreatedDate >= :startDate AND CreatedDate <= :endDate ORDER BY Name DESC];
        }
        return appointments;
    }
    @AuraEnabled(cacheable=true)
    public static List<String> getAvailableSlots( String selectedDate, string doctorid) {
        Date appointmentDate = Date.valueOf(selectedDate);
        Map<String, Id> patientsMap = new Map<String, Id>();
        Date today = System.today();
        string datetoday = string.valueOf(today);
        List<Appointment__c> allAppointmenst = [SELECT Id , Name , Appointment_Date__c ,Status__c, Contact__c , Doctor__c , SlotsAvailable__c from Appointment__c where Appointment_Date__c =:appointmentDate AND Doctor__c =:doctorid AND Status__c='Scheduled' ORDER BY Name DESC];
        if(!allAppointmenst.isEmpty()){
            System.debug('patients are not empty');
        } else {
            System.debug('patients are empty');
        }
        for(Appointment__c patient : allAppointmenst){
            patientsMap.put(patient.SlotsAvailable__c, patient.Id);
        }
        List<String> availableSlots = new List<String>();
        List<Shifttimings__c> shiftTimingsList = [ SELECT Id, Shift_time__c  FROM Shifttimings__c ORDER BY CreatedDate ASC ]; 
        for(Shifttimings__c ss : shiftTimingsList){
            availableSlots.add(ss.Shift_time__c);
        }
        Time currentTime = System.now().time();
        String currentTimeString = String.valueOf(currentTime);
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
        return slotsToRemove;
    }
    @AuraEnabled
    public static void rescheduleAppointment(Id appointmentId,Date newAppointmentDate, String newSlot){
        List<Appointment__c> updateAppointment =new List<Appointment__c>() ;
        for(Appointment__c upApp :[SELECT Id, Appointment_Date__c, SlotsAvailable__c FROM Appointment__c WHERE Id = :appointmentId] ){
            upApp.Appointment_Date__c = newAppointmentDate;
            upApp.SlotsAvailable__c = newSlot;
            upApp.Status__c = 'Rescheduled';
            updateAppointment.add(upApp);
        }
        database.update(updateAppointment);
    }
    @AuraEnabled
    public static void cancelAppointment(Id appointmentId,String reason, String others) {
        List<Appointment__c> appointmentsToUpdate = new List<Appointment__c>();
        for (Appointment__c appointment : [SELECT Id, Status__c, SlotsAvailable__c, Doctor__c,Reason__c, Others__c, Appointment_Date__c FROM Appointment__c WHERE Id = :appointmentId]) {
            if (appointment.Appointment_Date__c >= Date.today()) {
                appointment.Status__c = 'Cancelled'; 
                appointment.Reason__c = reason;
                appointment.Others__c = others;
                appointmentsToUpdate.add(appointment);
            }
        }
        if (!appointmentsToUpdate.isEmpty()) {
            update appointmentsToUpdate;
        }
    }
/*
    @AuraEnabled
    public static void updateExpiredAppointments() {
        Date today = Date.today();
        Time currentTime = System.now().time();
        String currentTimeString = String.valueOf(currentTime);

        List<Appointment__c> expiredAppointments = new List<Appointment__c>();

        for (Appointment__c appointment : [SELECT Id, Status__c, Appointment_Date__c, SlotsAvailable__c
                                           FROM Appointment__c
                                           WHERE Status__c = 'Scheduled'
                                           AND Appointment_Date__c = :today]) {
            if (appointment.SlotsAvailable__c >= currentTimeString) {
                // The appointment time has passed; mark it as expired
                appointment.Status__c = 'Expired';
                expiredAppointments.add(appointment);
            }
        }

        if (!expiredAppointments.isEmpty()) {
            update expiredAppointments;
        }
    }
*/
     @AuraEnabled
    public static void updateExpiredAppointments(List<Id> appointmentIds) {
        List<Appointment__c> appointmentsToUpdate = new List<Appointment__c>();
        for (Id appointmentId : appointmentIds) {
            Appointment__c appointment = new Appointment__c(Id = appointmentId, Status__c = 'Expired');
            appointmentsToUpdate.add(appointment);
        }
        if (!appointmentsToUpdate.isEmpty()) {
            update appointmentsToUpdate;
        }
    }

}