public with sharing class MatchesController {

   @AuraEnabled(cacheable = true)  
   public static List<Match__c> getMatchesList(Integer pagenumber, Integer numberOfRecords, Integer pageSize) {  
     String query = ' select Name, Date__c, Number_of_Participants_Remaining__c, Realm__c from Match__c ';   
     query += ' limit ' + pageSize + ' offset ' + (pageSize * (pagenumber - 1));  
     return Database.query(query);  
   }  

   @AuraEnabled(cacheable = true)  
   public static Integer getMatchCount() {  
     String query = 'select count() from Match__c ';  
     return Database.countQuery(query);  
   } 
 

}


