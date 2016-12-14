import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, LoadingController, Platform, ToastController, Toast, ModalController, Events } from 'ionic-angular';
import { Http, Request } from '@angular/http';
import { AuthService } from '../../services/auth/auth.service';
import { AccountService, ShippingAddress } from '../../services/common/account-service';
import { AppVariables } from '../../app-variables';
import { BarcodeScanner } from 'ionic-native';
import { WishlistService } from '../../services/wishlist/wishlist.service';
import { OrderlistService } from '../../services/orderlist/orderlist.service';
import { RequestOptionsService } from '../../services/common/requestoptions.service';
import { ArticleDetailsPage } from '../articledetails/articledetails';

@Component({
    templateUrl: 'search.html'
})
export class SearchPage implements OnInit, OnDestroy {

    searchQuery: string;
    enteredSearchText: string;
    searchItems: Array<any>;
    shippingAddresses: Array<ShippingAddress> = new Array<ShippingAddress>();
    public orderListCount: number = 0;
    public nextUrl: string = '';

    ngOnInit() {
        this.accountService.loadShippingAddresses(true).subscribe(shippingAddresses => {
            this.shippingAddresses = shippingAddresses;
        }, error => {
            alert('Error while getting shipping addresses');
        });

        this.orderlistService.getOrderListWihtOutArticleData().subscribe(orderlistData => {            
            this.orderListCount = 0;
            for (let count = 0; count < orderlistData.Items.length; count++) {
                this.orderListCount += orderlistData.Items[count].Quantity;
            }
        });

        
    }

    constructor(private navController: NavController, private http: Http,
        private auth: AuthService,
        public loadingCtrl: LoadingController,
        private platform: Platform,
        private toastCtrl: ToastController,
        private wishlistService: WishlistService,
        private accountService: AccountService,
        private orderlistService: OrderlistService,
        private requestOptionsService: RequestOptionsService,
        public modalCtrl: ModalController,
        public events: Events
    ) {
        this.searchQuery = '';        
    }

    getItems(event) {
        this.searchItems = [];
        let baseUrl = AppVariables.API_URL;

        if (this.platform.is('mobile')) {
            baseUrl = AppVariables.API_URL_MOBILE;
        }

        if (this.searchQuery == '') {
            return;
        }

        this.enteredSearchText = this.searchQuery;

        let searchUrl = baseUrl + '/api/Articles?filter=' + this.enteredSearchText + '||||||Available,Direct,NotAvailableYet,PreOrder,Soon|0|0|0|0|All||||||||||||||||0';
        this.getSearchData(searchUrl);
    }

    getSearchData(location: string) {
        let loading = this.loadingCtrl.create({
            spinner: 'bubbles'
        });
        let requestOptions = this.requestOptionsService.getRequestOptions();
        let req = new Request(requestOptions);
        loading.present();
        this.http.get(location, req)
            .map(res => res.json())
            .subscribe(searchResult => {
                if (searchResult.Collection) {
                    for (let count = 0; count < searchResult.Collection.length; count++) {
                        this.searchItems.push(searchResult.Collection[count]);
                    }
                }

                if (searchResult.Links && searchResult.Links.next) {
                    this.nextUrl = searchResult.Links.next.Href;
                }
                loading.dismiss();
            }, err => {
                loading.dismiss();
            });
    }

    loadArticleDetails(articleId) {
        this.events.unsubscribe('orderListItemsAdded');
        let profileModal = this.modalCtrl.create(ArticleDetailsPage, { articleId: articleId });
        profileModal.present();

        this.events.subscribe('orderListItemsAdded', (data) => {
            console.log('called in event with data ', data);
            if(data.length > 0)
            {
                console.log(data[0].numberOfItemsAdded);
                this.orderListCount += parseInt(data[0].numberOfItemsAdded,10);
            }
            
        });
    }

    setDefaultImage(event) {
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
    createToaster(message: string, cssClass: string): Toast {
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
                else {
                    let toast = this.createToaster('Article ' + article.Title + ' is already present in wishlist', 'error');
                    toast.present();
                }
            }
        }, error => {
            let toast = this.createToaster(error, 'error');
            toast.present();
        });
    }


    addToCart(article: any) {
        let data = {
            ArticleId: article.Id,
            ShippingAddressId: this.shippingAddresses[0].id,
            Reference: 'Direct Order',
            Quantity: 1,
            IsBackorderAllowed: true
        }
        this.orderlistService.addToOrderlist(data).subscribe(data => {
            let toast = this.createToaster('Article ' + article.Title + ' added to order list', '');
            toast.present();
            this.orderListCount += data;
        }, error => {
            let toast = this.createToaster('Error while adding ' + article.Title + ' to order list', 'error');
            toast.present();
        });
    }

    ngOnDestroy() {
        // prevent memory leak when component destroyed
        this.events.unsubscribe('orderListItemsAdded');
    }

}