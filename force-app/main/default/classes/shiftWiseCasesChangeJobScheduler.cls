public class shiftWiseCasesChangeJobScheduler {
    @AuraEnabled
    public static void scheduleJobMethod() {
        ShiftWiseChangeScheduleJobTimeValues__c shiftQueueSchedule = ShiftWiseChangeScheduleJobTimeValues__c.getOrgDefaults();
        AssignCasesToShiftQueueScheduler scheduler = new AssignCasesToShiftQueueScheduler(); 
        
        String schedule = '0 '+shiftQueueSchedule.ScheduleTimeForMinutes__c+' '+shiftQueueSchedule.ScheduleTimeForHours__c+' * * ?'; // runs at midnight, 3am, 11am,7pm 
        
        String jobName = 'ShiftWise Change Cases Shift Schedule Job' ; 
       
            String jobId = System.schedule(jobName, schedule, scheduler);
        }
    }