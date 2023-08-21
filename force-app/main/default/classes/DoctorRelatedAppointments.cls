public class DoctorRelatedAppointments {
   @AuraEnabled(cacheable=true)
    //
     public static List<Appointment__c> getRelatedData(Id userId, String filter) {
    List<Appointment__c> appointments;
    if (filter == 'all') {
        
        appointments = [SELECT Id, Name, Doctor__c, Appointment_Date__c, SlotsAvailable__c, Status__c,
                Doctor__r.Name, Doctor__r.Email__c, Doctor__r.user__c, Doctor__r.Specialty__c, Contact__r.Name,Contact__r.Gender__c, Contact__r.Email,Contact__r.Age__c,Contact__r.Date_Of_Birth__c
                FROM Appointment__c
                WHERE Doctor__r.user__c = :userId];
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

       
        appointments = [SELECT Id, Name, Doctor__c, Appointment_Date__c, SlotsAvailable__c, Status__c,
                Doctor__r.Name, Doctor__r.Email__c, Doctor__r.user__c, Contact__r.Name,Contact__r.Gender__c, Contact__r.Email,Contact__r.Age__c,Contact__r.Date_Of_Birth__c
                FROM Appointment__c
                WHERE Doctor__r.user__c = :userId AND CreatedDate >= :startDate AND CreatedDate <= :endDate];
    }

    return appointments;
}
    

    /*
    public static List<Appointment__c> getRelatedData(Id userId, String filter, String searchCriteria){
       List<Appointment__c> appointments;
        String searchTerm = '%' + searchCriteria + '%';
        Date startDate=(filter == 'today')? Date.today():(filter == 'week')? Date.today().toStartOfWeek():(filter == 'month')?Date.today().toStartOfMonth():null;
        Date endDate=(filter == 'today')?startDate:(filter == 'week')?startDate.addDays(6):(filter == 'month')?startDate.addMonths(1).addDays(-1):null;
        String query ='SELECT Id, Name, Doctor__c, Appointment_Date__c, SlotsAvailable__c, Status__c,Doctor__r.Name, Doctor__r.Email__c, Doctor__r.user__c, Doctor__r.Specialty__c, Contact__r.Name,Contact__r.Gender__c, Contact__r.Email,Contact__r.Age__c,Contact__r.Date_Of_Birth__c FROM Appointment__c WHERE Doctor__r.user__c = :userId ';
        
        
      query += (filter == null && searchCriteria !='')?'AND (Name LIKE :searchTerm OR Contact__r.Name LIKE :searchTerm OR Status__c LIKE :searchTerm)':
        (filter == 'today' && searchCriteria !='')?'AND (Name LIKE :searchTerm OR Contact__r.Name LIKE :searchTerm OR Status__c LIKE :searchTerm) AND CreatedDate >= :startDate AND CreatedDate <= :endDate':
     (filter == 'week' && searchCriteria !='')?'AND (Name LIKE :searchTerm OR Contact__r.Name LIKE :searchTerm OR Status__c LIKE :searchTerm) AND CreatedDate >= :startDate AND CreatedDate <= :endDate':
        (filter == 'month' && searchCriteria !='')?'AND (Name LIKE :searchTerm OR Contact__r.Name LIKE :searchTerm OR Status__c LIKE :searchTerm) AND CreatedDate >= :startDate AND CreatedDate <= :endDate':' AND CreatedDate >= :startDate AND CreatedDate <= :endDate';
        List<String> splitQuery = query.split('AND');
           for(String s :splitQuery){
            system.debug('And->'+s);
        }
        system.debug('query->'+query);
		appointments   = database.query(query);
        for(Appointment__c s :appointments){
            system.debug('appointments->'+s);
        }
         
    

    return appointments;
}
//This is Sudhakar Filter Condition
    */
    @AuraEnabled

    public static void deleteAccounts(List<Id> accountIds) {

        List<Appointment__c> accountsToDelete = [SELECT Id, Name, Doctor__c, Appointment_Date__c, SlotsAvailable__c, Status__c,
        Doctor__r.Name, Doctor__r.Email__c, Doctor__r.user__c, Contact__r.Name,Contact__r.Gender__c, Contact__r.Email,Contact__r.Age__c,Contact__r.Date_Of_Birth__c
        FROM Appointment__c WHERE Id IN :accountIds];

        delete accountsToDelete;

    }
        
}