import { LightningElement, wire, track }            from 'lwc';
import getChosenContactApexContoller                from '@salesforce/apex/registrationFormClass.getChosenContactApexContoller';
import searchInputContactApexController             from '@salesforce/apex/registrationFormClass.searchInputContactApexController';
import handleNickNameInputApexContoller             from '@salesforce/apex/registrationFormClass.handleNickNameInputApexContoller';

import { ShowToastEvent }                           from 'lightning/platformShowToastEvent';
import {createRecord}                               from 'lightning/uiRecordApi';
import REGISTRATION__C_OBJECT                       from '@salesforce/schema/Registration__c';
import REGISTRATION__C_ARRIVALDATE__C               from '@salesforce/schema/Registration__c.ArrivalDate__c';
import REGISTRATION__C_CONTACT__C                   from '@salesforce/schema/Registration__c.Contact__c';
import REGISTRATION__C_NUMBEROFMATCHESPAIDFOR_C     from '@salesforce/schema/Registration__c.NumberOfMatchesPaidFor__c';
import REGISTRATION__C_NAME                         from '@salesforce/schema/Registration__c.Name';

import { registerListener }                         from 'c/pubsub';
import { CurrentPageReference }                     from 'lightning/navigation';
import { fireEvent }                                from 'c/pubsub';



export default class RefistrationForm extends LightningElement {
    @track offer;
    @track popUpsController = {
        openNewRegistration:                     false,
        openListOfContacts:                      false,
        openErrorMessWrongContactName:           false,
        openErrorMessWrongNickName:              false,
        openErrorMessContactNotFound:            false,
        openErrorMessNickNameInputValidator:     false,
    }



    openModals(event) {
        this.popUpsController[event.target.dataset.name] = true;
    }



    closeModals(event){
        this.popUpsController[event.target.dataset.name] = false;
    }



    @wire(CurrentPageReference) pageRef;

    connectedCallback() {
        registerListener("openRegistrationForm", this.handleOpenRegistrationForm, this);
      }
    
      

    handleOpenRegistrationForm (event) {
        this.popUpsController.openNewRegistration = event.detail.openNewRegistration;
    }



    @track inputedTextForContactSearch = '';

    outputContactInfoList (event) {
        this.popUpsController.openListOfContacts = true;
        let inputedTextForContactSearch = event.target.value;
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.delayTimeout = setTimeout(() => {
        this.inputedTextForContactSearch = inputedTextForContactSearch;
        });
    }
    
    @wire (searchInputContactApexController, {inputedTextForContactSearch: '$inputedTextForContactSearch'})searchContactResult;



    contactValidator () {
        if(this.searchContactResult.data.length > 0) {
            this.popUpsController.openErrorMessContactNotFound = false;
            this.offer = false;
        } else {
            this.popUpsController.openErrorMessContactNotFound = true;
            this.offer = true;
        }
    }



    openNewRegistrationForm () {
        this.popUpsController.openNewRegistration = true;
    }



    @track contactId;
    getChosenContact (event) {
        getChosenContactApexContoller ({searchKeyForChosenContact: event.target.innerText})
           .then (result => {
               if (result.length > 0) {
                    
                    this.catchedContact = result[0].Name;
                    this.contactId = result[0].Id;
                    this.popUpsController.openListOfContacts = false;
                    this.popUpsController.openErrorMessContactNotFound = false;
                    this.offer = false;
                    
               } else {
                       this.catchedContact = '';
                       this.popUpsController.openErrorMessContactNotFound = true;
                       this.offer = true;
               }

                    let validator = result[0].Registrations__r;
                        if (validator === 0 || validator === undefined) {
                            this.offer = false;
                            this.popUpsController.openErrorMessWrongContactName = false;

                        } else {
                            this.popUpsController.openErrorMessWrongContactName = true;
                            this.offer = true;
                        }

           }) 
           .catch(error => {
               this.error = error;
               
           });
    }



    @track dateInputGetter;

    handleDateInput (event) {
        this.dateInputGetter = event.target.value;
    }


    
    @track inputedNickData;
    handleNickNameInput (event) {
        var pattern = /^[a-zA-Z][a-zA-Z0-9-_ \.]{1,30}$/;
        this.inputedNickData = event.target.value;
        let check = pattern.test(this.inputedNickData);

            if (check === true) {
                this.offer = false;
                this.popUpsController.openErrorMessNickNameInputValidator = false;

                handleNickNameInputApexContoller ({nicknameInputGetter: event.target.value})
                    .then (result => {
                        if (result.length > 0) {
                            //this.registrationID = result[0].Id;
                            this.popUpsController.openErrorMessWrongNickName = true;
                            this.offer = true;
                        } else {
                            this.popUpsController.openErrorMessWrongNickName = false;
                            this.offer = false;
                        }
                    }) 
                    .catch(error => {
                        this.popUpsController.openErrorMessWrongNickName = true;
                    });

            } else {
                this.offer = true;
                this.popUpsController.openErrorMessNickNameInputValidator = true;
            }        
    }



    @track validator;
    matchCountValidator (event) {
        this.validator = event.target.value;
        if (this.validator < 15 && this.validator > 0) {
            this.offer = false;
        } else {
            this.offer = true;        }
    }


    
    matchCountInvalid () {
        this.offer = true;
    }
 

    
    registrationId;
    createRegistration(){
        const FIELDS = {};
            FIELDS[REGISTRATION__C_NAME.fieldApiName] = this.inputedNickData;
            FIELDS[REGISTRATION__C_CONTACT__C.fieldApiName] = this.contactId;
            FIELDS[REGISTRATION__C_ARRIVALDATE__C.fieldApiName] = this.dateInputGetter;
            FIELDS[REGISTRATION__C_NUMBEROFMATCHESPAIDFOR_C.fieldApiName] = this.validator;
           
        const registrationRecord = {apiName:REGISTRATION__C_OBJECT.objectApiName, fields: FIELDS};

            createRecord(registrationRecord)
                .then(registration__c => {
                    this.popUpsController.openNewRegistration = false;
                    this.registrationId = registration__c.id;

                    fireEvent(this.pageRef, "createRegistration", {
                        detail: {
                            registrationId : this.registrationId,
                            inputedNickData: this.inputedNickData,
                        } 
                    });   



                    // this.dispatchEvent(
                    //     new ShowToastEvent({
                    //         title: 'Success',
                    //         message: 'Registration: '+ this.registrationId +' has been created.',
                    //         variant: 'success',
                    //     }),
                    // );
                })
                .catch(error => {
                
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Error creating record',
                            message: error.body.message,//error.body.output.fieldErrors,
                            variant: 'error',
                        }),
                    );
                });
    }



}