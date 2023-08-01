import { LightningElement ,track} from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
export default class MarqueeStyle extends  NavigationMixin(LightningElement)
 {
     @track showModal = false;

    // handleLWCNavigate() {
    //     this[NavigationMixin.Navigate]({
    //         type: "standard__component",
    //         attributes: {
    //             componentName: "c__profileComponent"
    //         },
            
    //     });
    // }

   handleLWCNavigate() {
        this.showModal = true;
    }


}