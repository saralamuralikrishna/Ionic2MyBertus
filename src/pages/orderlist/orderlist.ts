import { Component, OnInit } from '@angular/core';
import { OrderlistService } from '../../services/orderlist/orderlist.service';
import { AccountService } from '../../services/common/account-service';
import { LoadingController } from 'ionic-angular';

@Component({
    templateUrl: 'orderlist.html'
})
export class OrderListComponent implements OnInit {
    shippingAddresses: Array<any>;
    orderList: Array<any>;
    ngOnInit() {


        this.accountService.getShippingAddress().subscribe(shippingAddresses => {
            this.shippingAddresses = shippingAddresses;
        }, err => {
            console.log(err);
            alert(err);
        });


    }

    /**
     *
     */
    constructor(private orderlistService: OrderlistService,
        public accountService: AccountService,
        public loadingCtrl: LoadingController) {
        this.orderList = new Array<any>();
        let loading = this.loadingCtrl.create({
            spinner: 'bubbles'
        });
        loading.present();
        this.orderlistService.getOrderListWihtArticleData().subscribe(orderListData => {
            console.log(orderListData);
            this.orderList = orderListData.Items;
            loading.dismiss();
        }, error => {
            loading.dismiss();
            alert(error);
        });
    }

    setDefaultImage(event) {
        event.currentTarget.src = "assets/img/image_not_available.jpg";
    }

}