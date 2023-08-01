import { LightningElement } from 'lwc';

export default class QuerySelector extends LightningElement {

    userNames=["Ram", "Laksh", "Bhrath", "Sita"]

    handleClick(){
        const elem = this.template.querySelector('h1');
        console.log(elem.innerText)

        const userelements=this.template.querySelectorAll('.name');
        Array.from(userelements).forEach(item=>{
            console.log(item.innerText)
        })
         //console.log(userelements)
    }
}