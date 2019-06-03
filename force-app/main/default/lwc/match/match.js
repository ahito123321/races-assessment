import { LightningElement, wire, api, track } from 'lwc';
import getMatchesList from '@salesforce/apex/MatchesController.getMatchesList';
import getMatchCount from '@salesforce/apex/MatchesController.getMatchCount';
import { getPicklistValues} from 'lightning/uiObjectInfoApi';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import REALM_FIELD from '@salesforce/schema/Match__c.Realm__c';
import OBJECT_NAME from '@salesforce/schema/Match__c';



export default class Match extends LightningElement {

  @track Allmatches;
  @track selectedMatch;
  @track currentMathces;
   
  realm = '';
  
  @api currentpage;  
  @api pagesize; 
  @api error; 
  @api selectedRace;
  @api matchid;
  
  
  
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
    

    renderedCallback() {

    this.selectMatchByValue(); 
     
   }    


   changeByValue(event) {
    let checked = this.template.querySelectorAll('.selectMatchByRow');
    checked.forEach(checkbox => {
     if ( event.detail.id === checkbox.value ) {
       checkbox.checked = event.detail.checked;
     } 
    });
    console.log({...  event.detail});
     
   }

   getValueCheckbox(event) {
    this.selectedMatch = event.target.value;
    console.log(this.selectedMatch);

   }

   redirectToDetail = (event) => {
    event.preventDefault();  
    window.open(`https://races-assessment-dev-ed.lightning.force.com/lightning/r/Match__c/${event.target.dataset.id}/view`, '_blank');  
   };


   //picklistRealm
     @wire(getObjectInfo, { objectApiName : OBJECT_NAME })
             objectInfo;


     @wire(getPicklistValues, {
            recordTypeId: '$objectInfo.data.defaultRecordTypeId', 
            fieldApiName : REALM_FIELD }) Match;
   


         handleComboboxChange(event) {
           this.selectedMatch = event.detail.value;
           this.currentpage = 1;
           this.isSearchChangeExecuted = false;
           this.realm = (this.selectedMatch === '--Any Type--') ? '' : `where Realm__c = '${this.selectedMatch}'`;
           this.selectMatchByValue();
          
           } 

           selectMatchByValue() {

            if (this.isSearchChangeExecuted && (this.localCurrentPage === this.currentpage)) {  
              return;  
            }  
            this.isSearchChangeExecuted = true;  
            this.localCurrentPage = this.currentpage;
            getMatchCount({ realm: this.realm })  
              .then(recordsCount => {  
                this.totalrecords = recordsCount;  
                if (recordsCount !== 0 && !isNaN(recordsCount)) {  
                  this.totalpages = Math.ceil(recordsCount / this.pagesize);  
                  getMatchesList({ realm: this.realm, pagenumber: this.currentpage, numberOfRecords: recordsCount, pageSize: this.pagesize  })  
                    .then(contactList => { 
                      this.Allmatches = contactList;  
                      this.currentMathces = contactList;
                      this.error = undefined;  
                    })  
                    .catch(error => {  
                      this.error = error;    
                    });  
                } else {  
                  this.Allmatches = [];  
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

         

         
                  
        }
        
      
      




  
      
           



   


