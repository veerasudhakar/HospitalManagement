public with sharing class DoctorController {
    @AuraEnabled
    public static List<Contact> getDoctors(Integer pageNumber, Integer pageSize) {
        Integer offset = (pageNumber - 1) * pageSize;
        
        return [SELECT Id, Name FROM Contact LIMIT :pageSize OFFSET :offset];
    }
    @AuraEnabled
    public static Integer getTotalPages(Integer pageSize) {
        Integer totalRecords = [SELECT COUNT() FROM Contact];
        return (totalRecords + pageSize - 1) / pageSize;
    }
}