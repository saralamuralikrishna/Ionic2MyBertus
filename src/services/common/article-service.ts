import { Injectable } from '@angular/core';
import { RequestOptionsService } from './requestoptions.service';
import { Observable } from 'rxjs';
import { Http, Response } from '@angular/http';
import { AppVariables } from '../../app-variables';

@Injectable()
export class ArticleService{
    constructor(private requestOptionsService: RequestOptionsService, private http: Http) {
     
    }
    getArticleDetails(articleId :string):Observable<any>{
        let requestOptions = this.requestOptionsService.getRequestOptions();
        return this.http.get(AppVariables.API_URL_MOBILE + '/api/article/' + articleId, requestOptions)
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