// Import the LightningElement class and the track decorator from the lwc module
import { LightningElement, wire } from "lwc";
// Import the getAccounts method from the AccountController Apex class
import getAccounts from "@salesforce/apex/AccountControllerFilter.getAccounts";
import fetchPicklistValues from '@salesforce/apex/AccountControllerFilter.fetchPicklistValues';
import getFieldType from '@salesforce/apex/AccountControllerFilter.getFieldType';
// Import the Images resource for sort up and down icon from static resources
//import Images from "@salesforce/resourceUrl/Images";
import './htmlTablePagination.css';
 
// Declare the Pagenationex class as the default export
export default class HtmlTablePagination extends LightningElement {
    // Declare variables for data binding
    // Accounts data array to store account records returned from apex controller
    accounts = [];
    // Accounts data array to be displayed on current page
    displayAccounts = [];
    // Array of page numbers
    pageNumbers = [];
    // Current page number
    currentPage = 1;
    // Total number of pages
    totalPages = 0;
    // Number of records per page
    pageSize = 5;
    // Total number of records
    totalRecords;
    // Flag to indicate if current page is first page
    isFirstPage = true;
    // Flag to indicate if current page is last page
    isLastPage = false;
    // Flag to disable previous button
    isPreviousDisabled = true;
    // Flag to disable next button
    isNextDisabled = false;
    // Field on which data is to be sorted
    sortField;
    // Flag to indicate if data is to be sorted in ascending order
    sortAscending = true;
    // Flag to show/hide spinner
    showSpinner = true;
    // Flag to show/hide paginationbuttons
    showPageButtons = false;
    filteredData = [];
    showModal = false;
    filterValue = '';
    // stores current filter values
    filters = {};
    columnFilterName;
    selectedColumnName;
    isPicklist = false;
    isDate = false;
    picklistOptions = [];
    columnDataType;
    metadata = [];
    selectedNameValue = '';
    selectedPhoneValue = '';
    selectedIndustryValue = '';    
    //using the @wire decorator to connect to the getAccounts Apex method
    @wire(getAccounts)
    /**
     * wiredAccounts method is used to handle the data returned from the Apex method.
     * It assigns the data to the accounts property and sets the total number of records and total number of pages.
     * It also calls the setPages and navigateToFirstPage methods to set the pagination and navigate to the first page.
     * @param {Object} data - data returned from the Apex method
     * @param {Object} error - error returned from the Apex method
    */
    wiredAccounts({ data, error }) {
        // If data is returned from the Apex method
        if (data) {
            // Assign the data to the accounts property
            this.accounts = data;
            this.filteredData = [...this.accounts];
            // Assign the total number of records to the totalRecords property
            this.totalRecords = data.length;
            // Calculate the total number of pages based on the page size and the total number of records
            this.totalPages = Math.ceil(this.accounts.length / this.pageSize);
            // Call the setPages method, passing in the data
            this.setPages(data);
            // Call the navigateToFirstPage method to navigate to the first page
            this.navigateToFirstPage();
            this.showSpinner = false;
        } else if (error) {
            // If an error is returned, handle it
            this.showSpinner = false;
        }
    }
    /**
     * setPages method is used to set the page numbers for the pagination component.
     * It creates an array of page numbers based on the length of the data and the page size.
     * The created array is assigned to this.pageNumbers so that it can be used in the pagination component.
     * @param {Object} data - data used to calculate the number of pages
    */
    setPages(data) {
        // Create an array of page numbers based on the length of the data and the page size.
        // this.pageNumbers is assigned the array so that it can be used in the pagination component.
        this.pageNumbers = Array.from(
            // Using the Array.from method with the length of Math.ceil(data.length / this.pageSize)
            { length: Math.ceil(data.length / this.pageSize) },
            // _ is a placeholder for the value of the array and i is the index of the array, and it starts with 1.
            (_, i) => i + 1
        );
    }
    /**
     * getPagesList method is used to return the list of page numbers to be displayed in the pagination component.
     * It calculates the middle of the page size and checks if the total number of pages is greater than the middle of the page size.
     * If so, it returns a slice of page numbers from the current page - middle to the current page + middle - 1.
     * If the total number of pages is less than or equal to the middle of the page size,
       it returns a slice of page numbers from the start to the page size
    */
    getPagesList() {
        //Calculates the middle of the page size
        let mid = Math.floor(this.pageSize / 2) + 1;
        //Checks if the total number of pages is greater than the middle of the page size
        if (this.pageNumbers > mid) {
            //Returns a slice of page numbers from the current page - middle to the current page + middle - 1
            return this.pageNumbers.slice(
                this.currentPage - mid,
                this.currentPage + mid - 1
            );
        }
        //If the total number of pages is less than or equal to the middle of the page size,
        //returns a slice of page numbers from the start to the page size
        return this.pageNumbers.slice(0, this.pageSize);
    }
    /**
     * navigateToFirstPage method is used to navigate to the first page of the pagination component.
     * It assigns the current page to the first page, sets the flags for the first page, last page, 
        previous button, and next button, and assigns the accounts to be displayed on the first page.
    */
    navigateToFirstPage() {
        // Assign the current page to the first page
        this.currentPage = 1;
        // Assign the flag for first page to true
        this.isFirstPage = true;
        // Assign the flag for previous button to be disabled
        this.isPreviousDisabled = true;
        if (this.filteredData.length <= this.pageSize) {
            // Assign the flag for next button to be enabled / disabled
            this.isNextDisabled = true;
            // Assign the flag for last button to be enabled / disabled
            this.isLastPage = true;
        } else {
            // Assign the flag for next button to be enabled / disabled
            this.isNextDisabled = false;
            // Assign the flag for last button to be enabled / disabled
            this.isLastPage = false;
        }
        //this.isNextDisabled = false;
        // Assign the accounts to be displayed on the first page
        this.displayAccounts = this.filteredData.slice(0, this.pageSize);
    }
    /**
     * navigateToLastPage method is used to navigate to the last page of the pagination.
     * It assigns the current page variable to the total number of pages, updates the isFirstPage and isLastPage variables,
       and sets the isPreviousDisabled and isNextDisabled variables.
     * It also assigns the displayAccounts variable to the slice of the accounts array that corresponds to the current page
    */
    navigateToLastPage() {
        // Assign the current page variable to the total number of pages
        this.currentPage = this.totalPages;
        // Assign the isFirstPage variable to false, indicating that the current page is not the first page
        this.isFirstPage = false;
        // Assign the isLastPage variable to true, indicating that the current page is the last page
        this.isLastPage = true;
        // This line sets the isPreviousDisabled variable to false, indicating that the "previous" button should be enabled
        this.isPreviousDisabled = false;
        // Assign the isNextDisabled variable to true, indicating that the "next" button should be disabled
        this.isNextDisabled = true;
        // Assign the displayAccounts variable to the slice of the accounts array that corresponds to the current page, using the currentPage, pageSize and the accounts array
        this.displayAccounts = this.filteredData.slice(
            (this.currentPage - 1) * this.pageSize,
            this.currentPage * this.pageSize
        );
    }
    /** 
     * navigateToPage method is used to navigate to a specific page.
     * It sets the currentPage variable to the page number that was clicked and checks if the current page 
       is the first page, last page, and if the previous and next buttons should be disabled.
     * It also calls the displayAccounts property and slice the accounts array to display the accounts for the current page.
     * @param {Object} event - event object passed when a page number is clicked.
    */
    navigateToPage(event) {
        //Sets the currentPage variable to the page number that was clicked
        this.currentPage = parseInt(event.target.textContent, 10);
        //Checks if the current page is the first page
        this.isFirstPage = this.currentPage === 1;
        //Checks if the current page is the last page
        this.isLastPage = this.currentPage === this.totalPages;
        //Checks if the previous button should be disabled
        this.isPreviousDisabled = this.currentPage === 1;
        //Checks if the next button should be disabled
        this.isNextDisabled = this.currentPage === this.totalPages;
        //Displays the accounts for the current page
        this.displayAccounts = this.filteredData.slice(
            //Calculates the start index for the current page
            (this.currentPage - 1) * this.pageSize,
            //Calculates the end index for the current page
            this.currentPage * this.pageSize
        );
    }
    /**
     * navigateToPreviousPage method is used to navigate to the previous page in the pagination.
     * It updates the currentPage, isFirstPage, isLastPage, isPreviousDisabled and isNextDisabled properties
       and also updates the accounts to be displayed on the current page
    */
    navigateToPreviousPage() {
        // Assign the current page variable to the current page minus 1
        this.currentPage = this.currentPage - 1;
        // Assign the isLastPage variable to false, indicating that the current page is not the last page
        this.isLastPage = false;
        // If the current page is equal to 1
        if (this.currentPage === 1) {
            // Assign the isFirstPage variable to true, indicating that the current page is the first page
            this.isFirstPage = true;
            // Assign the isPreviousDisabled variable to true, indicating that the "previous" button should be disabled
            this.isPreviousDisabled = true;
        }
        // Assign the isNextDisabled variable to false, indicating that the "next" button should be enabled
        this.isNextDisabled = false;
        // Assign the accounts to be displayed on the previous page
        this.displayAccounts = this.filteredData.slice(
            (this.currentPage - 1) * this.pageSize,
            this.currentPage * this.pageSize
        );
    }
    /**
     * navigateToNextPage method is used to navigate to the next page of accounts.
     * It checks if the current page is less than the total number of pages.
     * If true, it increments the current page by 1, updates the isFirstPage, isLastPage, isPreviousDisabled and isNextDisabled properties.
     * It also updates the displayAccounts array to show the accounts for the current page
    */
    navigateToNextPage() {
        //Checks if the current page is less than the total number of pages
        if (this.currentPage < this.totalPages) {
            //Increments the current page by 1
            this.currentPage++;
            //Checks if the current page is equal to the total number of pages
            if (this.currentPage === this.totalPages) {
                //Sets isFirstPage and isPreviousDisabled to false, isLastPage and isNextDisabled to true
                this.isFirstPage = false;
                this.isLastPage = true;
                this.isPreviousDisabled = false;
                this.isNextDisabled = true;
            } else {
                //Sets isFirstPage, isLastPage, isPreviousDisabled, and isNextDisabled to false
                this.isFirstPage = false;
                this.isLastPage = false;
                this.isPreviousDisabled = false;
                this.isNextDisabled = false;
            }
            //Updates the displayAccounts array to show the accounts for the current page
            this.displayAccounts = this.filteredData.slice(
                (this.currentPage - 1) * this.pageSize,
                this.currentPage * this.pageSize
            );
        }
    }
    /**
     * handleSort method is used to handle the sorting of data when user clicks on the table header.
     * It gets the field name of the clicked table header and checks if the current sort field is the same as the field name of the clicked table header.
     * If the same, it toggles the sort order. If not, it updates the sort field and sets the sort order as ascending.
     * It also calls the sortData method to sort the data.
     * @param {Event} event - event object of the table header click
    */
    handleSort(event) {
        // get the field name of the clicked table header
        let fieldName = event.target.dataset.fieldName;
        // check if the current sort field is the same as the field name of the clicked table header
        if (this.sortField === fieldName) {
            // if the same, toggle the sort order
            this.sortAscending = !this.sortAscending;
        } else {
            // if not the same, update the sort field and set sort order as ascending
            this.sortField = fieldName;
            this.sortAscending = true;
        }
        // call the sortData method to sort the data
        this.sortData(this.sortField, this.sortAscending);
    }
    /**
     * sortData method is used to sort the data based on the given field name and sort order.
     * It creates a copy of the accounts array, sorts it using the provided field name and sort order, and assigns the sorted data back to the accounts array.
     * It also assigns a slice of the sorted data to the displayAccounts array to only show a certain number of records per page,
       and creates and adds a sort icon to indicate the current sort order.
     * @param {String} sortField - the field name by which to sort the data.
     * @param {Boolean} sortAscending - the sort order, true for ascending and false for descending
    */
    sortData(sortField, sortAscending) {
        this.filteredData = [...this.filteredData].sort((a, b) => {
            let valueA = a[sortField] === undefined ? null : a[sortField];
            let valueB = b[sortField] === undefined ? null : b[sortField];
            if (valueA === null) {
                return sortAscending ? 1 : -1;
            }
            if (valueB === null) {
                return sortAscending ? -1 : 1;
            }
            return this.compareValues(valueA, valueB, sortAscending);
        });
        this.displayAccounts = this.filteredData.slice(0, this.pageSize);
        this.handleSortIcon(sortAscending, sortField);
        this.navigateToFirstPage();
    }
    /**
     * compareValues method is used to compare two values in a natural order.
     * @param {String} valueA - the first value to be compared.
     * @param {String} valueB - the second value to be compared.
     * @param {Boolean} sortAscending - the sort order, true for ascending and false for descending
    */
    compareValues(valueA, valueB, sortAscending) {
        if (typeof valueA === "string" && typeof valueB === "string") {
            const partsA = valueA.match(/\D+|\d+/g);
            const partsB = valueB.match(/\D+|\d+/g);
            let i = 0;
            while (i < partsA.length && i < partsB.length) {
                if (/^\d+$/.test(partsA[i]) && /^\d+$/.test(partsB[i])) {
                    const num1 = parseInt(partsA[i], 10);
                    const num2 = parseInt(partsB[i], 10);
                    if (num1 !== num2) {
                        return sortAscending ? num1 - num2 : num2 - num1;
                    }
                } else {
                    const cmp = partsA[i].localeCompare(partsB[i]);
                    if (cmp !== 0) {
                        return sortAscending ? cmp : -cmp;
                    }
                }
                i++;
            }
            return partsA.length - partsB.length;
        } else {
            const aValue = typeof valueA === "string" ? valueA.toLowerCase() : valueA;
            const bValue = typeof valueB === "string" ? valueB.toLowerCase() : valueB;
            if (aValue < bValue) {
                return sortAscending ? -1 : 1;
            } else if (aValue > bValue) {
                return sortAscending ? 1 : -1;
            } else {
                return 0;
            }
        }
    }
    /**
     * handleSortIcon method is used to create, remove and set the sort icon
     * @param {Boolean} sortAscending - the sort order, true for ascending and false for descending
     * @param {String} sortField - the field name by which to sort the data.
     */
    handleSortIcon(sortAscending, sortField) {
        let existingIcon = this.template.querySelectorAll('img[id="sorticon"]');
        if (existingIcon[0]) {
            existingIcon[0].parentNode.removeChild(existingIcon[0]);
        }
        let icon = document.createElement("img");
        if (sortAscending) {
            icon.setAttribute("src", Images + "/Images/arrowup.png");
        }
        if (!sortAscending) {
            icon.setAttribute("src", Images + "/Images/arrowdown.png");
        }
        icon.setAttribute("id", "sorticon");
        icon.style.height = "15px";
        icon.style.width = "15px";
        icon.style.paddingBottom = "2px";
        let nodes = this.template.querySelectorAll(
            'span[data-field-id="' + sortField + '"]'
        );
        nodes.forEach((input) => {
            input.appendChild(icon);
        });
    }
    /**
     * handleFilterChange method is used to handle the entered filter value
    */
    handleFilterChange(event) {
        this.filterValue = event.detail.value;
    }
    /**
     * handleHeaderAction method is used to handler the apply filter button
     * @param {Object} event - name of column, where filter is selected.
    */
    handleHeaderAction(e) {
        const action = e.detail.value;
        const column = e.target.dataset.column;
        this.selectedColumnName = column;
        this.columnFilterName = 'Filter Column : ' + this.selectedColumnName.toUpperCase();
        if (action === 'filter') {
            getFieldType({ objectName: 'Account', fieldName: this.selectedColumnName })
                .then(result => {
                    this.columnDataType = result;
                    let fieldMetadata = this.metadata.find(metadata => metadata.fieldType === this.columnDataType);
                    if (fieldMetadata) {
                        // if metadata exists, update the fieldType
                        fieldMetadata.fieldType = result;
                    } else {
                        // if metadata does not exist, add it to the metadata array
                        this.metadata.push({ fieldName: this.selectedColumnName, fieldType: result });
                    }
                    let fieldMetadata2 = this.metadata.find(metadata => metadata.fieldName === this.selectedColumnName);
                    let fieldType = fieldMetadata2 ? fieldMetadata2.fieldType : 'text'; // default to 'text' if fieldType is not found in metadata    
                    if (fieldType.toLowerCase() === 'picklist') {
                        this.isPicklist = true;
                        fetchPicklistValues({ objectName: 'Account', fieldName: this.selectedColumnName })
                            .then(result2 => {
                                this.picklistOptions = result2.map(value => ({ label: value, value: value }));
                                this.openModal();
                            })
                            .catch(error => {
                                console.error('Error getting picklist values', error);
                            });
                    } else if (fieldType.toLowerCase() === 'datetime') {
                        this.isDate = true;
                        this.openModal();
                    }
                    else {
                        this.isPicklist = false;
                        this.isDate = false;
                        this.openModal();
                    }
                })
                .catch(error => {
                    console.error('Error determining if field is a picklist', error);
                });
 
        } else if (action === 'clearFilter') {
            this.clearFilter(column);
        }
    }    
    /**
     * filterData method is used to apply the filter to data
    */
    applyFilter() {
        this.filters[this.selectedColumnName] = this.filterValue;
        this.filterData();
        this.sortField = null;
        this.sortAscending = true;
        this.removeSortIcon();
        this.closeModal();
    }
    /**
     * filterData method is used to filter the account list based on enetered filter value
    */
    filterData() {
        for (let key in this.filters) {
            if (this.hasProperty(this.filters, key)) {
                // get the fieldType of the column from metadata
                let fieldMetadata = this.metadata.find(metadata => metadata.fieldName === key);
                let fieldType = fieldMetadata ? fieldMetadata.fieldType : 'string'; // default to 'string' if fieldType is not found in metadata
                this.filteredData = this.filteredData.filter(row => {
                    if (row[key]) {
                        // check if the column is a picklist based on its metadata
                        if (fieldType.toLowerCase() === 'picklist') {
                            let rowValue = row[key].toLowerCase();
                            // check if the row's value is included in any of the selected options
                            return this.filters[key].some(filterVal => filterVal.toLowerCase().includes(rowValue));
                        } else if (fieldType.toLowerCase() === 'date') {
                            // convert both filter date and row date to the same format (yyyy-mm-dd) for comparison
                            let rowDate = new Date(row[key]).toISOString().split('T')[0]; // converts row date to 'yyyy-mm-dd' format
                            let filterDate = this.filters[key].split('-').reverse().join('-'); // converts 'dd-mm-yyyy' to 'yyyy-mm-dd'
                            return rowDate === filterDate;
                        } else if (fieldType.toLowerCase() === 'datetime') {
                            // transform the row's value to the date format 'yyyy-mm-dd'
                            let rowValue = new Date(row[key]).toISOString().split('T')[0];
                            return rowValue === this.filters[key];
                        } else {
                            let rowValue = row[key].toString().toLowerCase();
                            return rowValue.includes(this.filters[key].toLowerCase());
                        }
                    }
                    return false;
                });
            }
        }
        this.totalPages = Math.ceil(this.filteredData.length / this.pageSize);
        //.setPages(this.filteredData);
        this.navigateToFirstPage();
    }
    /**
     * removeSortIcon method is used to remove the sort icon from column
    */
    removeSortIcon() {
        // Select any existing sort icon on the page
        let existingIcon = this.template.querySelectorAll('img[id="sorticon"]');
        // If an existing sort icon is found, remove it
        if (existingIcon[0]) {
            existingIcon[0].parentNode.removeChild(existingIcon[0]);
        }
    }
    /**
     * clearFilter method is used to clear the selected column filters
     * @param {Object} event - name of column, where filter is selected.
    */
    clearFilter(column) {
        if (this.hasProperty(this.filters, column)) {
            delete this.filters[column];
            delete this.metadata[column];
            this.filterValue = '';
            this.applyRemainingFilters();
        }
    }
    /**
     * applyRemainingFilters method is used to apply the filters, in case multiple filters are there
       and any one of them is removed.
    */
    applyRemainingFilters() {
        // if no more filters, reset to original data
        if (!this.hasProperties(this.filters)) {
            this.filteredData = [...this.accounts];
            this.metadata = [];
            this.isPicklist = false;
            this.isDate = false;
        } else {
            // reset before applying remaining filters
            this.filteredData = [...this.accounts];
            this.filterData();
        }
        this.totalPages = Math.ceil(this.filteredData.length / this.pageSize);
        this.setPages(this.filteredData);
        this.navigateToFirstPage();
        // reset sorting
        this.sortField = null;
        this.sortAscending = true;
        // remove sort icon
        this.removeSortIcon();
    }
    /**
     * hasProperties method is used to check the properties in a array.
    */
    hasProperties(obj) {
        return Object.keys(obj).length > 0;
    }    
    /**
     * hasProperties method is used to check the property in a array.
    */
    hasProperty(obj, property) {
        return Object.prototype.hasOwnProperty.call(obj, property);
    }    
    /**
     * Open Modal method is used to open the modal popup.
    */
    openModal() {
        this.showModal = true;
    }
    /**
     * closeModal method is used to close the modal popup.
    */
    closeModal() {
        this.showModal = false;
    }
}