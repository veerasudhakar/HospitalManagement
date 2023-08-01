@IsTest(seeAllData = true)
public class ShiftWiseCasesChangeJobSchedulerTest {
    @IsTest(seeAllData = true)
    static void testScheduleJobMethod() {
        // Create test data
        ShiftWiseChangeScheduleJobTimeValues__c scheduleJobTimeValues = ShiftWiseChangeScheduleJobTimeValues__c.getOrgDefaults();
        //Execute the scheduled job
        Test.startTest();
        shiftWiseCasesChangeJobScheduler.scheduleJobMethod();
        Test.stopTest();

        // Verify the scheduled job has been created
        List<CronTrigger> cronTriggers = [SELECT Id, State, NextFireTime,CronJobDetail.Name, CronExpression FROM CronTrigger WHERE CronJobDetail.Name = 'ShiftWise Change Cases Shift Schedule Job'];
        System.assertEquals(1, cronTriggers.size());

        // Verify the job schedule details
        CronTrigger cronTrigger = cronTriggers[0];
        System.assertEquals('ShiftWise Change Cases Shift Schedule Job', cronTrigger.CronJobDetail.Name);
        System.assertEquals(cronTrigger.CronExpression, cronTrigger.CronExpression);
    }
}