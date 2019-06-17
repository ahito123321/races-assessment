import { LightningElement, wire, api, track } from 'lwc';
import getMatchesList from '@salesforce/apex/MatchesController.getMatchesList';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import REALM_FIELD from '@salesforce/schema/Match__c.Realm__c';
import OBJECT_NAME from '@salesforce/schema/Match__c';
import { fireEvent, registerListener } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';



export default class Match extends LightningElement {

  @track allMatches;
  @track selectedMatch;
  @track currentMathces;
  @track isLoading;
   
  realm = '';
  
  @api currentpage;  
  @api pagesize; 
  @api error; 
  @api matchid;
  
  
  @wire(CurrentPageReference) pageRef;
  
   totalpage;

   
             
            // run code when a component renders, this hook flows from child to parent
            connectedCallback() {
             registerListener('changeCurrentPageEvent' , this.handleChangeCurrentPageEvent, this);
             this.selectMatchByValue();
            }

            handleChangeCurrentPageEvent(event) {
              this.isLoading = true;
              let detail = event.detail;
              this.currentpage = detail.currentpage;
              this.totalpage = Math.ceil(this.totalrecords / detail.pagesize );
              this.currentMathces = this.allMatches.filter((match, index ) => {           
                  return detail.currentpage === Math.ceil((index + 1) / detail.pagesize);                
                }).map(value => {
                  return {
                    ...value,
                    currentValuePicklist: '--None--'
                  };
                });
              this.isLoading = false;   
              
            }


            // fire event for determine current matches by id and ckeched checkbox
            handleBlockPagination = (target) => {
              let match = this.currentMathces.find(value => value.Id === target.value);
              fireEvent(this.pageRef, 'blockPaginationEvent', {
                detail: { 
                  match: match,
                  checked: target.checked,
                  picklistValue: match.currentValuePicklist   
                }
              }); 
            };

            // choose match by checkbox
            chooseMatchByCheckbox = (event) => {
              this.selectedMatch = event.target.value; 
              this.handleBlockPagination(event.target);
              
            }
 
            // checked checkbox when choose value from picklist 
            changeByValue = (event) => {
              let checked = this.template.querySelectorAll('.selectMatchByRow');
              checked.forEach(checkbox => {
                if (event.detail.id === checkbox.value ) {
                  let match = this.currentMathces.find(value => value.Id === event.detail.id);
                  match.currentValuePicklist = event.detail.selectedRace;
                  checkbox.checked = event.detail.checked;
                  this.handleBlockPagination(checkbox); 
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
              this.realm = (this.selectedMatch === '--Any Type--') ? '' : `where Realm__c = '${this.selectedMatch}'`;
              this.selectMatchByValue();
              
              } 

              // function for determine data from base and their logic  
              selectMatchByValue() {
                this.isLoading = true;
                fireEvent(this.pageRef, 'changeTotalRecordsEvent', { detail: 0 });       
                getMatchesList({ realm: this.realm  })  
                  .then(listOfMatches => {
                    this.allMatches = listOfMatches;
                    this.totalrecords = listOfMatches.length;
                    fireEvent(this.pageRef, 'changeTotalRecordsEvent', { detail: this.totalrecords });
                    
                      
                  })  
                  .catch(error => {  
                    this.error = error;    
                  });  
                }
              }         
        

        
      
      




  
      
           



   


