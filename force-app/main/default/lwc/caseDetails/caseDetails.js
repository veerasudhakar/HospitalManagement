import { LightningElement,api } from 'lwc';

export default class CaseDetails extends LightningElement {
   @api caseNumber;
    @api subject;
    @api priority;
    @api origin;
    @api description;
}