import { LightningElement, wire, track}         from 'lwc';
import takeAllRegistrations                     from '@salesforce/apex/registrationsTable.takeAllRegistrations';
import getPickedRegistration                    from '@salesforce/apex/registrationsTable.getPickedRegistration'; 
import getRegistrationById                      from '@salesforce/apex/registrationsTable.getRegistrationById'; 
import {deleteRecord}                           from 'lightning/uiRecordApi';
import { ShowToastEvent }                       from 'lightning/platformShowToastEvent';

import { registerListener }                     from 'c/pubsub';
import { CurrentPageReference }                 from 'lightning/navigation';



export default class RegistrationsTable extends LightningElement {

    @wire(CurrentPageReference) pageRef;
   
    @track keyElement = '';
    @wire (takeAllRegistrations, {keyElement: '$keyElement'})listOfRegistrations;



    redirectToDetail(event) {
        getPickedRegistration ({selectedRegistration: event.target.innerText})
            .then (result => {
                this.linkCreator = result[0].Id;
                window.location.href = `/lightning/n/Races`;
                const catchID = {
                    location: this.linkCreator,
                }
                window.sessionStorage.setItem('catchParam', JSON.stringify(catchID));        
            }) 
            .catch(error => {
                this.error = error;
            });
    }



    handlerEditButton(event){
        getRegistrationById ({selectedRegistration: event.target.value})
            .then (result => {
                this.linkCreatorB = result[0].Id;
                window.location.href = '/lightning/n/Races';
                const catchID = {
                    location: this.linkCreatorB,
                }
                window.sessionStorage.setItem('catchParam', JSON.stringify(catchID));            
            }) 
            .catch(error => {
                this.error = error;
            });
    }
    


    connectedCallback() {
        registerListener("createRegistration", this.handlegetRegistrationInfo, this);
        registerListener("searchRegistration", this.handlegetSearchInfo, this);
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



    handlegetSearchInfo (event) {
        this.keyElement = event.detail.keyElement
    }



    @track idWarehouse;

    wipeRegistration(event){
        this.wipeRegistration.data = this.listOfRegistrations.data.filter(registration => registration.Id === event.target.value);
        this.listOfRegistrations.data = this.listOfRegistrations.data.filter(value => value.Id !== event.target.value);
        this.idWarehouse = event.target.value;
        this.wipeRegistrationName = this.wipeRegistration.data[0].Name;
            deleteRecord(this.idWarehouse)
                .then(() => { 
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'Registration: '+ this.wipeRegistrationName +' has been deleted.',
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