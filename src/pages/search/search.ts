import {Component} from '@angular/core';

@Component({
    templateUrl: 'search.html'
})
export class SearchPage{

    searchQuery:string;

    constructor(){
        //alert('page loaded');
        this.searchQuery ='';
    }

    getItems(event)
    {
        console.log(event);
    }
}