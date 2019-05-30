import { LightningElement, wire, api, track } from 'lwc';
import getMatchesList from '@salesforce/apex/MatchesController.getMatchesList';
import getMatchCount from '@salesforce/apex/MatchesController.getMatchCount';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import REALM_FIELD from '@salesforce/schema/Match__c.Realm__c';
import OBJECT_NAME from '@salesforce/schema/Match__c';


export default class Match extends LightningElement {

  @track matches;
  @track selectedMatch;

  @api currentpage;  
  @api pagesize; 
  @api error; 
  @track selectedRace;
  
   totalpages;  
   localCurrentPage = null;  
   isSearchChangeExecuted = false;
   

   pageSizeOptions =  
     [  
       { label: '5', value: 5 },  
       { label: '10', value: 10 },  
       { label: '25', value: 25 },  
       { label: '50', value: 50 },  
       { label: 'All', value: '' },  
     ];  

   //pagination
   renderedCallback() {  
     
     if (this.isSearchChangeExecuted && (this.localCurrentPage === this.currentpage)) {  
       return;  
     }  
     this.isSearchChangeExecuted = true;  
     this.localCurrentPage = this.currentpage;
     getMatchCount()  
       .then(recordsCount => {  
         this.totalrecords = recordsCount;  
         if (recordsCount !== 0 && !isNaN(recordsCount)) {  
           this.totalpages = Math.ceil(recordsCount / this.pagesize);  
           getMatchesList({ pagenumber: this.currentpage, numberOfRecords: recordsCount, pageSize: this.pagesize })  
             .then(contactList => {  
               this.matches = contactList;  
               this.error = undefined;  
             })  
             .catch(error => {  
               this.error = error;  
               this.matches = undefined;  
             });  
         } else {  
           this.matches = [];  
           this.totalpages = 1;  
           this.totalrecords = 0;  
         }  
         const event = new CustomEvent('recordsload', {  
           detail: recordsCount  
         });  
         this.dispatchEvent(event);  
       })  
       .catch(error => {  
         this.error = error;  
         this.totalrecords = undefined;  
       });  
   }  


   //picklistRealm
     @wire(getObjectInfo, { objectApiName : OBJECT_NAME })
             objectInfo;


     @wire(getPicklistValues, {
            recordTypeId: '$objectInfo.data.defaultRecordTypeId', 
            fieldApiName : REALM_FIELD }) Match;

           handleComboboxChange(event) { 
             this.selectedMatch = event.detail.value;       
        }
        
      
      }




  
      
           



   


