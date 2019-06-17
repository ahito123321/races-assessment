import { LightningElement, wire, api } from 'lwc';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import RACE_FIELD from '@salesforce/schema/Participant__c.Race__c';
import OBJECT_NAME from '@salesforce/schema/Participant__c';

export default class PicklistRaces extends LightningElement {

    @api matchid;
    @api isError = false;
    
   
    @wire(getObjectInfo, { objectApiName : OBJECT_NAME })
        objectInfo;


  @wire(getPicklistValues, {
            recordTypeId: '$objectInfo.data.defaultRecordTypeId', 
            fieldApiName : RACE_FIELD }) PicklistRaces;
    

           handlePicklistChange(event) {
              this.dispatchEvent(new CustomEvent('handlepicklistchange', {
                detail: { 
                  id: this.matchid, 
                  selectedRace: event.detail.value,
                  checked: event.detail.value 
               }
             }));
             
        } 
        
      
  
      }





