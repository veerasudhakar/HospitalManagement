import { LightningElement, wire , api } from 'lwc';
  import { CurrentPageReference } from 'lightning/navigation';
export default class ComponentB extends LightningElement {
  @api receivedvalue;

    @wire(CurrentPageReference)
   setCurrentPageReference(currentPageReference) {
           
       this.receivedvalue = currentPageReference.state.n__inputParam
   }
}