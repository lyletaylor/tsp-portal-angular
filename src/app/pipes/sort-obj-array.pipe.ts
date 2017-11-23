import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortObjArray'
})
export class SortObjArrayPipe implements PipeTransform {
  // transform(array: any[], field: string): any[] {
  //   array.sort((a: any, b: any) => {
  //     if (a[field] && b[field]) {
  //       return a[field].localeCompare(b[field]);
  //     } else if (a[field] && !b[field]) {
  //       return -1;
  //     } else if (!a[field] && b[field]) {
  //       return 1;
  //     } else {
  //       return 0;
  //     }
  //   });
  //   return array;
  // }
  transform(array: any[], sortFunc: (a: any, b: any) => number): any[] {
    return array.slice().sort(sortFunc);
  }
}
