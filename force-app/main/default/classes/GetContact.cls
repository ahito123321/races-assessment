public with sharing class GetContact {

    @AuraEnabled (cacheable=true)
        public static List<Contact> getContactsFive(String searchKeyForFiveCont){
            string key = '%' + searchKeyForFiveCont + '%';
                return [SELECT Id, Name FROM Contact WHERE Name LIKE :key LIMIT 5];
    }


    @AuraEnabled (cacheable=true)
        public static List<Contact> grabSelectedContactFromApexController(String SelectedContact){
            string key = '%' + SelectedContact + '%';
                return [SELECT Name, (SELECT Name FROM Registration__r) FROM Contact  WHERE Name LIKE :key LIMIT 1];
    }
    

     @AuraEnabled (cacheable=true)
        public static List<Registration__c> grabSelectedNickNameFromApexController(String selectedNickName){
            string key = selectedNickName;
                return [SELECT Id, Name FROM Registration__c  WHERE Name =:key];
    }

    @AuraEnabled (cacheable=true)
        public static List<Registration__c> grabLinksNickName(String grabEdLinksNickName){
            string key = grabEdLinksNickName;
            List <Registration__c> result = [SELECT Name, Arrival_Date__c, Contact__r.Name, Number_of_Matches_Paid_For__c, Number_of_Matches_Remaining__c, Number_of_Matches_Scheduled__c 
                                                     FROM Registration__c
                                                     WHERE Id =:key LIMIT 1];
                                                    return result;
        }
 
}
