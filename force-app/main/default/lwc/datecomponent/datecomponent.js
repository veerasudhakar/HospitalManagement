import { LightningElement, wire } from 'lwc';
import filterRecordsByCriteria from '@salesforce/apex/SampleController.filterRecordsByCriteria';

export default class MyComponent extends LightningElement {
    filterCriteria;

    @wire(filterRecordsByCriteria, { filterCriteria: '$filterCriteria' })
    records;

    handleFilterChange(event) {
        this.filterCriteria = event.target.value;
    }
}