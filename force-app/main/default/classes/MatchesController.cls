public with sharing class MatchesController {

 
  @AuraEnabled(cacheable = true) 
  public static List<Match__c> getMatchByDate(String dateMatch) {
    Date arrivialDate = Date.valueOf(dateMatch);
    Date arrivialDate7 = arrivialDate.addDays(7);
    Datetime arrivialDateTime = DateTime.newInstance(arrivialDate, Time.newInstance(0, 0, 0, 0));
    Datetime arrivialDateTime7 = DateTime.newInstance(arrivialDate7, Time.newInstance(0, 0, 0, 0));

    String query = ' select Id, Name, Date__c, Number_of_Participants_Remaining__c, Realm__c from Match__c  ';
    query += ' where Date__c >= ' + arrivialDateTime.format('yyyy-MM-dd')  + ' and Date__c < ' + arrivialDateTime7.format('yyyy-MM-dd') + ' order by Date__c ';
   return Database.query(query); 
  } 
    @AuraEnabled(cacheable = true) 
   public static List<Participant__c> getRegistrationId(String regId, String dateMatch) {
      Date arrivialDate = Date.valueOf(dateMatch);
      Date arrivialDate7 = arrivialDate.addDays(7);
      Datetime arrivialDateTime = DateTime.newInstance(arrivialDate, Time.newInstance(0, 0, 0, 0));
      Datetime arrivialDateTime7 = DateTime.newInstance(arrivialDate7, Time.newInstance(0, 0, 0, 0));
      
      String query = ' select Match__r.Id, Race__c from Participant__c ';
      query += ' where Registration__r.Id = \'' + regId + '\' and ';
      query += 'Match__r.Date__c >= ' + arrivialDateTime.format('yyyy-MM-dd')  + ' and Match__r.Date__c < ' + arrivialDateTime7.format('yyyy-MM-dd');
      query += ' group by Match__r.Id, Race__c';
      return Database.query(query); 
  }

 
}

 //(Match__r.Date__c = 2019-05-27)
   // select Name, Registration__r.Arrival_Date__c, Registration__c, Match__r.Date__c, Match__r.Number_of_Participants_Remaining__c, Match__r.Realm__c, Match__r.Name from Participant__c where (Registration__r.Arrival_Date__c >= 2019-05-25)
  
  // select Id, Name, Date__c, Number_of_Participants_Remaining__c, Realm__c from Match__c where Date__c >= '2019-05-25' 
  // select Match__r.Id from Participant__c where Registration__r.Id = 'a022v000010zNwwAAE'
  //' where Date__c  >= ' + dateMatch.format('yyyy-MM-dd') + ' and Date__c <= ' + tempDate.format('yyyy-MM-dd') + ' order by Date__c ';
  // query += ' where Date__c  >= ' + tempDate.format('yyyy-MM-dd') + ' order by Date__c ';