public with sharing class GetContact {

    @AuraEnabled (cacheable=true)
        public static List<Contact> getContactsFive(String searchKeyForFiveCont){
            string key = '%' + searchKeyForFiveCont + '%';
                return [SELECT Id, Name FROM Contact WHERE Name LIKE :key LIMIT 5];
    }


    @AuraEnabled (cacheable=true)
        public static List<Contact> grabSelectedContactFromApexController(String SelectedContact){
            string key = '%' + SelectedContact + '%';
                return [SELECT Name, (SELECT Name FROM Registrations__r) FROM Contact  WHERE Name LIKE :key LIMIT 1];
    }
    

     @AuraEnabled (cacheable=true)
        public static List<Registration__c> grabSelectedNickNameFromApexController(String selectedNickName){
            string key = selectedNickName;
                return [SELECT Id, Name FROM Registration__c  WHERE Name =:key];
    }

    @AuraEnabled (cacheable=true)
        public static List<Registration__c> grabLinksNickName(String grabEdLinksNickName){
            string key = grabEdLinksNickName;
            List <Registration__c> result = [SELECT Name, ArrivalDate__c, Contact__r.Name, NumberOfMatchesPaidFor__c, NumberOfMatchesRemaining__c, NumberOfMatchesScheduled__c 
                                                     FROM Registration__c
                                                     WHERE Id =:key LIMIT 1];
                                                    return result;
        }
 
}


    // @AuraEnabled (cacheable=true)
    //     public static List<Contact> grabSelectedContact(String pickedContact){
    //         string key = '%' + pickedContact + '%';
    //             return [SELECT   Id, Name FROM Contact WHERE Name LIKE :key LIMIT 1];
        
    // }

    
    // @AuraEnabled (cacheable = true)
    //     public static List<Registration__c> apexNickNameValidation(String selectedNickName){
    //         string key = '%' + selectedNickName + '%';
    //             return [SELECT Id, Name FROM Registration__c WHERE Name LIKE :key];
        
    // }

    
//  @AuraEnabled (cacheable=true)
//         public static List<Registration__c> getSelectedNickNameFromApexNumberTwo(){
            
//             return [SELECT Id, Name, ArrivalDate__c, Contact__r.Name, NumberOfMatchesPaidFor__c, NumberOfMatchesRemaining__c, NumberOfMatchesScheduled__c 
//                     FROM Registration__c];
//     }
        // @AuraEnabled (cacheable=true)
        //         public static List<Registration__c> getSelectedContact(String selectedContact){
        //             string key = '%' + selectedContact + '%';
        //             List <Registration__c> result = [SELECT Name, ArrivalDate__c, Contact__r.Name, NumberOfMatchesPaidFor__c, NumberOfMatchesRemaining__c, NumberOfMatchesScheduled__c 
        //                                                 FROM Registration__c
        //                                                 WHERE Contact__r.Name LIKE :key LIMIT 1];
        //                 return result;
        //         }


        // @AuraEnabled (cacheable=true)
    //     public static List<Registration__c> grabSelectedNickName(String chosenNickName){
    //         string key = '%' + chosenNickName + '%';
    //            List <Registration__c> result = [SELECT Name, ArrivalDate__c, Contact__r.Name, NumberOfMatchesPaidFor__c, NumberOfMatchesRemaining__c, NumberOfMatchesScheduled__c 
    //                                                 FROM Registration__c
    //                                                 WHERE Name LIKE :key LIMIT 1];
    //                                                 return result;
                     
    //     }

    // @AuraEnabled (cacheable=true)
    //     public static List<Registration__c> getSelectedNickNameFromApex(String searchKeyForNickName){
    //         string key = '%' + searchKeyForNickName + '%';
    //         return [SELECT Id, Name FROM Registration__c LIMIT 5];
    // }


    