public with sharing class PaginationController {
    public List<Contact> fetchData(Integer pageNumber, Integer pageSize) {
        Integer offset = (pageNumber - 1) * pageSize;
        return [SELECT Id, Name
                FROM Contact
                ORDER BY Name
                LIMIT :pageSize
                OFFSET :offset];
    }
    
    public Integer getTotalRecordCount() {
        return [SELECT COUNT() FROM Contact];
    }
}