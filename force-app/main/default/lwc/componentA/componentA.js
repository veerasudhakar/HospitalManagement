import { LightningElement, track } from 'lwc';
  import { NavigationMixin } from 'lightning/navigation';
  import { encodeDefaultFieldValues } from 'lightning/pageReferenceUtils';

export default class ComponentA extends NavigationMixin (LightningElement) {
   @track inputValue = '';

    handleInputChange(event) {
      this.inputValue = event.target.value;
    }

    openComponentB() {
        console.log(this.inputValue)
      // Open Component B in a new tab with URL parameters
      const pageReference = {
        type: 'standard__navItemPage',
        attributes: {
          apiName: 'myappointments' // Replace with the appropriate API name of Component B tab
        },
        state: {
        //   defaultFieldValues: encodeDefaultFieldValues({
            n__inputParam: this.inputValue
        //   })
        }
      };

      this[NavigationMixin.Navigate](pageReference);
    }
  }