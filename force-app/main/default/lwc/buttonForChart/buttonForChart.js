import { LightningElement, wire, api } from 'lwc';
import { fireEvent } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';

const DATES = [
     
      { id : 'a022v000010zGiXAAU',
        date : '2019-05-27' }, 
      { id : 'a022v000010zGiXAYY',
        date : '2019-05-29' },
      { id : 'a022v000010zGiXAJJ',
        date : '2019-05-28'},
      { id : 'a022v000010zGiXAZZ',
        date : '2019-05-25'},
      { id : 'a022v000010zGiXABB',
        date : '2019-05-26'},
      { id : 'a022v000010zGiXAMM',
        date : '2019-05-28'} 
];

export default class ButtonForChart extends LightningElement {

    @api dates = DATES;
    
    @wire (CurrentPageReference) pageRef;

    handleOutPutDataEvent() {
        let rndIndex = Math.floor(Math.random() * this.dates.length);
        fireEvent(this.pageRef, 'handleOutPutData', {
            detail: this.dates[rndIndex]
        });
    }


    
  
}