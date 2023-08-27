public with sharing class TodoList {
    @AuraEnabled
    public static string TodoList(string title, date duedate) {
        try {
            TodoList__c todo = new TodoList__c();
        todo.Title__c = title;
        todo.Duedate__c = duedate;
        insert todo;
        return 'success';
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
   
}