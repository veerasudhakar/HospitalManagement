@IsTest(seeAllData = true)
public class ClearCompletedScheduleJobsClassTest {
    
    @isTest(seeAllData = true)
    static void testClearCompletedScheduleJobs() {
        // Get all deleted CronTriggers
        CronTrigger[] cronTriggers = [
            SELECT Id, State, NextFireTime
            FROM CronTrigger
            WHERE State = 'DELETED'
            AND NextFireTime = null limit 1
        ];
        // Simulate the scheduled class running
        Test.startTest();
        for (CronTrigger cronTrigger : cronTriggers) {
            ClearCompletedScheduleJobsClass.completedJobsScheduleMethod();
            System.abortJob(cronTrigger.Id);
        }
        Test.stopTest();
    }
    
}