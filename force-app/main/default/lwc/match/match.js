import { LightningElement, wire, api, track } from 'lwc';
import getMatchesList from '@salesforce/apex/MatchesController.getMatchesList';
import getMatchCount from '@salesforce/apex/MatchesController.getMatchCount';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import REALM_FIELD from '@salesforce/schema/Match__c.Realm__c';
import OBJECT_NAME from '@salesforce/schema/Match__c';
import { fireEvent } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';



export default class Match extends LightningElement {

  @track allMatches;
  @track selectedMatch;
  @track currentMathces;
  @track isLoading;
  @track isError = false;
   
  realm = '';
  
  @api currentpage;  
  @api pagesize; 
  @api error; 
  @api matchid;
  
  
  @wire(CurrentPageReference) pageRef;
  
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
    
             
            // run code when a component renders, this hook flows from child to parent
             renderedCallback() {
              this.selectMatchByValue();
            }    
            
            // fire event for determine current matches by id and ckeched checkbox
            handledispatchFunc = (target, selectedRace = '--None--') => {
                fireEvent(this.pageRef, 'blockPaginationEvent', {
                  detail: { 
                    match:  this.currentMathces.find(value => value.Id === target.value),
                    checked: target.checked,
                    picklistValue: selectedRace   
                }
              }); 
            };

            // choose match by checkbox
            chooseMatchByCheckbox = (event) => {
              this.selectedMatch = event.target.value; 
              this.handledispatchFunc(event.target);
              
            }
 
            // checked checkbox when choose value from picklist 
            changeByValue = (event) => {
              let checked = this.template.querySelectorAll('.selectMatchByRow');
              checked.forEach(checkbox => {
              if ( event.detail.id === checkbox.value ) {
                checkbox.checked = event.detail.checked;
                this.handledispatchFunc(checkbox, event.detail.selectedRace); 
              }         
              });  
            };



            // redirect to Match page detail
            redirectToDetail = (event) => {
              window.open(`https://races-assessment-dev-ed.lightning.force.com/lightning/r/Match__c/${event.target.dataset.id}/view`, '_blank');  
            };

   


            // picklistRealm
            @wire(getObjectInfo, { objectApiName : OBJECT_NAME })
                            objectInfo;


            @wire(getPicklistValues, {
                    recordTypeId: '$objectInfo.data.defaultRecordTypeId', 
                    fieldApiName : REALM_FIELD }) Match;
          

            // picklist filter by realm on table
            handleComboboxChange = (event) => {

              this.selectedMatch = event.detail.value;
              this.currentpage = 1;
              this.isSearchChangeExecuted = false;
              this.realm = (this.selectedMatch === '--Any Type--') ? '' : `where Realm__c = '${this.selectedMatch}'`;
              this.selectMatchByValue();
              
              } 

              // function for determine data from base and their logic  
              selectMatchByValue() {

                if (this.isSearchChangeExecuted && (this.localCurrentPage === this.currentpage)) {  
                  return;  
                }  
                this.isSearchChangeExecuted = true;  
                this.localCurrentPage = this.currentpage;
                this.isLoading = true;
                getMatchCount({ realm: this.realm })  
                  .then(recordsCount => {  
                    this.totalrecords = recordsCount;  
                    if (recordsCount !== 0 && !isNaN(recordsCount)) {  
                      this.totalpages = Math.ceil(recordsCount / this.pagesize);  
                      getMatchesList({ realm: this.realm, pagenumber: this.currentpage, numberOfRecords: recordsCount, pageSize: this.pagesize  })  
                        .then(contactList => { 
                          this.allMatches = contactList;  
                          this.currentMathces = contactList;
                          this.isLoading = false; 
                        })  
                        .catch(error => {  
                          this.error = error;    
                        });  
                        } else {  
                          this.allMatches = [];  
                          this.totalpages = 1;  
                          this.totalrecords = 0;  
                        }  
                        this.dispatchEvent(new CustomEvent( 'recordsload', {  
                          detail: recordsCount  
                        }));     
                      })  
                      .catch(error => {  
                        this.error = error;   
                      });  
              }         
        }
        
      
      




  
      
           



   


