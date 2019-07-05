public with sharing class MatchesController {

 
  @AuraEnabled(cacheable = true) 
  public static List<Match__c> getMatchByDate(String dateMatch) {
    return [SELECT Id, Name, Date__c, Number_of_Participants_Remaining__c, Realm__c FROM Match__c 
            WHERE Date__c >= :Date.valueOf(dateMatch) AND Date__c < :Date.valueOf(dateMatch).addDays(7) ORDER BY Date__c];
  } 
    @AuraEnabled(cacheable = true) 
   public static List<AggregateResult> getRegistrationId(String regId, String dateMatch) {
      return [SELECT Match__r.Id, Race__c FROM Participant__c 
              WHERE Registration__r.Id = :regId AND Match__r.Date__c >= :Date.valueOf(dateMatch) AND Match__r.Date__c < :Date.valueOf(dateMatch).addDays(7)
              GROUP BY Match__r.Id, Race__c]; 
  }

 
}

