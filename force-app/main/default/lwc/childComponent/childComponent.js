import { LightningElement } from 'lwc';

export default class ChildComponent extends LightningElement {
/*
    @api percentage

    get style(){
        return 'background-colour:red; min-height:50px; width: ${this.percentage}%: min-width:10px; border:1px solid:black'
    }
    */
    constructor(){
        console.log('This is Child constructor called')
        super();
       }
    
       connectedCallback(){
        console.log('This is called child connnected callback');
       }
    
       renderedCallback(){
        console.log('THis is child rendered callback called');
    
       }
    
       disconnectedCallback(){
        console.log('This is child disconnectced callback called');
       }
}