public class ClearCompletedScheduleJobsClass implements schedulable{
    public void execute(SchedulableContext context) {
        CronTrigger[] cronTriggers = [SELECT Id, State, NextFireTime FROM CronTrigger WHERE State = 'DELETED' AND NextFireTime = null];
        for (CronTrigger cronTrigger : cronTriggers) {
            System.abortJob(cronTrigger.Id);
        }
    }
    @AuraEnabled
    public static void completedJobsScheduleMethod(){
        System.schedule('MyScheduleJobForCompletedScheduleJobs', '0 0 * * * ?', new ClearCompletedScheduleJobsClass());
        
    }
}