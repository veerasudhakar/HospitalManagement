@isTest(seeAllData=True)
public class AssignCasesToShiftQueueSchedulerTest {
    // Test method for assigning cases to the Morning Shift queue
    @isTest(seeAllData=True)
    static void testAssigningToMorningShift() {
        Test.startTest();
        // Retrieve a Case record with Initial_Shift_Name__c set to 'Morning Shift'
        Case c = [select id, Priority, Origin, OwnerId, CreatedDate, Initial_Shift_Name__c from Case where Initial_Shift_Name__c = 'Morning Shift' limit 1];
        system.debug('c' + c.OwnerId);
        // Create an instance of the AssignCasesToShiftQueueScheduler class
        AssignCasesToShiftQueueScheduler scheduler = new AssignCasesToShiftQueueScheduler();
        // Execute the scheduler's logic to assign cases to the Morning Shift queue
        scheduler.execute(null);
        // Retrieve the Morning Shift queue record
        Group morningShiftQueue = [SELECT Id FROM Group WHERE Type = 'Queue' AND Name = 'Morning Shift'];
        system.debug('morningShiftQueue' + morningShiftQueue.Id);
        Test.stopTest();
    }
    // Test method for assigning cases to the Afternoon Shift queue
    @isTest(seeAllData=True)
    static void testAssigningToAfternoonShift() {
        // Retrieve a Case record with Initial_Shift_Name__c set to 'Afternoon Shift'
        Case c = [select id, Priority, Origin, OwnerId, CreatedDate, Initial_Shift_Name__c from Case where Initial_Shift_Name__c = 'Afternoon Shift' limit 1];
        system.debug('c' + c.OwnerId);
        // Create an instance of the AssignCasesToShiftQueueScheduler class
        AssignCasesToShiftQueueScheduler scheduler = new AssignCasesToShiftQueueScheduler();
        // Execute the scheduler's logic to assign cases to the Afternoon Shift queue
        scheduler.execute(null);
        // Retrieve the Afternoon Shift queue record
        Group afternonnShiftQueue = [SELECT Id FROM Group WHERE Type = 'Queue' AND Name = 'Afternoon Shift'];
        system.debug('afternonnShiftQueue' + afternonnShiftQueue.Id);
    } 
    // Test method for assigning cases to the Night Shift queue
    @isTest(seeAllData=True)
    static void testAssigningToNightShift() {
        Test.startTest();
        // Retrieve a Case record with Initial_Shift_Name__c set to 'Night Shift'
        Case c = [select id, Priority, Origin, OwnerId, CreatedDate, Initial_Shift_Name__c from Case where Initial_Shift_Name__c = 'Night Shift' limit 1];
        system.debug('c' + c.OwnerId);
        // Create an instance of the AssignCasesToShiftQueueScheduler class
        AssignCasesToShiftQueueScheduler scheduler = new AssignCasesToShiftQueueScheduler();
        // Execute the scheduler's logic to assign cases to the Night Shift queue
        scheduler.execute(null);
        // Retrieve the Night Shift queue record
        Group nightShiftQueue = [SELECT Id FROM Group WHERE Type = 'Queue' AND Name = 'Night Shift'];
        system.debug('nightShiftQueue' + nightShiftQueue.Id);
        Test.stopTest();
    }
}