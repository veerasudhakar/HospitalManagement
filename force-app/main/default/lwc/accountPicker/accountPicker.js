import { LightningElement ,wire} from 'lwc';
import getAccountNames from '@salesforce/apex/AccountControllerPicker.getAccountNames';
import getAccountDetails from '@salesforce/apex/AccountControllerPicker.getAccountDetails';
export default class AccountPicker extends LightningElement {

    selectedAccountId = '';
    accountOptions = [];

    @wire(getAccountNames)
    wiredAccountNames({ data, error }) {
        if (data) {
            this.accountOptions = data.map(account => ({
                label: account.Name,
                value: account.Id
            }));
        } else if (error) {
            console.error(error);
        }
    }

    handleAccountChange(event) {
        this.selectedAccountId = event.detail.value;
        if (this.selectedAccountId) {
            getAccountDetails({ accountId: this.selectedAccountId })
                .then(result => {
                    this.selectedAccount = result;
                })
                .catch(error => {
                    console.error(error);
                });
        } else {
            this.selectedAccount = null;
        }
    }
}