import { LightningElement, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import fetchContacts from '@salesforce/apex/ContactDataController.fetchContacts';
import fetchContacts4 from '@salesforce/apex/ContactDataController.fetchContacts4';
import scheduleJobMethod from '@salesforce/apex/shiftWiseCasesChangeJobScheduler.scheduleJobMethod';
import completedJobsScheduleMethod from '@salesforce/apex/ClearCompletedScheduleJobsClass.completedJobsScheduleMethod';

import { loadStyle } from 'lightning/platformResourceLoader';

export default class Shiftschudle extends LightningElement {
    @track pageSizeOptions = [5, 10, 25, 50, 75, 100];
    @track records = [];
    @track columns = [];
    @track totalRecords = 0;
    @track pageSize;
    @track totalPages;
    @track pageNumber = 1;
    @track recordsToDisplay = [];

    connectedCallback() {
        this.columns = [
            { label: 'Case Number', fieldName: 'Case_No__c' },
            { label: 'Subject', fieldName: 'Subject' },
            {
                label: 'Origin',
                fieldName: 'Origin',
                hideDefaultActions: true,
                sortable: false,
                actions: [
                    { label: 'Web', checked: true, name: 'Web' },
                    { label: 'Email', checked: false, name: 'Email' },
                    { label: 'Phone', checked: false, name: 'Phone' }
                ]
            },
            { label: 'Case Owner', fieldName: 'Case_Owner_Name__c' },
            {
                label: 'Priority',
                fieldName: 'Priority',
                hideDefaultActions: true,
                sortable: false,
                actions: [
                    { label: 'High', checked: true, name: 'High' },
                    { label: 'Medium', checked: false, name: 'Medium' },
                    { label: 'Low', checked: false, name: 'Low' }
                ]
            },
            {
                label: 'Status',
                fieldName: 'Status',
                hideDefaultActions: true,
                sortable: false,
                actions: [
                    { label: 'New', checked: true, name: 'New' },
                    { label: 'Working', checked: false, name: 'Working' },
                    { label: 'Escalated', checked: false, name: 'Escalated' },
                    { label: 'Closed', checked: false, name: 'Closed' }
                ]
            },
            { label: 'Owner Name', fieldName: 'Owner.Name' }
        ];

        this.fetchContactRecords();
        loadStyle(this, 'yourCustomStyleResourceUrl')
            .then(() => {
                console.log('Custom styles loaded');
            })
            .catch(error => {
                console.error('Error loading custom styles: ', error);
            });
    }

    fetchContactRecords() {
        fetchContacts()
            .then(result => {
                if (result !== null) {
                    this.records = result;
                    this.totalRecords = result.length;
                    this.pageSize = this.pageSizeOptions[0];
                    this.paginationHelper();
                }
            })
            .catch(error => {
                console.log('Error while fetching contacts: ', error);
            });
    }

    @wire(fetchContacts4, { fieldApi: '$fieldApi', selectedValue: '$selectedValue' })
    wiredFetchContacts4({ error, data }) {
        if (data) {
            this.recordsToDisplay = data;
        } else if (error) {
            console.error('Error fetching contacts: ', error);
        }
    }

    handleRecordsPerPage(event) {
        this.pageSize = event.target.value;
        this.paginationHelper();
    }

    previousPage() {
        this.pageNumber = this.pageNumber - 1;
        this.paginationHelper();
    }

    nextPage() {
        this.pageNumber = this.pageNumber + 1;
        this.paginationHelper();
    }

    firstPage() {
        this.pageNumber = 1;
        this.paginationHelper();
    }

    lastPage() {
        this.pageNumber = this.totalPages;
        this.paginationHelper();
    }

    paginationHelper() {
    this.recordsToDisplay = [];
    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    if (this.pageNumber <= 1) {
        this.pageNumber = 1;
    } else if (this.pageNumber >= this.totalPages) {
        this.pageNumber = this.totalPages;
    }
    for (
        let i = (this.pageNumber - 1) * this.pageSize;
        i < this.pageNumber * this.pageSize && i < this.totalRecords;
        i++
    ) {
        this.recordsToDisplay.push(this.records[i]);
    }
}


    handleHeaderAction(event) {
        const actionName = event.detail.action.name;
        const fieldName = event.detail.columnDefinition.fieldName;
        fetchContacts4({ fieldApi: fieldName, selectedValue: actionName })
            .then(result => {
                this.recordsToDisplay = result;
            })
            .catch(error => {
                console.error('Error fetching filtered contacts: ', error);
            });
    }

    
     handleClick() {
        scheduleJobMethod()
            .then(() => {
                console.log('success');
               
        const evt = new ShowToastEvent({
            title: "Success",
            message: "Scheduled Successfully",
            variant: "success",
            mode: "sticky"
        });
        this.dispatchEvent(evt);
    
            })
            .catch((error) => {
                console.error(error);
    
        const evt = new ShowToastEvent({
            title: "Sorry",
            message: "Job Already Scheduled ",
            variant: "error",
            mode: "sticky"
        });
        this.dispatchEvent(evt);
    
            });
    }


   handleclearjob() {
   
    completedJobsScheduleMethod()
            .then(() => {
                console.log('success');
               
        const evt = new ShowToastEvent({
            title: "Success",
            message: "Scheduled Successfully",
            variant: "success",
            mode: "sticky"
        });
        this.dispatchEvent(evt);
    
            })
            .catch((error) => {
                console.error(error);
    
        const evt = new ShowToastEvent({
            title: "Sorry",
            message: "Job Already Scheduled ",
            variant: "error",
            mode: "sticky"
        });
        this.dispatchEvent(evt);
    
            });
}
}