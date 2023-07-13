import { LightningElement } from 'lwc';
 export default class emailverificationComponent extends LightningElement {
    handleEmailValidation() {
        var flag = true;
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let email = this.template.querySelector('[data-id="txtEmailAddress"]');
        let emailVal = email.value;
        if (emailVal.match(emailRegex)) {
            email.setCustomValidity("");

        } else {
            flag = false;
            email.setCustomValidity("Please enter valid email");
        }
        email.reportValidity();
        return flag;
    }
 }