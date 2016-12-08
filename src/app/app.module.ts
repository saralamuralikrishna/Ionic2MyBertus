import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import {TestPage} from '../pages/testpage/testpage';
import {SideMenuPage} from '../pages/sidemenu/sidemenu';
import {SearchPage} from '../pages/search/search';
import {AuthConfig, AuthHttp} from 'angular2-jwt';
import {Http} from '@angular/http';
import {Storage} from '@ionic/storage';
import {AuthService} from '../services/auth/auth.service';
import {WishlistService} from '../services/wishlist/wishlist.service';
import {RequestOptionsService} from '../services/common/requestoptions.service';
import {AccountService} from '../services/common/account-service';
import {OrderlistService} from '../services/orderlist/orderlist.service';
import {CurrencyPipe} from '../pipes/currency.pipe';

let storage = new Storage();

export function getAuthHttp(http)
{
  return new AuthHttp(new AuthConfig({
    globalheaders:[{'Accept': 'applicaiton/joson'}],
    tokenGetter:(()=> storage.get('id_token'))
  }), http);
}


@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    SideMenuPage,
    SearchPage,
    TestPage,
    CurrencyPipe
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    SideMenuPage,
    SearchPage,
    TestPage
  ],
  providers: [
    AuthService,
    RequestOptionsService,
    WishlistService,
    AccountService,
    OrderlistService,
    {
      provide: AuthHttp,
      useFactory: getAuthHttp,
      deps: [Http]
    }
  ]
})
export class AppModule {}
