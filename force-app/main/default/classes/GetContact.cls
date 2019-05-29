public with sharing class GetContact {


    @AuraEnabled (cacheable=true)
    public static List<Contact> getContactsFive(String searchKeyForFiveCont){
        string key = '%' + searchKeyForFiveCont + '%';
        return [SELECT Id, Name FROM Contact WHERE Name LIKE :key LIMIT 5];
    }



    @AuraEnabled (cacheable=true)
        public static List<Registration__c> getSelectedContact(String selectedContact){
            
            string key = '%' + selectedContact + '%';
            List <Registration__c> result = [SELECT Name, ArrivalDate__c, Contact__r.Name, NumberOfMatchesPaidFor__c, NumberOfMatchesRemaining__c, NumberOfMatchesScheduled__c 
                    FROM Registration__c
                    WHERE Contact__r.Name LIKE :key LIMIT 1];
                        
                        return result;
        }



    @AuraEnabled (cacheable=true)
        public static List<Contact> grabSelectedContact(String pickedContact){
            string key = '%' + pickedContact + '%';
                return [SELECT   Id, Name FROM Contact WHERE Name LIKE :key LIMIT 1];
        
    }

}


    // @AuraEnabled(cacheable=true)
    // public static List<Contact> getContactList10(){
    //     return [SELECT Id, Name FROM Contact LIMIT 10];
        
    // }

    //  @AuraEnabled(cacheable=true)
    //  public static List<Contact> getContactAll(){
    //     return [SELECT Id, Name FROM Contact];
        
    // }
 
    // @AuraEnabled (cacheable=true)
    // public static List<Contact> getContacts(String searchKey){
    //     string key = '%' + searchKey + '%';
    //     return [SELECT Id, Name FROM Contact WHERE Name LIKE :key];
        
    // }

    
    // @AuraEnabled (cacheable=true)
    // public static list<Contact> getSelectedContact(String selectedContact){
    //     //String selectedContact = 'Rose';
    //     string key = '%' + selectedContact + '%';
    //     return [SELECT Id, Name FROM Contact WHERE Name LIKE :key LIMIT 1];
    //     //return key;
    // }