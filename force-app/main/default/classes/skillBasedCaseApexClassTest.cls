@isTest(seeAllData = true)
public class skillBasedCaseApexClassTest {
    @isTest
    static void testAssignCases() {
        
        Skill__c eng = [SELECT Id, Name From Skill__c WHERE Name = 'English' LIMIT 1];
        Skill__c java = [SELECT Id, Name From Skill__c WHERE Name = 'Java' LIMIT 1];
      
        // Create test data
        List<Case> caseList = new List<Case>();
        Case case1 = new Case(Skill_Name__c = eng.Id, Priority = 'Low');
        Case case2 = new Case(Skill_Name__c = java.Id, Priority = 'Medium');
        Case case3 = new Case(Skill_Name__c =eng.Id , Priority = 'High');
        caseList.add(case1);
        caseList.add(case2);
        caseList.add(case3);
        
        // Create test User_Skill__c records
        List<User_Skill__c> userSkills = new List<User_Skill__c>();
        User_Skill__c userSkill1 = new User_Skill__c(User__c = UserInfo.getUserId(), Skill_Name__c = eng.Id);
        User_Skill__c userSkill2 = new User_Skill__c(User__c = UserInfo.getUserId(), Skill_Name__c = java.Id);
        User_Skill__c userSkill3 = new User_Skill__c(User__c = UserInfo.getUserId(), Skill_Name__c = eng.Id);
        userSkills.add(userSkill1);
        userSkills.add(userSkill2);
        userSkills.add(userSkill3);
        insert userSkills;
        
        Test.startTest();
        // Call the method to be tested
        skillBasedCaseApexClass.assignCases(caseList);
        Test.stopTest();
        
        // Verify the assignment of cases
        for (Case c : caseList) {
           // System.assertEquals('0055i000007Ed6sAAC', UserInfo.getUserId());
        }
    }
    @isTest
    static void testAssignCases2() {
        Skill__c testUserSkill4 = new Skill__c();
        testUserSkill4.Name='AWS';
        insert testUserSkill4;
        List<Case> caseList = new List<Case>();
        Case case1 = new Case(Skill_Name__c = testUserSkill4.Id, Priority = 'Low');
        caseList.add(case1);
        insert caseList;
        List<User_Skill__c> userSkills = new List<User_Skill__c>();
        User_Skill__c userSkill1 = new User_Skill__c(User__c = UserInfo.getUserId(), Skill_Name__c = testUserSkill4.Id);
        userSkills.add(userSkill1);
        insert userSkills;
        Test.startTest();
        skillBasedCaseApexClass.assignCases(caseList);
        Test.stopTest();
         for (Case c : caseList) {
           // System.assertEquals('0055i000007Ed6sAAC', UserInfo.getUserId());
        }
    }
}