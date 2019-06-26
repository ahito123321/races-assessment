import { LightningElement, track, wire }    from 'lwc';

import { registerListener }                 from 'c/pubsub';
import { CurrentPageReference }             from 'lightning/navigation';



export default class ErrorTemplate extends LightningElement {
    @wire(CurrentPageReference)pageRef;



    @track popUpsController = {
        nickNameDuplicate              :false, 
        doubleRegistration             :false, 
        contactVoid                    :false, 
        uncorrectNickName              :false, 
        openEmptyData                  :false,
        golobalFormValidation          :false,
    }



    connectedCallback() {
        registerListener("getChosenContact",               this.handleDoubleRegistration, this);
        registerListener("handleNickNameInput",            this.handleUncorrectNickName, this);
        registerListener("contactValidator",               this.handleContactVoid, this);
        registerListener("handleNickNameInputExistReg",    this.handleNickNameDuplicate, this);
        registerListener("handleDateInput",                this.handleEmptyData, this);
        registerListener("nickNameValidator",              this.handleUncorrectNickName, this);
        registerListener("nickNameValidatorExistReg",      this.handleNickNameDuplicate, this);
        registerListener("contactValidation",              this.handleDoubleRegistration, this);
        registerListener("emptyContactValidation",         this.handleContactVoid, this);
        registerListener("golobalFormValidation",          this.handleGolobalFormValidation, this);

    }
    
    
    
    handleDoubleRegistration (event) {
        if(event.detail.openErrorMessWrongContactNameShape === true) {
            this.popUpsController.doubleRegistration = event.detail.openErrorMessWrongContactNameShape;   
        } else {
            this.popUpsController.doubleRegistration = false;
        }
    }



    handleUncorrectNickName (event) {
        if (event.detail.openErrorMessNickNameInputValidatorShape === true) {
            this.popUpsController.uncorrectNickName = event.detail.openErrorMessNickNameInputValidatorShape;
                
        } else {
            this.popUpsController.uncorrectNickName = false;
        }
    }


    handleContactVoid (event) {
        if (event.detail.openErrorMessContactNotFoundShape === true) {
            this.popUpsController.contactVoid = event.detail.openErrorMessContactNotFoundShape;
               
        } else {
            this.popUpsController.contactVoid = false;
        }
    }


  
    handleNickNameDuplicate (event) {
        if (event.detail.openErrorMessWrongNickNameShape === true) {
            this.popUpsController.nickNameDuplicate = event.detail.openErrorMessWrongNickNameShape;
               
        } else {
            this.popUpsController.nickNameDuplicate = false;
        }
    }



    handleEmptyData (event) {
        if (event.detail.sayEmptyData === true) {
            this.popUpsController.openEmptyData = event.detail.sayEmptyData;
        } else {
            this.popUpsController.openEmptyData = false;
        }
    }



    handleGolobalFormValidation (event) {
        if (event.detail.sayGlobalFormMistake === true) {
            this.popUpsController.golobalFormValidation = event.detail.sayGlobalFormMistake;
        } else {
            this.popUpsController.golobalFormValidation = false;
        }
    }



}