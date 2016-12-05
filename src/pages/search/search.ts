import { Component } from '@angular/core';
import { NavController, LoadingController, Platform, ToastController, Toast } from 'ionic-angular';
import { Http, Headers, RequestOptions, Request, RequestMethod } from '@angular/http';
import { AuthService } from '../../services/auth/auth.service';
import { AppVariables } from '../../app-variables';
import { BarcodeScanner } from 'ionic-native';
import { WishlistService } from '../../services/wishlist/wishlist.service';

@Component({
    templateUrl: 'search.html'
})
export class SearchPage {

    searchQuery: string;
    enteredSearchText: string;
    searchItems: Array<any>;

    constructor(private navController: NavController, private http: Http,
        private auth: AuthService,
        public loadingCtrl: LoadingController,
        private platform: Platform,
        private toastCtrl: ToastController,
        private wishlistService: WishlistService
    ) {
        this.searchQuery = '';
    }

    getItems(event) {
        let loading = this.loadingCtrl.create({
            spinner: 'bubbles'
        });

        let baseUrl = AppVariables.API_URL;

        if (this.platform.is('mobile')) {
            baseUrl = AppVariables.API_URL_MOBILE;
        }

        if (this.searchQuery == '') {
            return;
        }

        this.enteredSearchText = this.searchQuery;
        //console.log(event);

        let headers = new Headers();
        headers.append("Authorization", "Bearer " + this.auth.idToken)
        headers.append("X-Requested-With", "XMLHttpRequest");

        let requestOptions = new RequestOptions();
        requestOptions.withCredentials = true;
        requestOptions.headers = headers;
        requestOptions.method = RequestMethod.Get;
        requestOptions.url = baseUrl + '/api/Articles?filter='
            + this.enteredSearchText +
            '||||||Available,Direct,NotAvailableYet,PreOrder,Soon|0|0|0|0|All||||||||||||||||0';
        let req = new Request(requestOptions);
        loading.present();
        this.http.request(req)
            // Call map on the response observable to get the parsed people object
            .map(res => res.json())
            // Subscribe to the observable to get the parsed people object and attach it to the
            // component
            .subscribe(searchResult => {
                //console.log(searchResult);
                this.searchItems = searchResult.Collection;
                console.log(this.searchItems);
                loading.dismiss();
            }, err => {
                console.log(err);
                loading.dismiss();
            });
    }

    setDefaultImage(event) {
        console.log(event);
        event.currentTarget.src = "assets/img/image_not_available.jpg";
    }

    scanbarCode() {
        BarcodeScanner.scan().then((result) => {
            if (!result.cancelled) {
                this.searchQuery = result.text;
            }
        }).catch(error => {
            alert(error);
        });
    }
    createToaster(message :string, cssClass: string) : Toast{
        let toast = this.toastCtrl.create({
                        message: message,
                        duration: 3000,
                        position: 'bottom',
                        cssClass: cssClass
                        //showCloseButton:true
                    });

        return toast;
    }

    favorite(article: any) {
        this.wishlistService.addToWishlist(article.Id).subscribe(data => {
            if (!isNaN(data)) {
                if (data > 0) {
                   let toast = this.createToaster('Article ' + article.Title + ' added to wishlist', '');
                    toast.present();
                }
                else
                {
                    let toast = this.createToaster('Article ' + article.Title + ' is already present in wishlist', 'error');
                    toast.present();
                }
            }
            console.log(data);
        }, error => {
            let toast = this.createToaster(error, 'error');
            toast.present();
        });


    }

}