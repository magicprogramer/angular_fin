import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'imageUrl'
})
export class ImageUrlPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    const baseUrl = 'http://localhost:3000';
    if (!value) return '';
    return baseUrl + value;
  }

}
