import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { RequestOptionsService } from './requestoptions.service';
import { Observable } from 'rxjs';
import { Http, Response } from '@angular/http';
import { AppVariables } from '../../app-variables';


@Injectable()
export class AccountService {

    storage: Storage = new Storage();
    account: Account;

    /**
     *
     */
    constructor(private requestOptionsService: RequestOptionsService, private http: Http) {
        this.account = new Account(null, null, null);
    }

    getShippingAddress():Observable<any>{
        return Observable.fromPromise(this.storage.get("account").then(account => {
            if(account){
                return account.shippingAddresses;
            }
        }, error =>{
            return this.loadShippingAddresses(true);
        }));
    }    

    loadShippingAddresses(skipCache): Observable<any> {
        if (skipCache || this.account.shippingAddresses.length === 0) {
            let requestOptions = this.requestOptionsService.getRequestOptions();
            return this.http.get(AppVariables.API_URL_MOBILE + '/api/account/shippingAddresses', requestOptions)
                .map((r: Response) => {
                    this.account.removeAllShippingAddresses();
                    var addresses = r.json() as Array<any>;
                    addresses.forEach((sha) => {
                        this.account.addShippingAddressToModel(sha);
                    });
                    this.storage.set('account', this.account);
                    return this.account.shippingAddresses;
                })
                .catch(this.handleError);
        }
    }

    private handleError(error: Response | any) {
        // In a real world app, we might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }
}


export class ShippingAddress {
    id: number = NaN;
    invoiceNumber: number;
    shippingAddressNumber: number;
    description: string;

    constructor(data) {
        if (!isNaN(data.InvoiceNumber) && !isNaN(data.ShippingAddressNumber)) {
            this.id = data.InvoiceNumber * 1000 + data.ShippingAddressNumber;
        }


        this.invoiceNumber = isNaN(data.InvoiceNumber) ? NaN : data.InvoiceNumber;


        this.shippingAddressNumber = isNaN(data.ShippingAddressNumber) ? NaN : data.ShippingAddressNumber;


        this.description = data.Description != undefined ? data.Description : '';
    }
}

export class SalesPerson {
    name: string;
    email: string;

    constructor(name: string, email: string) {
        this.name = name;
        this.email = email;
    }
}

export class Account {
    shippingAddresses: Array<ShippingAddress>;
    salesPersons: Array<SalesPerson>;
    currentShippingAddress: any;
    completeShippingAddress: any;
    accountNumber: string;

    constructor(shippingAddresses: Array<ShippingAddress>, salesPersons: Array<SalesPerson>, accountNumber: string) {
        this.shippingAddresses = shippingAddresses ? shippingAddresses : new Array<ShippingAddress>();
        this.salesPersons = salesPersons ? salesPersons : new Array<SalesPerson>();
        this.accountNumber = accountNumber ? accountNumber : null;
    }

    addShippingAddressToModel(data: any) {
        var shippingAddress = new ShippingAddress(data);
        this.shippingAddresses.push(shippingAddress);
    }

    addSalesPersonToModel(data: any) {
        var salesPerson = new SalesPerson(data.Name ? data.Name : '', data.Email ? data.Email : '');
        this.salesPersons.push(salesPerson);
    }

    removeAllShippingAddresses() {
        this.shippingAddresses = new Array<ShippingAddress>();
    }
}