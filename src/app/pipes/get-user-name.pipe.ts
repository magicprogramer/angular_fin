import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getUserName'
})
export class GetUserNamePipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): unknown {
    if (!value)return "guest";
    else return value.name;
  }

}
