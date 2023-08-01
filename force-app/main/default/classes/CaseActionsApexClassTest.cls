@isTest(SeeAllData=true)
public class CaseActionsApexClassTest {
@isTest static void testHighPriorityCase() {
        // Create a test account
        Account acc = new Account(Name='Test Account');
        insert acc;
        
        // Create a high priority case
        Case cs = new Case(
            AccountId = acc.Id,
            Priority = 'High',
            Subject = 'Test High Priority Case',
            Description = 'This is a test high priority case.'
        );
    
        insert cs;
        // Verify that the case was created successfully
        System.assertEquals('High', cs.Priority);
        System.assertEquals('Test High Priority Case', cs.Subject);
    }
    
    @isTest static void testProductSupportCase() {
        // Create a test account
        Account acc = new Account(Name='Test Account');
        insert acc;
        
        // Create a product support case
        Case cs = new Case(
            AccountId = acc.Id,
            Product__c = 'Test Product',
            Subject = 'Test Product Support Case',
            Description = 'This is a test product support case.'
        );
        insert cs;
        
        // Verify that the case was created successfully
        System.assertEquals('Test Product', cs.Product__c);
        System.assertEquals('Test Product Support Case', cs.Subject);
    }
    @IsTest
    static void bothProductAndSkillSelected(){
        List<Case> caseList = new List<Case>();
        Case cs = new Case(
            Priority = 'High',
            Subject = 'Test High Priority Case',
            Description = 'This is a test high priority case.',
            Product__c = 'Laptop',
            My_Skill__c = 'English'
            
        );
        caseList.add(cs);
        CaseActionsApexClass.assignCases(caseList);
    }
}