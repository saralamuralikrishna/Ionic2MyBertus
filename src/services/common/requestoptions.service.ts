import {Injectable} from '@angular/core';
import {RequestOptions, Headers } from '@angular/http';
import {AuthService} from '../auth/auth.service'

/**
 * @class RequestOptionsService
 * Provides request options for calling api with Bearer token
 * @description Provides request options for calling api with Bearer token
 * @uses Injectable
 * @uses RequestOptions
 * @uses Headers
 * @uses AuthService
 */
@Injectable()
export class RequestOptionsService
{

    /**
     *
     */
    constructor(private auth: AuthService) {
    }

    /**
     * @method getRequestOptions
     * @return RequestOptions
     */
    getRequestOptions(): RequestOptions {
        let headers = new Headers();
        headers.append("Authorization", "Bearer " + this.auth.idToken)
        headers.append("X-Requested-With", "XMLHttpRequest");

        let requestOptions = new RequestOptions();
        requestOptions.withCredentials = true;
        requestOptions.headers = headers;
        return requestOptions;
    }
}