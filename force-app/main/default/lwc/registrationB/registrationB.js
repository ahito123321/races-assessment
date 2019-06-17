import { LightningElement, track, wire}         from 'lwc';
import getContactsFive                          from '@salesforce/apex/GetContact.getContactsFive';
import grabSelectedContactFromApexController    from '@salesforce/apex/GetContact.grabSelectedContactFromApexController';
import grabSelectedNickNameFromApexController   from '@salesforce/apex/GetContact.grabSelectedNickNameFromApexController';


// import getSelectedNickNameFromApex           from '@salesforce/apex/GetContact.getSelectedNickNameFromApex';
// import grabSelectedNickName                  from '@salesforce/apex/GetContact.grabSelectedNickName';
// import grabLinksNickName                     from '@salesforce/apex/GetContact.grabLinksNickName';




export default class Registration extends LightningElement {
    constructor() {
        super();
        this.registrationPrefillder ();
    }
    
    @track prefilledNickName;
    @track prefilledContact;
    @track prefilledArrivalDate;
    @track prefilledNumberOfMatchesPaidFor;
    @track prefilledNumberOfMatchesRemaining;
    @track prefilledNumberOfMatchesScheduled;

    registrationPrefillder() {
        console.log('Ver 1.2');
        let arr = window.location.href.split('/');
        let chosenArrayExample = arr[6].toString();

        grabLinksNickName ({grabEdLinksNickName: chosenArrayExample})
            .then (result => {
                if (result.length > 0) {
                    this.prefilledNickName = result[0].Name;
                    this.prefilledContact = result[0].Contact__r.Name;
                    this.prefilledArrivalDate = result[0].ArrivalDate__c;
                    this.prefilledNumberOfMatchesPaidFor = result[0].NumberOfMatchesPaidFor__c;
                    this.prefilledNumberOfMatchesRemaining = result[0].NumberOfMatchesRemaining__c;
                    this.prefilledNumberOfMatchesScheduled = result[0].NumberOfMatchesScheduled__c;
                } else {
                        this.prefilledNickName = ' ';
                        this.prefilledContact = '';
                        this.prefilledArrivalDate = '';
                        this.prefilledNumberOfMatchesPaidFor = '';
                        this.prefilledNumberOfMatchesRemaining = '';
                        this.prefilledNumberOfMatchesScheduled = '';
                }

            }) 
            .catch(error => {
                this.error = error;
            });
    }
 


    @track popUpsController = {
        listOfNickNamesPOP:             false,
        PopUpContactSelector:           false,
        wrongContact:                   false,
        openErrorMessWrongContactName:  false,
        openErrorMessWrongNickName:     false,
        
    }
     
     openModals(event) {
        this.popUpsController[event.target.dataset.name] = true;
    }

    closeModals(event){
        this.popUpsController[event.target.dataset.name] = false;
    }




    inputCleaner(event) {
        event.target.value = '';

    }

    @track searchKeyForFiveCont = '';


    contactFinder (event) {
        const searchKeyForFiveCont = event.target.value;
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.delayTimeout = setTimeout(() => {
            this.searchKeyForFiveCont = searchKeyForFiveCont;
            this.popUpsController.PopUpContactSelector = true;
        });
    }

     @wire (getContactsFive, {searchKeyForFiveCont: '$searchKeyForFiveCont'}) grabContacts;



    @track selectedContact;

     contactValidator(event) {
        grabSelectedContactFromApexController ({SelectedContact: event.target.innerText})
        .then (result => {
            if (result.length > 0) {
                this.prefilledContact = result[0].Name
                let validator = result[0].Registrations__r;
                this.popUpsController.PopUpContactSelector = false;
                        if (validator === 0 || validator === undefined) {
                            this.popUpsController.openErrorMessWrongContactName = false;

                        } else {
                            this.popUpsController.openErrorMessWrongContactName = true;
                        }
                 
            } else {
                this.catchedContact = '';
                this.popUpsController.PopUpContactSelector = false;
            }

        }) 
        .catch(error => {
            this.error = error;
            this.popUpsController.PopUpContactSelector = false;
        });
     }



     @track selectedNickName;

