import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Pipe({ name: 'duration' })
export class DurationPipe implements PipeTransform {
  constructor(private decimalPipe: DecimalPipe) {}

  transform(value: number): string {
    let operateur = 'sec';
    if (value >= 60) {
      // sec -> min
      value /= 60;
      operateur = 'min';
    }
    if (value >= 60) {
      // min -> heure
      value /= 60;
      operateur = 'h';
    }

    const sValue = this.decimalPipe.transform(value, '1.0-0');
    return sValue + ' ' + operateur;
  }
}
