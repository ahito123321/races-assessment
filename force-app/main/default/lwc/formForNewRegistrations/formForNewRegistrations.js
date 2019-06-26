import { LightningElement, wire, track }            from 'lwc';
import getChosenContactApexContoller                from '@salesforce/apex/registrationFormClass.getChosenContactApexContoller';
import searchInputContactApexController             from '@salesforce/apex/registrationFormClass.searchInputContactApexController';
import handleNickNameInputApexContoller             from '@salesforce/apex/registrationFormClass.handleNickNameInputApexContoller';

import { ShowToastEvent }                           from 'lightning/platformShowToastEvent';
import {createRecord}                               from 'lightning/uiRecordApi';
import REGISTRATION__C_OBJECT                       from '@salesforce/schema/Registration__c';
import REGISTRATION__C_ARRIVALDATE__C               from '@salesforce/schema/Registration__c.Arrival_Date__c';
import REGISTRATION__C_CONTACT__C                   from '@salesforce/schema/Registration__c.Contact__c';
import REGISTRATION__C_NUMBEROFMATCHESPAIDFOR_C     from '@salesforce/schema/Registration__c.Number_of_Matches_Paid_For__c';
import REGISTRATION__C_NAME                         from '@salesforce/schema/Registration__c.Name';

import { registerListener }                         from 'c/pubsub';
import { CurrentPageReference }                     from 'lightning/navigation';
import { fireEvent }                                from 'c/pubsub';






export default class RefistrationForm extends LightningElement {
    @track blockSaveButton;

    @track popUpsController = {
        openNewRegistration:                     false,
        openListOfContacts:                      false,
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
        this.blockSaveButton = true; 
    }



    @track contactSought = '';

    outputContactInfoList (event) {
        this.popUpsController.openListOfContacts = true;
        let contactSought = event.target.value;
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.delayTimeout = setTimeout(() => {
        this.contactSought = contactSought;
        });
    }
    
    @wire (searchInputContactApexController, {contactSought: '$contactSought'})searchContactResult;


       
    contactValidator () {

        if(this.searchContactResult.data.length > 0) {
            this.blockSaveButton = false;
            this.errorShape = false;
            fireEvent(this.pageRef, "contactValidator", {
                detail: {
                    openErrorMessContactNotFoundShape : this.errorShape,
                }
            });

        } else {
            this.blockSaveButton = true;
            this.errorShape = true;
            fireEvent(this.pageRef, "contactValidator", {
                detail: {
                    openErrorMessContactNotFoundShape : this.errorShape,
                }
            });
        }
    }



    openNewRegistrationForm () {
        this.popUpsController.openNewRegistration = true;
    }



    @track contactId;
    getChosenContact (event) {
        getChosenContactApexContoller ({chosenContact: event.target.innerText})
           .then (result => {

               if (result.length > 0) {
                    this.catchedContact = result[0].Name;
                    this.contactId = result[0].Id;
                    this.popUpsController.openListOfContacts = false;
                    this.blockSaveButton = false;

                    this.errorShape = false;
                    fireEvent(this.pageRef, "contactValidator", {
                        detail: {
                            openErrorMessContactNotFoundShape : this.errorShape,
                        }
                    });
                    
               } else {
                       this.catchedContact = '';
                       this.blockSaveButton = true;

                       this.errorShape = true;
                       fireEvent(this.pageRef, "contactValidator", {
                           detail: {
                               openErrorMessContactNotFoundShape : this.errorShape,
                           }
                       });
                    }

                this.checkExistsContact(result);

           })
           .catch(error => {
               this.error = error;
               
           });
    }



    checkExistsContact (result) {
        let validator = result[0].Registration__r;
    
            if (validator === 0 || validator === undefined) {
                this.blockSaveButton = false;
                this.errorShape = false;
                fireEvent(this.pageRef, "getChosenContact", {
                    detail: {
                        openErrorMessWrongContactNameShape : this.errorShape,
                    }
                });
    
            } else {
                this.blockSaveButton = true;
                this.errorShape = true;
                    fireEvent(this.pageRef, "getChosenContact", {
                        detail: {
                            openErrorMessWrongContactNameShape : this.errorShape,
                        }
                    });
            }
        }


    
    @track dateInputGetter;

