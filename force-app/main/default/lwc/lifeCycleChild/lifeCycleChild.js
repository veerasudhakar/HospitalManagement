import { LightningElement } from 'lwc';

export default class LifeCycleChild extends LightningElement {

    constructor(){
        super()
        console.log("Child constructor called")

    }
    connectedCallback(){
        console.log("Child connected callback called")
        throw new Error('Loading of child component failed')
    }

    renderedCallback(){
        console.log("child Rendered Callback called")
    }

    disconnectedCallback(){
       alert('child disconnected callback called')
    }
}