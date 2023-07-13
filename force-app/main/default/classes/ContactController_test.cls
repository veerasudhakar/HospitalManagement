@IsTest
public class ContactController_test {
     @IsTest(seeAllData=True)
    static void dotest(){
        Case cs = new Case();
        cs.Status='new';
        cs.Priority='high';
        insert cs;
        Test.startTest();
        ContactDataController.fetchContacts();
        Test.stopTest();
    }
    @IsTest(seeAllData=True)
    static void dotest2(){
        Case cs = new Case();
        cs.Status='new';
        cs.Priority='high';
        insert cs;
        Test.startTest();
        List<Case> resultWithFilter = ContactDataController.fetchContacts4('Status', 'New');
        //ContactDataController.fetchContacts1('Email');
        Test.stopTest();
    }
    
}