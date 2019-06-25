import { LightningElement, track, wire}         from 'lwc';
import getContactsFive                          from '@salesforce/apex/GetContact.getContactsFive';
import grabSelectedContactFromApexController    from '@salesforce/apex/GetContact.grabSelectedContactFromApexController';
import grabSelectedNickNameFromApexController   from '@salesforce/apex/GetContact.grabSelectedNickNameFromApexController';
import grabLinksNickName                        from '@salesforce/apex/GetContact.grabLinksNickName';

import {updateRecord}                           from 'lightning/uiRecordApi';
import { ShowToastEvent }                       from 'lightning/platformShowToastEvent';
import REGISTRATION__C_ID                       from '@salesforce/schema/Registration__c.Id';
import REGISTRATION__C_ARRIVALDATE__C           from '@salesforce/schema/Registration__c.Arrival_Date__c';
import REGISTRATION__C_CONTACT__C               from '@salesforce/schema/Registration__c.Contact__c';
import REGISTRATION__C_NUMBEROFMATCHESPAIDFOR_C from '@salesforce/schema/Registration__c.Number_of_Matches_Paid_For__c';
import REGISTRATION__C_NAME                     from '@salesforce/schema/Registration__c.Name';

import { CurrentPageReference }              from 'lightning/navigation';
import { fireEvent }                         from 'c/pubsub';

export default class Registration extends LightningElement {
    @wire(CurrentPageReference) pageRef;

    registrationIDShower;
    updateRegistration(){
 
        const fields = {};
        fields[REGISTRATION__C_ID.fieldApiName] = this.registrationID;
        fields[REGISTRATION__C_NAME.fieldApiName] = this.inputedNickData;
        fields[REGISTRATION__C_CONTACT__C.fieldApiName] = this.contactId;
        fields[REGISTRATION__C_ARRIVALDATE__C.fieldApiName] = this.dateGetter;
        fields[REGISTRATION__C_NUMBEROFMATCHESPAIDFOR_C.fieldApiName] = this.validator;
 
        const registrationRecordInput = { fields };
 
        updateRecord(registrationRecordInput)
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Registration: '+this.inputedNickData +' has been updated.',
                        variant: 'success',
                    }),
                );
                window.location.href = `/lightning/n/Registrations_list`; 
            })
            .catch(error => {
                console.log('bad'); 
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error updating record',
                        message: error.body.message,
                        variant: 'error',
                    }),
                );
            });
    }



    connectedCallback() {
        this.registrationPrefillder ();
    }


    
    @track offer;
    @track prefilledNickName;
    @track prefilledContact;
    @track prefilledArrivalDate;
    @track prefilledNumberOfMatchesPaidFor;
    @track prefilledNumberOfMatchesRemaining;
    @track prefilledNumberOfMatchesScheduled;
    @track registrationID;



    registrationPrefillder() {
        let idCatcher = window.localStorage.getItem('catchParam');        
        // eslint-disable-next-line dot-notation
        let chosenArrayExample = JSON.parse(idCatcher)['location'];
      

        grabLinksNickName ({grabEdLinksNickName: chosenArrayExample})
            .then (result => {
                if (result.length > 0) {
                    this.registrationID = result[0].Id;
                    this.prefilledNickName = result[0].Name;
                    this.prefilledContact = result[0].Contact__r.Name;
                    this.prefilledArrivalDate = result[0].Arrival_Date__c;
                    this.prefilledNumberOfMatchesPaidFor = result[0].Number_of_Matches_Paid_For__c;
                    this.prefilledNumberOfMatchesRemaining = result[0].Number_of_Matches_Remaining__c;
                    this.prefilledNumberOfMatchesScheduled = result[0].Number_of_Matches_Scheduled__c;


                    fireEvent(this.pageRef, "registrationPrefillder", {
                        detail: {
                            registrationID : this.registrationID,
                            registrationAD : this.prefilledArrivalDate
                        }
                        
                    });

                } else {
                        this.prefilledNickName = ' ';
                        this.prefilledContact = ' ';
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
        listOfNickNamesPOP:                      false,
        PopUpContactSelector:                    false,
        wrongContact:                            false,
        openErrorMessWrongContactName:           false,
        openErrorMessWrongNickName:              false,
        openErrorMessNoContactsFound:            false,
        openErrorMessNickNameInputValidator:     false,
        openErrorMessWindow:                     false,
        
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
    @track contactId;
     contactValidator(event) {
        grabSelectedContactFromApexController ({SelectedContact: event.target.innerText})
        .then (result => {
            if (result.length > 0) {
                this.prefilledContact = result[0].Name
                this.contactId = result[0].Id
                let validator = result[0].Registration__r;
                this.popUpsController.PopUpContactSelector = false;
                        if (validator === 0 || validator === undefined) {
                            this.popUpsController.openErrorMessWindow = false;
                            this.popUpsController.openErrorMessWrongContactName = false;
                            this.offer = false;

                        } else {
                            this.popUpsController.openErrorMessWindow = true;
                            this.popUpsController.openErrorMessWrongContactName = true;
                            this.offer = true;
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
     @track inputedNickData;
     nickNameValidator (event) {
        var pattern = /^[a-zA-Z][a-zA-Z0-9-_ \.]{1,30}$/;
        this.inputedNickData = event.target.value;
        let check = pattern.test(this.inputedNickData);

            if(check === true) {
               this.popUpsController.openErrorMessWindow = false;
               this.popUpsController.openErrorMessNickNameInputValidator = false;
               this.offer = false;

                grabSelectedNickNameFromApexController ({selectedNickName: event.target.value})
                    .then (result => {
                        if (result.length > 0) {
                        this.popUpsController.openErrorMessWindow = true;
                        this.popUpsController.openErrorMessWrongNickName = true;
                        this.offer = true;
                        } else {
                            this.popUpsController.openErrorMessWindow = false;
                            this.popUpsController.openErrorMessWrongNickName = false;
                            this.offer = false;
                        }

                    }) 
                .catch(error => {
                    this.error = error;
                    this.popUpsController.openErrorMessWindow = false;
                    this.popUpsController.openErrorMessWrongNickName = false;
                });
            } else {
                this.popUpsController.openErrorMessWindow = true;
                this.popUpsController.openErrorMessNickNameInputValidator = true;
                this.offer = true;
            }
    }  
       

    @track validator;

    matchCountValidator (event) {
        this.validator = event.target.value;
        if (this.validator < 15 && this.validator > 0) {
            this.offer = false;
        } else {
            this.offer = true;        
        }
    }
    


    matchCountInvalid () {
        this.offer = true;
    }



    backToMainPage () {
        window.location.href = `/lightning/n/Registrations_list`; 
    }

    
    @track dateGetter
    arrivalDateHandler (event) {
        this.dateGetter = event.target.value;
    }


}