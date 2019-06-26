public with sharing class registrationFormClass {
    @AuraEnabled (cacheable=true)
        public static List<Contact> searchInputContactApexController(String inputedTextForContactSearch){
            string key = '%' + inputedTextForContactSearch + '%';
                return [SELECT Id, Name FROM Contact WHERE Name LIKE :key LIMIT 5];
    }
    

     @AuraEnabled (cacheable=true)
        public static List<Contact> getChosenContactApexContoller(String searchKeyForChosenContact){
            string key = '%' + searchKeyForChosenContact + '%';
                return [SELECT Name, (SELECT Name FROM Registration__r) FROM Contact  WHERE Name LIKE :key LIMIT 1];
    }
    
     @AuraEnabled (cacheable=true)
        public static List<Registration__c> handleNickNameInputApexContoller(String nicknameInputGetter){
            string key = nicknameInputGetter;
                return [SELECT Id, Name FROM Registration__c WHERE Name =:key];
    }
}
