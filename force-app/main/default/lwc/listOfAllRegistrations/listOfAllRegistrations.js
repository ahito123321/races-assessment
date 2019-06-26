import { LightningElement, track, wire}      from 'lwc';

import { CurrentPageReference }              from 'lightning/navigation';
import { fireEvent }                         from 'c/pubsub';



export default class ListOfAllRegistrations extends LightningElement {
    
    @wire(CurrentPageReference) pageRef;
  
    @track openNewRegistration;



    openRegistrationForm() {
        this.openNewRegistration = true;
            fireEvent(this.pageRef, "openRegistrationForm", {
                detail: {
                    openNewRegistration : this.openNewRegistration
                }
            });
    }


    
    searchRegistration(event) {
        let keyElement = event.target.value;
            fireEvent(this.pageRef, "searchRegistration", {
                detail: {
                    keyElement : keyElement
                }    
            });
    }



}



        