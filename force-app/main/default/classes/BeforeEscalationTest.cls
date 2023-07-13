@isTest
public class BeforeEscalationTest {

  @isTest(seeAllData = true)
    static void testExecute() {
        // Retrieve a Case record where status is not 'Escalated'
        Case newListCase = new Case();
   // newListCase.CaseNumber = '123456';
    newListCase.Subject = 'Test Case';
    newListCase.Status = 'New';
    newListCase.Origin = 'Phone';
    insert newListCase;

        Test.startTest();
        // Create an instance of the caseEscalation class and schedule it
        SendMailtoQueueMembers scheduledJob = new SendMailtoQueueMembers(newListCase, newListCase.Id);
        String sch = '0 0 0 3 9 ?';// Schedule to run on September 3rd at midnight
        system.schedule('testBasicScheduledApex', sch, scheduledJob);
    }
    // Test method to execute the escalation scheduling logic
  @isTest(seeAllData = true)
static void testExecute3() {

    // Create a list to hold Case records
    list<Case> listCases = new list<Case>();

    // Retrieve a Case record where status is not 'Escalated' ordered by CreatedDate descending
 /*   Case testCases = new Case();
    testCases.Subject = 'Test Case';
    testCases.Status = 'New';
    testCases.Origin = 'Phone';
    insert testCases; */
     Case testCases = [SELECT Id, Status, OwnerId, createdDate FROM Case WHERE status !='Escalated' ORDER BY CreatedDate DESC limit 1];

    // Add the Case record to the list
    listCases.add(testCases);

    Test.startTest();

    // Call the scheduleEscalation method from the EscalationTriggerHandler class
    BeforeEscalationMailHandler.schedulebeforeEscalation(listCases);

    Test.stopTest();
}
    // Another test method to execute the escalation scheduling logic
/*    @isTest(seeAllData = true)
    static void testExecute1() {
        // Create a list to hold Case records
        list<Case> listCases = new list<Case>();
        // Retrieve a Case record where status is not 'Escalated' ordered by CreatedDate descending
        Case testCases = [SELECT Id, Status, OwnerId, createdDate FROM Case WHERE status !='Escalated' ORDER BY CreatedDate DESC limit 1];
        // Add the Case record to the list
        listCases.add(testCases);
        Test.startTest();
        // Call the scheduleEscalation method from the EscalationTriggerHandler class
        BeforeEscalationMailHandler.schedulebeforeEscalation(listCases);
        Test.stopTest();
    } */
}