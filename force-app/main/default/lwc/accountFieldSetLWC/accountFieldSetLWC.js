import { LightningElement, wire } from 'lwc';
import getAccountList from '@salesforce/apex/AccountControllerFieldSet.getAccountList';
import getFieldLabelAndFieldAPI from '@salesforce/apex/AccountFieldSetCtrl.getFieldLableAndFieldAPI';
export default class AccountFieldSetLWC extends LightningElement {
    accounts = [];
    columns = [];

    @wire(getAccountList)
    wiredAccounts({ error, data }) {
        if (data) {
            this.accounts = data;
        } else if (error) {
            console.error(error);
        }
    }

    @wire(getFieldLabelAndFieldAPI)
    wiredFieldLabels({ error, data }) {
        if (data) {
            this.columns = JSON.parse(data).map(field => ({
                label: Object.keys(field)[0],
                fieldName: field[Object.keys(field)[0]]
            }));
        } else if (error) {
            console.error(error);
        }
    }
    }
  