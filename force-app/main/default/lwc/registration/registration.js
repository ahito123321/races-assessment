import { LightningElement, track, wire} from 'lwc';
// import getContactList10         from '@salesforce/apex/GetContact.getContactList10';
// import getContactAll            from '@salesforce/apex/GetContact.getContactAll';
// import getContacts              from '@salesforce/apex/GetContact.getContacts';
import getContactsFive          from '@salesforce/apex/GetContact.getContactsFive';
import getSelectedContact       from '@salesforce/apex/GetContact.getSelectedContact';
import grabSelectedContact      from '@salesforce/apex/GetContact.grabSelectedContact';






 

export default class Registration extends LightningElement {

     @track popUpsController = {
        bShowModal:             false,
        showContactModal:       false,
        showContactModalAll:    false,
        searchPOPModal:         false,
        PopUpContactSelector:   false,
        wrongContact:           false,
        contactSearchPop:       false
     }

     openModals(event) {
        this.popUpsController[event.target.dataset.name] = true;
    }

    closeModals(event){
        this.popUpsController[event.target.dataset.name] = false;
    }


     @track error;
    //  @track columns = columns;

    //  @wire (getContactList10) contacts;
    //  @wire (getContactAll) cantactsAll;



    //  @track searchKey = '';

    //  @wire (getContacts, {searchKey:'$searchKey'}) contactsSearcher;

    // handleKeyChange(event) {
       
    //     window.clearTimeout(this.delayTimeout);
    //     const searchKey = event.target.value;
    //     // eslint-disable-next-line @lwc/lwc/no-async-operation
    //     this.delayTimeout = setTimeout(() => {
    //         this.searchKey = searchKey;
    //     });
    // }

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    @track searchKeyForFiveCont = '';


    contactFinder (event) {
        const searchKeyForFiveCont = event.target.value;
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.delayTimeout = setTimeout(() => {
            this.searchKeyForFiveCont = searchKeyForFiveCont;
        });
    }

     @wire (getContactsFive, {searchKeyForFiveCont: '$searchKeyForFiveCont'}) grabContacts;
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

     cotactPuterB(event){
        grabSelectedContact({ pickedContact: event.target.innerText })
            .then(result => {
                // console.log(JSON.parse(JSON.stringify(result[0].Name)));
                this.chosenContact = result[0].Name;
                this.popUpsController.contactSearchPop = false;
            })
            .catch(error => {
                this.error = error;
            });
     }

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // @track selectedContactForInput;   
    // @track secondselectedContactForInput;
   

     cotactPuter (event) {
        getSelectedContact({ selectedContact: event.target.innerText })
            .then(result => {
                // console.log(JSON.parse(JSON.stringify(result.length)));

                 if(result.length > 0){
                this.selectedContactForInput = result[0].Name;
                this.secondselectedContactForInput = result[0].Contact__r.Name;
                this.arivalDate = result[0].ArrivalDate__c;
                this.NumberOfMatchesPaidFor = result[0].NumberOfMatchesPaidFor__c;
                this.NumberOfMatchesRemaining = result[0].NumberOfMatchesRemaining__c;
                this.NumberOfMatchesScheduled = result[0].NumberOfMatchesScheduled__c;
                this.popUpsController.PopUpContactSelector = false;
                }else{
                    this.selectedContactForInput = ' ';
                    this.secondselectedContactForInput = '';
                    this.arivalDate = '';
                    this.NumberOfMatchesPaidFor = '';
                    this.NumberOfMatchesRemaining = '';
                    this.NumberOfMatchesScheduled = '';
                    this.popUpsController.PopUpContactSelector = false;
                    this.popUpsController.wrongContact = true;
                    // console.log(JSON.parse(JSON.stringify("Test")));
                }
                
            })
            .catch(error => {
                this.error = error;
            });

     }
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
     
    }







    // const columns = [
    //     { label: 'Contact Name', fieldName: 'Name', type: 'text', fixedWidth: 200, fixedHeight: 10 } 
    // ];


   

    //  handleKeyChangeB(event){
    //      this.searchPOPModal = true;
    //     window.clearTimeout(this.delayTimeout);
    //     const searchKeyForFiveCont = event.target.value;
    //     // eslint-disable-next-line @lwc/lwc/no-async-operation
    //     this.delayTimeout = setTimeout(() => {
    //         this.searchKeyForFiveCont = searchKeyForFiveCont;
    //     });

    //  }




    // openModal() {    
        
    //     this.popUpsController.bShowModal = true;
    // }
 
    // closeModal() {    
        
    //     this.popUpsController.bShowModal = false;
    // }

    // opentContactPOP() {
    //     this.popUpsController.showContactModal = true;
    // }
   
    // closeContactPOP() {
    //     this.popUpsController.showContactModal = false;
    // }

    // openModalContactsViewAll() {
    //     this.popUpsController.showContactModalAll = true;
    //     this.popUpsController.showContactModal = false;
    // }

    // closeModalContactsViewAll() {
    //     this.popUpsController.showContactModalAll = false;
    //     this.popUpsController.showContactModal = true;
    // }

    // openPopUpContactSelector() {
    //     this.popUpsController.PopUpContactSelector = true;
    // }

    // closePopUpContactSelector() {
    //     this.popUpsController.PopUpContactSelector = false;
    // }


    // openModals() {
    //     //currentValue = {value}
    //     this.popUpsController.bShowModal           = true;
    //     this.popUpsController.showContactModal     = true;
    //     this.popUpsController.showContactModalAll  = true;
    //     this.popUpsController.searchPOPModal       = true;
    //     this.popUpsController.PopUpContactSelector = true;
    // }

   

    // bShowModal: false,
    // showContactModal: false,
    // showContactModalAll: false,
    // searchPOPModal: false,
    // PopUpContactSelector: false



    // closeSearchPOPModal () {
    //     this.searchPOPModal = false;
    // }





 // @track getPickedContact = '';
    
    // @wire (getContactForPutInInput, {getPickedContact:'$getPickedContact'}) pickedContactIptutValue;

    // handleKeyChangeC (event) {
    //     let target = event.target;
    //     console.log(target.tagName);
    //     console.log(JSON.parse(JSON.stringify(event)));
    //     this.getPickedContact = target.dataset.rowKeyValue;

    //     // const togetPickedContact = event.target.dataset.rowKeyValue;
    //     // const togetPickedContact = event.target.value;
    //     // eslint-disable-next-line @lwc/lwc/no-async-operation
    //     // this.delayTimeout = setTimeout(() => {
    //         //     this.getPickedContact = togetPickedContact;
    //     //     console.log(JSON.parse(JSON.stringify(this.pickedContactIptutValue)));
    //     // });
    // }