import { LightningElement, wire, api } from 'lwc';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import RACE_FIELD from '@salesforce/schema/Participant__c.Race__c';
import OBJECT_NAME from '@salesforce/schema/Participant__c';
import { CurrentPageReference } from 'lightning/navigation';
import { fireEvent } from 'c/pubsub';

export default class PicklistRaces extends LightningElement {

  @api matchid;
  @api currentvaluepicklist;
  
 
  @wire (CurrentPageReference) pageRef;

  @wire(getObjectInfo, { objectApiName : OBJECT_NAME })
      objectInfo;


@wire(getPicklistValues, {
          recordTypeId: '$objectInfo.data.defaultRecordTypeId', 
          fieldApiName : RACE_FIELD }) PicklistRaces;
  

         handlePicklistChange(event) {
            fireEvent(this.pageRef, 'handlepicklistchange', {
              detail: { 
                id: this.matchid, 
                selectedRace: event.detail.value,
                checked:  event.detail.value !== '--None--'
               
             }
           });
          
      } 
      
      
  
      }