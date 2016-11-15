import { Component } from '@angular/core';

import { NavController, LoadingController } from 'ionic-angular';

import {AuthService} from '../../services/auth/auth.service';

import {LoginModel} from '../../Models/Login/login.model';

import {Auth0Vars} from '../../auth0-variables';

import {SideMenuPage} from '../pages';


declare var Auth0: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  loginModel : LoginModel;
  
  public auth0 = new Auth0({clientID: Auth0Vars.AUTH0_CLIENT_ID, domain: Auth0Vars.AUTH0_DOMAIN, callbackURL:  location.href, responseType: 'token' });

  constructor(private navCtrl: NavController, 
  public auth : AuthService,
  private loadingController : LoadingController) {
      this.loginModel =  new LoginModel();
  }

  login(){
    let loader = this.loadingController.create({
      content : 'Logging in please wait...'
    });

    loader.present();

    this.auth0.login({
            connection: 'Username-Password-Authentication',
            username:   this.loginModel.UserName,
            password:   this.loginModel.Password,
            scope: 'openid username email user_metadata roles offline_access'
          }, (err, authResult)=>{
            loader.dismiss();
            debugger;
            if(err)
            {
                alert(err);
                console.log('Error ', err);
                return;
            }       
            console.log('Response ', authResult);
            this.auth.authResultStore(authResult);
            this.auth.lockGetProfile(authResult.idToken);
            if(!this.auth.user["user_metadata"].hasOwnProperty('AccountNumber'))
            {
                alert('Account number is not assigned, please contact administrator');
                this.auth.logout();
            }                      
          });
  }

  gotoSideMenu(){
    //alert('came in');
    this.navCtrl.push(SideMenuPage);
  }
}

