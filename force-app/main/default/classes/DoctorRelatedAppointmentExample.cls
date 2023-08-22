public class DoctorRelatedAppointmentExample {
    /*@AuraEnabled(cacheable=true)
      public static List<Appointment__c> dateFilters(date startdate,date endDate,Id userId)
      {
           Date start = Date.valueOf(startdate);
           Date endda = Date.valueOf(endDate);
          
          list<Appointment__c> opp =[SELECT Name, Doctor__c, Appointment_Date__c, SlotsAvailable__c, Status__c,
                                     Doctor__r.Name, Doctor__r.Email__c, Doctor__r.user__c, Doctor__r.Specialty__c, 
                                     Contact__r.Name,Contact__r.Gender__c, Contact__r.Email,Contact__r.Age__c,
                                     Contact__r.Date_Of_Birth__c FROM Appointment__c 
                                     WHERE Doctor__r.user__c = :userId  
                                     AND Appointment_Date__c >=:startdate and Appointment_Date__c<=:endDate];
          return opp;
          
      }
  
      @AuraEnabled
      public Boolean isSelected { get; set; }
  
      @AuraEnabled
      public String eventName { get; set; }
  
      @AuraEnabled
      public String attendeeName { get; set; }
  
      @AuraEnabled
      public Date attendanceDate { get; set; }
  
      public DoctorRelatedAppointmentExample(Appointment__c record) {
          isSelected = false;
          eventName = record.Name;
          attendeeName = record.Contact__r.Name;
          attendanceDate = record.Appointment_Date__c;
      }*/
  
  
    //   @AuraEnabled(cacheable=true)
    //   public static List<Appointment__c> getEventAttendees() {
    //       return [
    //         SELECT Name, Doctor__c, Appointment_Date__c, SlotsAvailable__c, Status__c,
    //         Doctor__r.Name, Doctor__r.Email__c, Doctor__r.user__c, Doctor__r.Specialty__c, 
    //         Contact__r.Name,Contact__r.Gender__c, Contact__r.Email,Contact__r.Age__c,
    //         Contact__r.Date_Of_Birth__c FROM Appointment__c 
    //         WHERE Doctor__r.user__c = :UserInfo.getUserId() ];
    //   }

    @AuraEnabled(cacheable=true)
      public static List<Tpswrapper1> getEventAttendees(){
          
          List<Appointment__c> clist= new List<Appointment__c>([SELECT Name, Doctor__c, Appointment_Date__c, SlotsAvailable__c, Status__c,
          Doctor__r.Name, Doctor__r.Email__c, Doctor__r.user__c, Doctor__r.Specialty__c, 
          Contact__r.Name,Contact__r.Gender__c, Contact__r.Email,Contact__r.Age__c,
          Contact__r.Date_Of_Birth__c FROM Appointment__c 
          WHERE Doctor__r.user__c = :UserInfo.getUserId() ]);
  
          List<Tpswrapper1> returnlist = new List<Tpswrapper1>();
          for(Appointment__c a:clist){
          Tpswrapper1 b = new Tpswrapper1();
          b.appName12 = a.Name;
          b.Pname12 = a.Contact__r.Name;
          b.email12 = a.Contact__r.Email;
          datetime StartDate1= Date.Valueof(a.get('Appointment_Date__c'));  
              String strStartDate1 = StartDate1.formatGMT('MM/dd/YYYY');
  
              b.StartEndDate12 =  strStartDate1;
              b.status12 = a.Status__c;
          //d.programType = c.Appointment_Date__c;
          returnlist.add(b);
        }
          return returnlist;
      }
      Public class Tpswrapper1{
      @auraEnabled
        public string appName12{get;set;}
      @AuraEnabled
        public string Pname12{get;set;}
   @AuraEnabled
        public string StartEndDate12{get;set;}
        @AuraEnabled
        public string email12{get;set;}
        @AuraEnabled
        public string status12{get;set;}
      }
     
     /* @AuraEnabled(cacheable=true)
      public static List<Appointment__c> searchEventAttendeesByDate(Date searchDate) {
          return [
            SELECT Name, Doctor__c, Appointment_Date__c, SlotsAvailable__c, Status__c,
            Doctor__r.Name, Doctor__r.Email__c, Doctor__r.user__c, Doctor__r.Specialty__c, 
            Contact__r.Name,Contact__r.Gender__c, Contact__r.Email,Contact__r.Age__c,
            Contact__r.Date_Of_Birth__c FROM Appointment__c 
            WHERE Doctor__r.user__c = :UserInfo.getUserId() AND Appointment_Date__c = :searchDate];
      }*/
  
      @AuraEnabled
      public static void deleteAndEmailAttendees(List<String> attendeeIds) {
          List<Appointment__c> attendeesToDelete = [
              SELECT Id, Doctor__r.Email__c, Contact__r.Name, Contact__r.Email
              FROM Appointment__c
              WHERE Id IN :attendeeIds
          ];
  
          List<Messaging.SingleEmailMessage> emails = new List<Messaging.SingleEmailMessage>();
  
          for (Appointment__c attendee : attendeesToDelete) {
              Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
              email.setToAddresses(new String[] { attendee.Contact__r.Email });
              email.setSubject('Appointment Cancellation');
              email.setPlainTextBody('Hello ' + attendee.Contact__r.Name + ',\n\nYour appointment has been canceled.');
              emails.add(email);
          }
  
          if (!emails.isEmpty()) {
              Messaging.sendEmail(emails);
          }
          
      }
  
      @AuraEnabled
      public static void deleterecords(List<Appointment__c> delList){
       delete delList;
      }
  
  //     @AuraEnabled
  // public static void List<Appointment__c> deleteMultipleContactRecord(List<String> conObj){
  //     List<Appointment__c> conObjItem = new   List<Appointment__c>();
  //   List<Appointment__c> conObjList = [SELECT Id, Doctor__r.Email__c, Contact__r.Name, Contact__r.Email
  //   FROM Appointment__c
  //   WHERE Id IN:conObj];
  //   for(Appointment__c con:conObjList){
  //     conObjItem.add(con);
  //   }
  //   if(conObjItem.size()>0){
  //       try{
  //         delete conObjItem;           
  //       }
  //       catch (Exception exp) {
  //         throw new AuraHandledException(exp.getMessage());
  //     }
  //   }
  //   //return getListdata();
  // }
  
      @AuraEnabled(cacheable=true)
      public static List<Tpswrapper> getListdata(Date searchDate){
          
          List<Appointment__c> clist= new List<Appointment__c>([SELECT Name, Doctor__c, Appointment_Date__c, SlotsAvailable__c, Status__c,
          Doctor__r.Name, Doctor__r.Email__c, Doctor__r.user__c, Doctor__r.Specialty__c, 
          Contact__r.Name,Contact__r.Gender__c, Contact__r.Email,Contact__r.Age__c,
          Contact__r.Date_Of_Birth__c FROM Appointment__c 
          WHERE Doctor__r.user__c = :UserInfo.getUserId() AND Appointment_Date__c = :searchDate]);
  
          List<Tpswrapper> returnlist = new List<Tpswrapper>();
          for(Appointment__c c:clist){
          Tpswrapper d = new Tpswrapper();
          d.appName = c.Name;
          d.Pname = c.Contact__r.Name;
          d.email = c.Contact__r.Email;
          datetime StartDate= Date.Valueof(c.get('Appointment_Date__c'));  
              String strStartDate = StartDate.formatGMT('MM/dd/YYYY');
  
              d.StartEndDate =  strStartDate;
              d.status = c.Status__c;
          //d.programType = c.Appointment_Date__c;
          returnlist.add(d);
        }
          return returnlist;
      }
      Public class Tpswrapper{
      @auraEnabled
        public string appName{get;set;}
      @AuraEnabled
        public string Pname{get;set;}
   @AuraEnabled
        public string StartEndDate{get;set;}
        @AuraEnabled
        public string email{get;set;}
        @AuraEnabled
        public string status{get;set;}
      }
  
      @AuraEnabled
      public static void Appointmentcontroller(Id recordId) {
          List<Appointment__c> recordsToUpdate = new List<Appointment__c>();
  
          // Fetch the record
          Appointment__c record = [SELECT Id, Status__c,Contact__r.Name,Appointment_Date__c,Contact__r.Email FROM Appointment__c WHERE Id = :recordId];
  
          // Check if the status is not "Cancelled"
          if (record.Status__c != 'Cancelled') {
              record.Status__c = 'Cancelled';
              recordsToUpdate.add(record);
  
              // Update the record
              update recordsToUpdate;
          }
      }
  
      @AuraEnabled
      public static void updateRecord1(String recordId, String newStatus) {
        Appointment__c obj = [SELECT Id, Status__c,Contact__r.Name,Appointment_Date__c,Contact__r.Email FROM Appointment__c WHERE Id = :recordId];
          if (obj != null) {
              obj.Status__c = newStatus;
              update obj;
          }
      }
  
      @AuraEnabled
      public static Appointment__c cancelAppointment1(Id appointmentId) {
        Appointment__c appointment = [SELECT Id, Status__c FROM Appointment__c WHERE Id = :appointmentId];
        if (appointment != null && appointment.Status__c != 'Cancelled') {
            appointment.Status__c = 'Cancelled';
            update appointment;
            return appointment;
        }
        return null;
    }
    //   public static void cancelAppointment1(Id appointmentId) {
    //       List<Appointment__c> appointmentsToUpdate = new List<Appointment__c>();
         
  
    //       for (Appointment__c appointment : [SELECT Id, Status__c, SlotsAvailable__c, Doctor__c FROM Appointment__c WHERE Id = :appointmentId]) {
    //           appointment.Status__c = 'Cancelled'; 
    //           appointmentsToUpdate.add(appointment);
  
            
    //       }
  
    //       if (!appointmentsToUpdate.isEmpty()) {
    //           update appointmentsToUpdate;
    //       }
  
         
    //   }
  
  
      @Auraenabled(cacheable=true)
      public static void Appointmentcontroller1(String accountId, String newActiveValue) {
          Appointment__c appointment = new Appointment__c(Id = accountId);
          appointment.Status__c = newActiveValue;
          update appointment;
      }
  }