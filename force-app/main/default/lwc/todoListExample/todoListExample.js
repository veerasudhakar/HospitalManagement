import { LightningElement,api } from 'lwc';
import TODOLIST1 from '@salesforce/apex/TodoList.TodoList'
import {ShowToastEvent} from 'lightning/platformShowToastEvent'
export default class TodoListExample extends LightningElement {
    taskTitle;
    dueDate;
showdate = false;
showbutton = false;


@api targetparent

connectedCallback(){
    console.log('### Target Parent called:',this.targetparent);
}
    inputchange(event){
      const feildName = event.target.name;
      if(feildName === 'TaskTitle'){
        this.taskTitle = event.target.value;
       if(this.taskTitle !=''){
        this.showdate = true;
        
       }else{
        this.showdate = false;
       }
      }else if(feildName === 'DueDate'){
        this.dueDate = event.target.value;
      this.dueDate !="" && this.targetparent !=true
      ? (this.showbutton = true)
       : (this.showbutton = false);

      }
        
    }
    handleClick() {
        console.log('### Button Clicked on child');
        TODOLIST1({ title: this.taskTitle, dueDate: this.dueDate })
            .then((result) => {
                console.log('### Apex Call Success');
                if (result === 'success') {
                    this.taskTitle = '';
                    this.dueDate = '';
    
                    const evt = new ShowToastEvent({
                        title: 'Success',
                        message: 'A new Item has been added to the To-Do List',
                        variant: 'success'
                    });
    
                    console.log('### Dispatching Toast Event');
                    this.dispatchEvent(evt);
                }
            })
            
            .catch((error) => {
                console.log('### Apex Call Error', error);
    
                const evt = new ShowToastEvent({
                    title: 'Error',
                    message: error.body.message,
                    variant: 'error'
                });
    
                console.log('### Dispatching Error Toast Event');
                this.dispatchEvent(evt);
            });
    }

        @api
    handleParentCLick(){
        this.handleClick();
    }
    }