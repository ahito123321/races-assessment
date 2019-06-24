import { LightningElement, api, wire, track} from 'lwc';
import { registerListener , fireEvent } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';


export default class Pagination extends LightningElement {
  
   @track currentpage = 1;  
   @track totalpage = 0;
   
   @api isBlocked = false;

   pagesize = 5;
   matchesIds = [];
 

          @wire(CurrentPageReference) pageRef;

            // getter for first buttons 
            get showFirstButton() {
              if (this.totalpage === 0) return true;
              return this.currentpage === 1 || this.isBlocked;
            }  

           // getter for last buttons
            get showLastButton() {    
              if (this.totalpage === 0) return true;
              return this.totalpage === this.currentpage || this.isBlocked;
            
            }

            // register event from match.js
            connectedCallback() {    
              registerListener('blockPaginationEvent', this.handleChooseMatch, this);
              registerListener('changeTotalRecordsEvent', this.handleChangeTotalRecords, this);
              registerListener('setFirstPageEvent', this.handleSetFirstPageEvent, this);
            }

            handleSetFirstPageEvent = () => {
              fireEvent(this.pageRef, 'changeCurrentPageEvent', { detail: { currentpage: 1, pagesize: this.pagesize}});
            };

            // choose match by checkbox and block pagination if none in race picklist
            handleChooseMatch(event) {
              let existMatch = this.matchesIds.some(id => event.detail.match.Id === id);

              if (event.detail.checked && event.detail.picklistValue === '--None--') {
                if (!existMatch) this.matchesIds.push(event.detail.match.Id);
              } else {
                if (existMatch) {
                  let index = this.matchesIds.indexOf(event.detail.match.Id);
                  this.matchesIds.splice(index, 1);
                } 
              }
              this.isBlocked = this.matchesIds.length > 0;
            }

              handleChangeTotalRecords(event) {
               if (Math.ceil(event.detail / this.pagesize) === this.totalpage) return;
                this.totalpage = Math.ceil(event.detail / this.pagesize);
                this.currentpage = 1;                 
                fireEvent(this.pageRef, 'changeCurrentPageEvent', { detail: { currentpage: 1, pagesize: this.pagesize}});
               
              }           
      
   
              //fire events based on the button actions  
              handlePrevious() {
                if (this.currentpage > 1) {  
                  this.currentpage = this.currentpage - 1;  
                }          
                fireEvent(this.pageRef, 'changeCurrentPageEvent', {
                  detail: {
                    currentpage: this.currentpage,
                    pagesize: this.pagesize
                  }
                });  
              }  
              handleNext() {  
                if (this.currentpage < this.totalpage) {
                  this.currentpage = this.currentpage + 1; 
                } 
                
                  fireEvent(this.pageRef, 'changeCurrentPageEvent', {
                    detail: {
                      currentpage: this.currentpage,
                      pagesize: this.pagesize
                    }
                  });   
              }  

              handleFirst() {  
                this.currentpage = 1;
                fireEvent(this.pageRef, 'changeCurrentPageEvent', {
                  detail: {
                    currentpage: this.currentpage,
                    pagesize: this.pagesize
                  }
                });    
              }  

              handleLast() {  
                this.currentpage = this.totalpage; 
                fireEvent(this.pageRef, 'changeCurrentPageEvent', {
                  detail: {
                    currentpage: this.currentpage,
                    pagesize: this.pagesize
                  }
                });    
              }  
}