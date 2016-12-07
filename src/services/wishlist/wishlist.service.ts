import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { AppVariables } from '../../app-variables';
import { AuthService } from '../../services/auth/auth.service';
import {RequestOptionsService} from '../common/requestoptions.service';

@Injectable()
export class WishlistService {
    /**
     *
     */
    constructor(private http: Http, private auth: AuthService, private requestOptionsService : RequestOptionsService ) {
    }

    // getWishlistCount(): Observable<any> {
    //     let requestOptions = this.requestOptionsService.getRequestOptions();
    //     return this.http.get(AppVariables.API_URL_MOBILE + '/api/wishList', requestOptions)
    //         .map((r: Response) => r.json())
    //         .catch(this.handleError);
    // }

    addToWishlist(articleId: string): Observable<number> {
        let requestOptions = this.requestOptionsService.getRequestOptions();
        return this.http.post(AppVariables.API_URL_MOBILE + '/api/wishList', { ArticleId: articleId }, requestOptions)
            .map((r: Response) => r.json())
            .catch(this.handleError);
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