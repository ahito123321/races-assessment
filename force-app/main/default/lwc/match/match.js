import { LightningElement, wire, api, track } from 'lwc';
import getMatchByDate from '@salesforce/apex/MatchesController.getMatchByDate';
import getRegistrationId from '@salesforce/apex/MatchesController.getRegistrationId';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import REALM_FIELD from '@salesforce/schema/Match__c.Realm__c';
import OBJECT_NAME from '@salesforce/schema/Match__c';
import { fireEvent, registerListener } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';



export default class Match extends LightningElement {

  @track allMatches;
  @track currentMathces;
  @track selectedMatch;
  @track isLoading;
  @track isLoadingAll = true; 
  @track totalrecords = 0;
  @track popupError = false;


  totalpage;
  listOfMatchesIds = [];
  realm = '';
  filterCriteria = {
    realm: '--Any Type--'
  };
  
  @api currentpage;  
  @api pagesize; 
  @api error; 
  
  @wire(CurrentPageReference) pageRef;
  
  
   
             
            // register event from pagination.js and registration.js
            connectedCallback() {
             registerListener('changeCurrentPageEvent' , this.handleChangeCurrentPageEvent, this); 
             registerListener('registrationPrefillder', this.handleComeDataFromRegistration, this);     
            }     

            // take all dates matches that was picked in registration 
            handleChangeDateEvent() {
              let dataset = [];
              this.allMatches
                .filter(match => {
                  if (!dataset.some(data => data.date === match.Date__c)) {
                    dataset.push({
                      date: match.Date__c,
                      count: 0
                    });
                  }
                  return this.listOfMatchesIds.some(id => match.Id === id.Id)
                })
                .forEach((match) => {
                  
                  let index = -1;
                  for(let i = 0, len = dataset.length; i < len; i++) {
                      if (dataset[i].date === match.Date__c) {
                          index = i;
                          break;
                      }
                  }
                  dataset[index].count++;
                });

               
              fireEvent(this.pageRef, 'changeDataEvent', {
                detail: dataset
              });
       
            }

            

            // handle come Id and Arrival date from registration
            handleComeDataFromRegistration(event) {
             let detail = event.detail;

             getRegistrationId({ 
                regId: detail.registrationID,
                dateMatch: detail.registrationAD 
              })
              .then(res => {
                this.listOfMatchesIds = res; 
                return getMatchByDate({ dateMatch: detail.registrationAD })
              })
              .then(res => {
                this.allMatches = res;
                this.totalrecords = res.length;
                fireEvent(this.pageRef, 'changeTotalRecordsEvent', { detail: this.totalrecords }); 
                this.isLoadingAll = false;
                this.handleChangeDateEvent();
              })
              .catch(err => {
                console.log(err);
                console.error('err load');
              })  

          
            }

            // filter by realm and implemented pagination and checked checkbox by picked value from Race picklist
            handleChangeCurrentPageEvent(event) {
              this.isLoading = true;
              let detail = event.detail;
              this.currentpage = detail.currentpage;

              let temp = this.allMatches
                .filter(match => {
                  if (this.filterCriteria.realm === '--Any Type--') return true;
                  return this.filterCriteria.realm === match.Realm__c;
                });

              this.totalrecords = temp.length;
              this.totalpage = Math.ceil(this.totalrecords / detail.pagesize );

              this.currentMathces = temp
                .filter((match, index ) => {           
                  return detail.currentpage === Math.ceil((index + 1) / detail.pagesize);                
                }).map(value => {
                  let index;
                  let checked = this.listOfMatchesIds.some((id, i) => {
                    index = i;
                    return value.Id === id.Id;
                  });
     
                  return {
                    ...value,
                    checked: checked, 
                    currentValuePicklist: checked ? this.listOfMatchesIds[index].Race__c  : '--None--',
                    isCorrect: true
                  }; 
                });    

              fireEvent(this.pageRef, 'changeTotalRecordsEvent', { detail: temp.length });
              this.isLoading = false;
              
            }

          

            // find matches on this reg Id and checked their and add, delete matches 
            handleBlockPagination = (target) => {
              let match = this.currentMathces.find(matchIndex => matchIndex.Id === target.value);
               
              if (target.checked) {
                if  (!(match.currentValuePicklist === '--None--') && !this.listOfMatchesIds.some(list => list.Id === match.Id))
                     this.listOfMatchesIds = [... this.listOfMatchesIds, { Id: match.Id }];
                } else {
                 this.listOfMatchesIds.splice(this.listOfMatchesIds.map(id => id.Id).indexOf(match.Id), 1)  
                 }
                         
                 match.isCorrect = !(target.checked && match.currentValuePicklist === '--None--'); 

                  fireEvent(this.pageRef, 'blockPaginationEvent', {
                    detail: { 
                      match: match,
                      checked: target.checked,
                      picklistValue: match.currentValuePicklist   
                    }
                  }); 
              
                this.handleChangeDateEvent();
              };
   

            // choose match by checkbox
            chooseMatchByCheckbox = (event) => {
              this.selectedMatch = event.target.value;

              this.handleBlockPagination(event.target);
              
            }
 
            // checked checkbox when choose value from picklist 
            changeByValuePicklistInTable = (event) => {
              let checkboxs = this.template.querySelectorAll('.selectMatchByRow');
              checkboxs.forEach(checkbox => {
                if (event.detail.id === checkbox.value ) {
                  let match = this.currentMathces.find(value => value.Id === event.detail.id);
                  match.currentValuePicklist = event.detail.selectedRace;
                  match.checked = event.detail.checked;
                  checkbox.checked = event.detail.checked;
                  this.handleBlockPagination(checkbox); 
                }         
              });  
            };



            // redirect to Match page detail
            redirectToDetail = (event) => {
              window.open(`https://races-assessment-dev-ed.lightning.force.com/lightning/r/Match__c/${event.target.dataset.id}/view`, '_blank');  
            };


            // picklist Realm
            @wire(getObjectInfo, { objectApiName : OBJECT_NAME })
                            objectInfo;


            @wire(getPicklistValues, {
                    recordTypeId: '$objectInfo.data.defaultRecordTypeId', 
                    fieldApiName : REALM_FIELD }) Match;
          

            // picklist filter by Realm on table
            handleComboboxChange = (event) => {
            
              this.filterCriteria.realm = event.detail.value;
              this.currentpage = 1;
              fireEvent(this.pageRef, 'setFirstPageEvent', {});
            };

          }