     nickNameValidator (event) {
        grabSelectedNickNameFromApexController ({selectedNickName: event.target.value})
        .then (result => {
            if (result.length > 0) {
               this.popUpsController.openErrorMessWrongNickName = true;
            } else {
                this.popUpsController.openErrorMessWrongNickName = false;
            }

        }) 
        .catch(error => {
            this.error = error;
            this.popUpsController.openErrorMessWrongNickName = false;
        });
     }
       

//========================================================================usable END=========================================================

     nickNamePutter (event) {
         grabSelectedNickName ({chosenNickName: event.target.innerText})
            .then (result => {
                if (result.length > 0) {
                    this.selectedContactForInput = result[0].Name;
                    this.secondselectedContactForInput = result[0].Contact__r.Name;
                    this.arivalDate = result[0].ArrivalDate__c;
                    this.NumberOfMatchesPaidFor = result[0].NumberOfMatchesPaidFor__c;
                    this.NumberOfMatchesRemaining = result[0].NumberOfMatchesRemaining__c;
                    this.NumberOfMatchesScheduled = result[0].NumberOfMatchesScheduled__c;
                    this.popUpsController.listOfNickNamesPOP = false;
                } else {
                        this.selectedContactForInput = ' ';
                        this.secondselectedContactForInput = '';
                        this.arivalDate = '';
                        this.NumberOfMatchesPaidFor = '';
                        this.NumberOfMatchesRemaining = '';
                        this.NumberOfMatchesScheduled = '';
                        this.popUpsController.listOfNickNamesPOP = false;
                }

            }) 
            .catch(error => {
                this.error = error;
            });
     }
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    @track bleedNickName;
    @track chosenContact;
    @track bleedData;

    nickNameHandler (event) {
        this.bleedNickName = event.target.value;
        console.log(JSON.parse(JSON.stringify('NickName____________'   +  this.bleedNickName)));
        //return bleedNickName;

    }

    dateHandler (event) {
        this.bleedData = event.target.value;
        console.log(JSON.parse(JSON.stringify('Date____________'   +  this.bleedData)));
        //return bleedData;
    }


    
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
@track selectedInInputNickName = '';

nickNameFinder (event) {
    let searchKeyForNickName = event.target.value;
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    this.delayTimeout = setTimeout(() => {
        this.searchKeyForNickName = searchKeyForNickName;
    });
    this.popUpsController.listOfNickNamesPOP = true;
}

@wire (getSelectedNickNameFromApex, {searchKeyForNickName: '$searchKeyForNickName'})grabNickNames;
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    
    saveTheNewRegistration(event) {
                //console.log(JSON.parse(JSON.stringify('NickName____________'   +  this.bleedNickName))); //NickName value
                
                console.log(JSON.parse(JSON.stringify('NickName____________'   +  this.test.name)));
                console.log(JSON.parse(JSON.stringify('Conact____________'     + this.chosenContact))); //Contact value
                console.log(JSON.parse(JSON.stringify('Date____________' + this.test.date))); //date value
                //console.log(JSON.parse(JSON.stringify('Date____________' + this.bleedData))); //date value
                console.log(JSON.parse(JSON.stringify('Matches____________' + +this.paidMatchValidator))); //number of matches value

    }

  




}

    //        console.log(JSON.parse(JSON.stringify(this.pickedContactIptutValue)));
    //@track data = [];
    //@track columns = columns;
    //@track tableLoadingState = true;

    //@track nick;
    //@wire (getSelectedNickNameFromApexNumberTwo)nick;
    

    //TEST666 (){
    //    console.log(JSON.parse(JSON.stringify('NickName____________'   +  this.nick[0].Contact__c)));
    //}
    // async connectedCallback() {
    //     const data = await fetchDataHelper({ amountOfRecords: 100 });
    //     this.data = data;
    //     this.tableLoadingState = false;
    // }


    //contactSearchPop:               false,
        //nickNameduplication:            false,
        //paidMistakeToMuchMatchesPOP:    false,
        //paidMistakeNotEnoughMatchesPOP: false,
        //bShowModal:                     false,
        //registrationFormPOP:            false


         //  cotactPuterB(event){
    //     grabSelectedContact({ pickedContact: event.target.innerText })
    //         .then(result => {
    //             // console.log(JSON.parse(JSON.stringify(result[0].Name)));
    //             this.chosenContact = result[0].Name;
    //             this.popUpsController.contactSearchPop = false;
    //         })
    //         .catch(error => {
    //             this.error = error;
    //         });
    //  }


     // nickNameValidation(event){
    //     apexNickNameValidation ({ selectedNickName: event.target.value })
        
    //         .then(result => {
    //             //console.log(JSON.parse(JSON.stringify(result)));
    //             if (result.length > 0) {
    //                 this.popUpsController.nickNameduplication = true;
    //             } else {
    //                 //console.log(JSON.parse(JSON.stringify(result)));
    //             }
    //         })
    //         .catch(error => {
    //             this.error = error;
    //         });
   
    // }


    // @track paidMatchValidator; 

    // numberOfMatchesPaidValidator(event) {
    //     this.paidMatchValidator = +event.target.value;
    //     //let hollowValue = '';
        
    //     console.log(JSON.parse(JSON.stringify(this.paidMatchValidator)));
    //     //if (paidMatchValidator === 0 || isNaN(paidMatchValidator)) return;

    //     if(this.paidMatchValidator > 14) {
    //         this.popUpsController.paidMistakeToMuchMatchesPOP = true;
    //     } else  if (this.paidMatchValidator < 1) {
    //         this.popUpsController.paidMistakeNotEnoughMatchesPOP = true;
    //     } else {
    //         console.log(JSON.parse(JSON.stringify('Else')));
    //     }
            
    // }


    
    // 

    
    // @track test  = {
    //     name: '11',
    //     //contact: '',
    //     date: '',
    //     match: ''
    // };

    // handleInputs(event) {
    //     this.test[event.target.dataset.fieldsName] = event.target.value;
    // }

    //import getSelectedNickNameFromApexNumberTwo  from '@salesforce/apex/GetContact.getSelectedNickNameFromApexNumberTwo';

    //import grabSelectedContact                   from '@salesforce/apex/GetContact.grabSelectedContact';
