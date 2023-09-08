import { LightningElement } from 'lwc';

export default class ParentComponent extends LightningElement {
/*
    percentage=20;

    handleonChnage(event){
        this.percentage = event.target.value;
    }
    */
   constructor(){
    console.log('This is Parent constructor called')
    super();
   }

   connectedCallback(){
    console.log('This is called Parent connnected callback');
   }

   renderedCallback(){
    console.log('THis is parent rendered callback called');

   }

   disconnectedCallback(){
    console.log('This is Parent disconnectced callback called');
   }
}