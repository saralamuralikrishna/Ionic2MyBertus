import {Component} from '@angular/core';
import { NavController} from 'ionic-angular';
import {Http, Headers, RequestOptions, Request, RequestMethod} from '@angular/http';
import {AuthService} from '../../services/auth/auth.service';
import {AppVariables} from '../../app-variables';
@Component({
    templateUrl: 'search.html'
})
export class SearchPage{

    searchQuery:string;
    enteredSearchText:string;
    searchItems:Array<any>;
    constructor(private navController:NavController, private http: Http, 
    private auth : AuthService){
        this.searchQuery ='';
    }

    getItems(event)
    {
        
        
        this.enteredSearchText = this.searchQuery;
        //console.log(event);

        let headers = new Headers();
        headers.append("Authorization", "Bearer " +  this.auth.idToken)
        headers.append("X-Requested-With", "XMLHttpRequest");

        let requestOptions = new RequestOptions();
        requestOptions.withCredentials=true;
        requestOptions.headers= headers;
        requestOptions.method = RequestMethod.Get;
        requestOptions.url = AppVariables.API_URL +  '/api/Articles?filter=' 
                             + this.enteredSearchText + 
                             '||||||Available,Direct,NotAvailableYet,PreOrder,Soon|0|0|0|0|All||||||||||||||||0';
        let req = new Request(requestOptions);
        this.http.request(req)
      // Call map on the response observable to get the parsed people object
      .map(res => res.json())
      // Subscribe to the observable to get the parsed people object and attach it to the
      // component
      .subscribe(searchResult => {
          //console.log(searchResult);
          this.searchItems = searchResult.Collection;
      }, err =>{
          console.log(err);
      });
  
    }

    setDefaultImage(event)
    {
        console.log(event);
        event.currentTarget.src = "assets/img/image_not_available.jpeg";
    }

    onPageWillEnter() {
        //document.getElementsByTagName("ion-navbar-section")[0].style.display = "none";
    }
}