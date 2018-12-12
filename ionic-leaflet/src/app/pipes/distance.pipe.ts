import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Pipe({ name: 'distance' })
export class DistancePipe implements PipeTransform {
  constructor(private decimalPipe: DecimalPipe) {}

  transform(value: number): string {
    let operateur = 'm';
    if (value >= 1000) {
      value /= 1000;
      operateur = 'km';
    }
    const sValue =
      operateur === 'km'
        ? this.decimalPipe.transform(value, '1.1-1')
        : this.decimalPipe.transform(value, '1.0-0');
    return sValue + ' ' + operateur;
  }
}
