import { LightningElement, track, wire}      from 'lwc';

import { CurrentPageReference }              from 'lightning/navigation';
import { fireEvent }                         from 'c/pubsub';




export default class ListOfAllRegistrations extends LightningElement {
    
  @wire(CurrentPageReference) pageRef;
  
    @track openNewRegistration;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    openRegistrationForm() {
        this.openNewRegistration = true;
        

        fireEvent(this.pageRef, "openRegistrationForm", {
            detail: {
                openNewRegistration : this.openNewRegistration
            }
            
        });
        
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// import grabSelectedRegistration              from '@salesforce/apex/listRegistrationController.grabSelectedRegistration';
// import {deleteRecord}                        from 'lightning/uiRecordApi';
// import { ShowToastEvent }                    from 'lightning/platformShowToastEvent';


    // @track nick;
    // @track columns = columns;
    // @track rowOffset = 0;
    // @track data = [];
    // @track record = {};
   

    // @track searchKeyForNickName = '';
    // searchRegistration (event) {
        
    //     let searchKeyForNickName = event.target.value;
    //      // eslint-disable-next-line @lwc/lwc/no-async-operation
    //      this.delayTimeout = setTimeout(() => {
    //         this.searchKeyForNickName = searchKeyForNickName;
    //     });   
    // }



   
    // @wire (grabSelectedRegistration, {searchKeyForNickName: '$searchKeyForNickName'}) 
    // wiredRegistrations({ error, data }) {
    //     if (data) {
    //         this.nick = data.map(registration => {
    //             return {
    //                 ...registration,
    //                 url: `/lightning/r/Registration__c/${registration.Id}/view`,
    //                 Idfy: `${registration.Id}`,
    //             }
    //         });
    //     } else if (error) {
    //         console.log('Error');
    //         this.nick = [];
    //     }
    // }
    


    // handleRowAction(event) {
    //     const actionName = event.detail.action.name;
    //     const row = event.detail.row;
    //     switch (actionName) {
    //         case 'make_edit':
    //             this.edit(row);
    //             break;
    //         case 'make_delete':
    //             this.delete(row);
    //             break;
    //         default:
    //     }
    // }




    // @track registrationID;
    //     edit(row) {
    //         this.record = row;
    //         window.open(`/lightning/r/Registration__c/${this.record.Id}/view`, '_blank'); 
    //     }

    //     delete(row) {
    //         this.record = row;
    //         this.registrationID = this.record.Idfy;
    //         this.deleteRegistration();
    //     }



    // deleteRegistration(){
       
    //     deleteRecord(this.registrationID)
    //         .then(() => {
    //             //this.registrationIDShower = registration__c.id; 
    //             console.log('nice'); 
    //             this.dispatchEvent(
    //                 new ShowToastEvent({
    //                     title: 'Success',
    //                     message: 'Registration: '+this.registrationID +' has been deleted.',
    //                     variant: 'success',
    //                 }),
    //             );
    //         })
    //         .catch(error => {
    //             console.log('bad'); 
    //             this.dispatchEvent(
    //                 new ShowToastEvent({
    //                     title: 'Error updating record',
    //                     message: error.body.message,
    //                     variant: 'error',
    //                 }),
    //             );
    //         });
    //         console.log('End');
    // }
}



        