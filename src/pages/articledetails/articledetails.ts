import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../../services/common/article-service';
import { Platform, NavParams, ViewController } from 'ionic-angular';

@Component({
    templateUrl: 'articledetails.html'
})
export class ArticleDetailsPage implements OnInit {

    articleDetails: any;

    ngOnInit() {
        this.articleService.getArticleDetails(this.params.get('articleId')).subscribe(articleDetails => {
            console.log(articleDetails);
            this.articleDetails = articleDetails;
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
        private articleService: ArticleService) {


    }

    setDefaultImage(event) {
        event.currentTarget.src = "assets/img/image_not_available.jpg";
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }
}