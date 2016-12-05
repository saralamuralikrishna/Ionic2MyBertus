import {Component, ViewChild} from '@angular/core';
import {SearchPage, TestPage} from '../pages';
import { MenuController, NavController, Nav, App} from 'ionic-angular';
import {AuthService} from '../../services/auth/auth.service';
import {TabsPage} from '../tabs/tabs';

@Component({
    templateUrl:'sidemenu.html'
})
export class SideMenuPage
{

  @ViewChild(Nav) nav: Nav;
  
  // make HelloIonicPage the root (or first) page
   rootPage:any = SearchPage;

   pages: Array<{title: string, component: any}>;

   //Constructor
   constructor(public menu: MenuController, public navController : NavController,
   public auth : AuthService, private app : App){
    // set our app's pages
    this.pages = [
      { title: 'Search', component: SearchPage },
      { title: 'Order List', component: TestPage},
      { title: 'Wisth List', component: TestPage}
    ];
   }

   openPage(page) {
    this.nav.setRoot(page.component);
    this.menu.close();
  }

  logout(){
      this.auth.logout();
      this.app.getRootNav().setRoot(TabsPage);
  }
}