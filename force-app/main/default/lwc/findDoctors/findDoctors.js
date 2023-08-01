import { LightningElement, track } from 'lwc';
import getContactSearchResults from '@salesforce/apex/SearchController.getContactSearchResults';

export default class SearchComponent extends LightningElement {
    @track specialityValue;
    @track locationValue;
    @track searchResults;

    handleSpecialityChange(event) {
        this.specialityValue = event.target.value;
    }

    handleLocationChange(event) {
        this.locationValue = event.target.value;
    }

    handleSearchClick() {
        // Call the Apex method to retrieve the search results
        getContactSearchResults({ specialityValue: this.specialityValue, locationValue: this.locationValue })
            .then(result => {
                this.searchResults = result;
            })
            .catch(error => {
                // Handle any errors
                console.error('Error retrieving search results:', error);
            });
    }
}