//import apexNickNameValidation                from '@salesforce/apex/GetContact.apexNickNameValidation';


//const columns = [
    //     { label: 'Name', fieldName: 'Name' },
    //     //{ label: 'Contact', fieldName: 'Contact__c', type: ''},
    //     { label: 'Arrival Date', fieldName: 'ArrivalDate__c', type:'date'},
    //     { label: 'Number of Mathes Paid For', fieldName: 'NumberOfMatchesPaidFor__c', type: 'number'},
    //     { label: 'Number Of Matches Scheduled', fieldName: 'NumberOfMatchesScheduled__c', type: 'number' },
    //     { label: 'Number of Matches Remaining', fieldName: 'NumberOfMatchesRemaining__c', type: 'number' },
    //     ];

        //@track error;
        

    //  cotactPuter (event) {
    //     getSelectedContact({ selectedContact: event.target.innerText })
    //         .then(result => {

    //              if(result.length > 0) {
    //             this.selectedContactForInput = result[0].Name;
    //             this.secondselectedContactForInput = result[0].Contact__r.Name;
    //             this.arivalDate = result[0].ArrivalDate__c;
    //             this.NumberOfMatchesPaidFor = result[0].NumberOfMatchesPaidFor__c;
    //             this.NumberOfMatchesRemaining = result[0].NumberOfMatchesRemaining__c;
    //             this.NumberOfMatchesScheduled = result[0].NumberOfMatchesScheduled__c;
    //             this.popUpsController.PopUpContactSelector = false;
    //             } else {
    //                 this.selectedContactForInput = ' ';
    //                 this.secondselectedContactForInput = '';
    //                 this.arivalDate = '';
    //                 this.NumberOfMatchesPaidFor = '';
    //                 this.NumberOfMatchesRemaining = '';
    //                 this.NumberOfMatchesScheduled = '';
    //                 this.popUpsController.PopUpContactSelector = false;
    //                 this.popUpsController.wrongContact = true;
    //             }
                
    //         })
    //         .catch(error => {
    //             this.error = error;
    //         });

    //  }

    // import getSelectedContact                    from '@salesforce/apex/GetContact.getSelectedContact';