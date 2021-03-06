import { Pipe, PipeTransform } from '@angular/core';
//import {DecimalPipe} from '@angular/common';

@Pipe({ name: 'formatCurrency' })
export class CurrencyPipe implements PipeTransform {

    /**
     *private decimalPipe: DecimalPipe
     */
    constructor() {
        
        
    }

    transform(value:any): string {
        switch (value.Currency) {
            case 'EUR':
                return '€ ' + Number(value.Amount).toFixed(2);;
            case 'CZK':
                return 'Kč ' + Number(value.Amount).toFixed(0);
            case 'HUF':
                return 'Ft ' +  Number(value.Amount).toFixed(0);
            default:
                return value.Currency + ': ' + value.Amount;
        }
    }
}