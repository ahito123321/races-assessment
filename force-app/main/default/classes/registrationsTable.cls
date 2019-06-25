public with sharing class registrationsTable {

     @AuraEnabled (cacheable=true)
        public static List<Registration__c> takeAllRegistrations(String keyElement){
            string key = '%' + keyElement + '%';
                return [SELECT Id, Name FROM Registration__c WHERE Name LIKE :key];
            // if (key == '') {
            //     list <Registration__c> resultA  = [SELECT Id, Name FROM Registration__c];
            //         return resultA;
            // } else {
            //     list <Registration__c> resultB  = [SELECT Id, Name FROM Registration__c WHERE Name LIKE :key];
            //         return resultB;
            // }
               
    }


    @AuraEnabled (cacheable=true)
            public static List<Registration__c> getPickedRegistration(String selectedRegistration){
                string key = selectedRegistration;
                return [SELECT Id, Name FROM Registration__c
                        WHERE Name =:selectedRegistration LIMIT 1];
    }

        
    @AuraEnabled (cacheable=true)
                public static List<Registration__c> getRegistrationById(String selectedRegistration){
                    string key = selectedRegistration;
                    return [SELECT Id, Name FROM Registration__c
                            WHERE Id =:selectedRegistration LIMIT 1];
    }
}