import { LightningElement, api, wire } from 'lwc';
import { registerListener } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';

export default class Pagination extends LightningElement {

   @api totalrecords;  
   @api currentpage;  
   @api pagesize;
   @api isBlocked = false; 

   matchesIds = [];
   lastpage = false;  
   firstpage = false;  

          @wire(CurrentPageReference) pageRef;

            // getter for first buttons 
            get showFirstButton() {
              return this.currentpage === 1 || this.isBlocked;
            }  

           // getter for last buttons
            get showLastButton() {  
              return Math.ceil(this.totalrecords / this.pagesize) === this.currentpage || this.isBlocked;
            }

            // register event from match.js
            connectedCallback() {  
              registerListener('blockPaginationEvent', this.handleChooseMatch, this);
            }

            // choose match by checkbox and block pagination if none in race picklist
            handleChooseMatch(event) {
              let existMatch = this.matchesIds.some(id => event.detail.match.Id === id);
              console.log({... event.detail, id: event.detail.match.Id});
              console.log(`exist ${existMatch}`);   
              if (event.detail.checked && event.detail.picklistValue === '--None--') {
                if (!existMatch) this.matchesIds.push(event.detail.match.Id);
              } else {
                if (existMatch) {
                  let index = this.matchesIds.indexOf(event.detail.match.Id);
                  this.matchesIds.splice(index, 1);
                } 
              }
                this.isBlocked = this.matchesIds.length > 0;
                console.log(this.matchesIds.length);
              }
      
   
              // fire events based on the button actions  
              handlePrevious() {  
                this.dispatchEvent(new CustomEvent('previous'));  
              }  
              handleNext() {  
                this.dispatchEvent(new CustomEvent('next'));  
              }  
              handleFirst() {  
                this.dispatchEvent(new CustomEvent('first'));  
              }  
              handleLast() {  
                this.dispatchEvent(new CustomEvent('last'));  
              }  
}