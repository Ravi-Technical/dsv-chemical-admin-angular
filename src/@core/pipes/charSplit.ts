import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
     name:'chartSplit'
})

export class CharacterSpliting implements PipeTransform {
    transform(value: any, ...args: any[]) {
         if(value) {  
           return value.length > 10 ? value.slice(0, 10) + ' ...' : value;
         }
         return false;
    }
      
}