import { LightningElement } from 'lwc';
import {closeActionScreenEvent} from 'lightning/actions'
export default class CreateQuickAction extends LightningElement {
    isAction=true;

    handleClick(){
this.refs.createTodo.handleParentClick();
    }
    closeAction(){
this.dispatchEvent(new closeActionScreenEvent());
    }
}