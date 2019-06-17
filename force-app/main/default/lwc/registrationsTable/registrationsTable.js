import { LightningElement, wire, track}         from 'lwc';
import takeAllRegistrations                     from '@salesforce/apex/registrationsTable.takeAllRegistrations';
import getPickedRegistration                    from '@salesforce/apex/registrationsTable.getPickedRegistration'; 
import getRegistrationById                      from '@salesforce/apex/registrationsTable.getRegistrationById'; 
import {deleteRecord}                           from 'lightning/uiRecordApi';
import { ShowToastEvent }                       from 'lightning/platformShowToastEvent';

import { registerListener }                     from 'c/pubsub';
import { CurrentPageReference}                 from 'lightning/navigation';




export default class RegistrationsTable extends LightningElement {
    @wire(CurrentPageReference) pageRef;
    @wire(takeAllRegistrations)listOfRegistrations;


    
    redirectToDetail(event) {
        getPickedRegistration ({selectedRegistration: event.target.innerText})
            .then (result => {
                this.linkCreator = result[0].Id;
                window.open(`/lightning/r/Registration__c/${this.linkCreator}/view`);
            }) 
            .catch(error => {
                this.error = error;
            });
    }


    
    handlerEditButton(event){
        getRegistrationById ({selectedRegistration: event.target.value})
            .then (result => {
                this.linkCreatorB = result[0].Id;
                window.open(`/lightning/r/Registration__c/${this.linkCreatorB}/view`);
            }) 
            .catch(error => {
                this.error = error;
            });
    }



    connectedCallback() {
        registerListener("createRegistration", this.handlegetRegistrationInfo, this);
      }
     


    handlegetRegistrationInfo (event) {
        let registrationCatchId = event.detail.registrationId;
        let inputedCatchNickData = event.detail.inputedNickData;

        let newRegistrationObject = {
            Id:     registrationCatchId,
            Name:   inputedCatchNickData            
        }

        this.listOfRegistrations.data = [ ...this.listOfRegistrations.data, newRegistrationObject];    
        
    }



    @track idWarehouse;
    wipeRegistration(event){
        this.listOfRegistrations.data = this.listOfRegistrations.data.filter(value => value.Id !== event.target.value);
        this.idWarehouse = event.target.value;
            deleteRecord(this.idWarehouse)
                .then(() => { 
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'Registration: '+ this.idWarehouse +' has been deleted.',
                            variant: 'success',
                        }),
                    );
                })
                .catch(error => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Error updating record',
                            message: error.body.message,
                            variant: 'error',
                        }),
                    );
                });
    }

  
     
}