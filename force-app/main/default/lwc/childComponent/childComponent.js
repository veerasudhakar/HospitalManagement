import { LightningElement,api } from 'lwc';

export default class ChildComponent extends LightningElement {

    @api percentage

    get style(){
        return 'background-colour:red; min-height:50px; width: ${this.percentage}%: min-width:10px; border:1px solid:black'
    }
}