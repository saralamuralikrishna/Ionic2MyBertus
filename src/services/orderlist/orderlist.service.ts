import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { AppVariables } from '../../app-variables';
import { AuthService } from '../../services/auth/auth.service';
import { RequestOptionsService } from '../common/requestoptions.service';

@Injectable()
export class OrderlistService {

    orderListCount : number;

    /**
     *
     */
    constructor(private http: Http, private auth: AuthService,
        private requestOptionsService: RequestOptionsService) {
    }

    getOrderListWihtOutArticleData(){
        let requestOptions = this.requestOptionsService.getRequestOptions();
        return this.http.get(AppVariables.API_URL_MOBILE + '/api/orderList', requestOptions)
            .map((r: Response) => r.json())
            .catch(this.handleError);
    }

    getOrderListWihtArticleData(){
        let requestOptions = this.requestOptionsService.getRequestOptions();
        return this.http.get(AppVariables.API_URL_MOBILE + '/api/orderList?include=article', requestOptions)
            .map((r: Response) => r.json())
            .catch(this.handleError);
    }

    addToOrderlist(data: any): Observable<number> {
        let postBody = {
                ArticleId: data.ArticleId,
                ShippingAddressId: data.ShippingAddressId,
                Reference: data.Reference,
                Quantity: data.Quantity,
                IsBackorderAllowed: data.IsBackorderAllowed
            };
        let requestOptions = this.requestOptionsService.getRequestOptions();
        return this.http.post(AppVariables.API_URL_MOBILE + '/api/orderList', postBody , requestOptions)
            .map((r: Response) => r.json())
            .catch(this.handleError);
    }

    private handleError(error: Response | any) {
        //Should configure to use remote logging or sending it to argus and api insights
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