import { LightningElement,track,wire } from 'lwc';
import getacc from '@salesforce/apex/wireclass.getacc';

const col = [
               {label:'name',fieldname:'Name'}
            ];
export default class Wire extends LightningElement 
{
  @track recordsval;

  cl = col;

  @wire(getacc) 
  jacvfun({data,error})
  {
      if(data)
      {
          this.recordsval = data;
      }
      else if(error)
      {
          console.log(error);
      }
  }
}