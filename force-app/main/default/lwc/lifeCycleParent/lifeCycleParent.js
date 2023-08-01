import { LightningElement } from 'lwc';

export default class LifeCycleParent extends LightningElement {
isChildVisible=false
    constructor(){ 
        super()
        console.log("parent constructor called")
    }
    connectedCallback(){
        console.log('Parent connected callback called')
    }
    renderedCallback(){
        console.log('Parent rendered callback called')
    }
    handleClick(){
        this.isChildVisible = !this.isChildVisible

    }
    errorCallback(error, stack){
        console.log(error.message)
        console.log(stack)

    }

// name
//     handleClick(event){
//         this.name = event.target.value
//     }

}