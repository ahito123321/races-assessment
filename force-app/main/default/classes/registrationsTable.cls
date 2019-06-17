public with sharing class registrationsTable {

     @AuraEnabled (cacheable=true)
        public static List<Registration__c> takeAllRegistrations(){
            return [SELECT Id, Name FROM Registration__c];
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