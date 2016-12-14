import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../../services/common/article-service';
import { AccountService } from '../../services/common/account-service';
import { OrderlistService } from '../../services/orderlist/orderlist.service';
import { Platform, NavParams, ViewController,ToastController, Toast, Events } from 'ionic-angular';

@Component({
    templateUrl: 'articledetails.html'
})
export class ArticleDetailsPage implements OnInit {

    articleDetails: any;
    shippingAddresses: Array<any>;
    orderItem: any = {
        numberOfItems: 1,
        shippingAddressId: ''
    }

    ngOnInit() {
        this.articleService.getArticleDetails(this.params.get('articleId')).subscribe(articleDetails => {            
            this.articleDetails = articleDetails;
        }, err => {
            console.log(err);
            alert(err);
        })

        this.accountService.getShippingAddress().subscribe(shippingAddresses => {
            this.shippingAddresses = shippingAddresses;
            this.orderItem.shippingAddressId = shippingAddresses[0].id;
        }, err => {
            console.log(err);
            alert(err);
        })
    }

    /**
     *
     */
    constructor(public platform: Platform,
        public params: NavParams,
        public viewCtrl: ViewController,
        public articleService: ArticleService, 
        public accountService: AccountService,
        public toastCtrl: ToastController,
        public orderlistService: OrderlistService,
        public events : Events) {


    }

    setDefaultImage(event) {
        event.currentTarget.src = "assets/img/image_not_available.jpg";
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    private createToaster(message: string, cssClass: string): Toast {
        let toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'bottom',
            cssClass: cssClass
            //showCloseButton:true
        });

        return toast;
    }

    addToCart() {
        if (this.orderItem.numberOfItems <= 0 )
        {
            let toast = this.createToaster('Please enter number of items > 0', 'error');
            toast.present();
            return;
        }

        let data = {
            ArticleId: this.params.get('articleId'),
            ShippingAddressId: this.orderItem.shippingAddressId,
            Reference: 'Direct Order',
            Quantity: this.orderItem.numberOfItems,
            IsBackorderAllowed: true
        }

        this.orderlistService.addToOrderlist(data).subscribe(data => {
            let toast = this.createToaster('Article ' + this.articleDetails.Title + ' added to order list', '');
            toast.present();
            let objectData ={ 
                articleId : this.articleDetails.Id, 
                numberOfItemsAdded: this.orderItem.numberOfItems 
            };
            
            this.events.publish('orderListItemsAdded', objectData)
        }, error => {
            let toast = this.createToaster('Error while adding ' + this.articleDetails.Title + ' to order list', 'error');
            toast.present();
        });
    }
}