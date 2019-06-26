public with sharing class registrationFormClass {
    @AuraEnabled (cacheable=true)
        public static List<Contact> searchInputContactApexController(String contactSought){
            string key = '%' + contactSought + '%';
                return [SELECT Id, Name FROM Contact WHERE Name LIKE :key LIMIT 5];
    }
    

     @AuraEnabled (cacheable=true)
        public static List<Contact> getChosenContactApexContoller(String chosenContact){
            string key = '%' + chosenContact + '%';
                return [SELECT Name, (SELECT Name FROM Registration__r) FROM Contact WHERE Name LIKE :key LIMIT 1];
    }
    
     @AuraEnabled (cacheable=true)
        public static List<Registration__c> handleNickNameInputApexContoller(String nicknameSought){
            string key = nicknameSought;
                return [SELECT Id, Name FROM Registration__c WHERE Name =:key];
    }
}
