import { LightningElement, track, wire } from 'lwc';
import getDoctors from '@salesforce/apex/DoctorController.getDoctors';
import getTotalPages from '@salesforce/apex/DoctorController.getTotalPages';

const PAGE_SIZE = 2;

export default class PaginationComponent extends LightningElement {
    @track doctors;
    @track currentPage = 1;
    @track totalPages;
    @track displayedDoctors;

    @wire(getDoctors, { pageNumber: '$currentPage', pageSize: PAGE_SIZE })
    wiredDoctors({ error, data }) {
        if (data) {
            this.doctors = data;
            this.displayedDoctors = data;
        } else if (error) {
            // Handle error
        }
    }

    @wire(getTotalPages, { pageSize: PAGE_SIZE })
    wiredTotalPages({ error, data }) {
        if (data) {
            this.totalPages = data;
        } else if (error) {
            // Handle error
        }
    }

    handlePrevious() {
        if (this.currentPage > 1) {
            this.currentPage -= 1;
        }
    }

    handleNext() {
        if (this.currentPage < this.totalPages) {
            this.currentPage += 1;
        }
    }
}