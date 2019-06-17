public with sharing class listRegistrationController {
    
    @AuraEnabled (cacheable=true)
        public static List<Registration__c> grabSelectedRegistration(String searchKeyForNickName){
            string key = '%' + searchKeyForNickName + '%';
                return [SELECT Id, Name FROM Registration__c WHERE Name LIKE :key LIMIT 50];
    }
}