    handleDateInput (event) {
        var dataPattern = /^[0-9][0-9-_ \.]{1,30}$/;
        this.dateInputGetter = event.target.value;
        let check = dataPattern.test(this.dateInputGetter);
        if (check === true){
            this.blockSaveButton = false;
            this.dataValidator = false;
                fireEvent(this.pageRef, "handleDateInput", {
                    detail: {
                        sayEmptyData : this.dataValidator,
                    }
                });
        } else {
            this.blockSaveButton = true;
            this.dataValidator = true;
                fireEvent(this.pageRef, "handleDateInput", {
                    detail: {
                        sayEmptyData : this.dataValidator,
                    }
                });
        }
    }


    
    @track inputedNickData;
    handleNickNameInput (event) {
        var pattern = /^[a-zA-Z][a-zA-Z0-9-_ \.]{1,30}$/;
        this.inputedNickData = event.target.value;
        let check = pattern.test(this.inputedNickData);

            if (check === true) {
                this.blockSaveButton = false;
                this.errorShape = false;
                    fireEvent(this.pageRef, "handleNickNameInput", {
                        detail: {
                            openErrorMessNickNameInputValidatorShape : this.errorShape,
                        }
                });
                this.checkDublicateNickName(event);
            } else {
                this.blockSaveButton = true;
                this.errorShape = true;
                fireEvent(this.pageRef, "handleNickNameInput", {
                    detail: {
                        openErrorMessNickNameInputValidatorShape : this.errorShape,
                    }
                });
            }        
    }



    checkDublicateNickName (event) {
        handleNickNameInputApexContoller ({nicknameSought: event.target.value})
        .then (result => {

            if (result.length > 0) {
                this.registrationID = result[0].Id;
                this.blockSaveButton = true;

                this.errorFormer = true;
                    fireEvent(this.pageRef, "handleNickNameInputExistReg", {
                        detail: {
                            openErrorMessWrongNickNameShape : this.errorFormer,
                        }
                    });

            } else {
                this.blockSaveButton = false;
                this.errorFormer = false;
                    fireEvent(this.pageRef, "handleNickNameInputExistReg", {
                        detail: {
                            openErrorMessWrongNickNameShape : this.errorFormer,
                        }
                    });
            }
        }) 
        .catch(error => {
            this.errorFormer = false;
                fireEvent(this.pageRef, "handleNickNameInputExistReg", {
                    detail: {
                        openErrorMessWrongNickNameShape : this.errorFormer,
                    }
                });
        });
    }



    @track validator;
    matchCountValidator (event) {
        this.validator = event.target.value;

        if (this.validator < 15 && this.validator > 0) {
            this.blockSaveButton = false;

        } else {
            this.blockSaveButton = true;        }
    }


    
    matchCountInvalid () {
        this.blockSaveButton = true;
    }
 

    
    registrationId;
    createRegistration(){
        let validationPtoblem = this.checkBeforeSave (this.inputedNickData, this.contactId, this.dateInputGetter, this.validator);

            if (validationPtoblem === true) {
                this.errorShape = true;
                fireEvent(this.pageRef, "golobalFormValidation", {
                    detail: {
                        sayGlobalFormMistake : this.errorShape,
                    }
                });

            } else {
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
                            this.dispatchEvent(
                                new ShowToastEvent({
                                    title: 'Success',
                                    message: 'Registration: '+ this.inputedNickData +' has been created.',
                                    variant: 'success',
                                }),
                            );
                            this.popUpsController.openNewRegistration = false;
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
    


    checkBeforeSave () {
        let validationPtoblem;

        if (this.inputedNickData === undefined || this.contactId === undefined || this.validator === undefined || this.dateInputGetter === undefined) {
            validationPtoblem = true;
            return validationPtoblem;

        } else if (this.inputedNickData === null || this.contactId === null || this.validator === null || this.dateInputGetter === null) {
            validationPtoblem = true;
            return validationPtoblem;

        } else if (this.inputedNickData === '' || this.contactId === '' || this.validator === '' || this.dateInputGetter === ''){
            validationPtoblem = true;
            return validationPtoblem;
        } 
            validationPtoblem = false;
            return validationPtoblem;
    }


}