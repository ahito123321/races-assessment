import {LightningElement, track} from 'lwc';

export default class LightningExampleAccordionConditional extends LightningElement{
    @track activeSectionMessage = '';
    @track isDVisible = false;

    handleToggleSection(event) {
        this.activeSectionMessage = 
            'Open section name; ' + event.detail.opneSections;
    }

    handleToggleSectionD(){
        this.idDVisible = !this.isDVisible;
    }

    get isMessageVisible(){
        return this.activeSectionMessage.length > 0;
    }
}