import {Component, ViewChild} from '@angular/core';
import {SearchPage, TestPage} from '../pages';
import { MenuController, NavController, Nav } from 'ionic-angular';

@Component({
    templateUrl:'sidemenu.html'
})
export class SideMenuPage
{

  @ViewChild(Nav) nav: Nav;

  // make HelloIonicPage the root (or first) page
   rootPage:any = SearchPage;

   pages: Array<{title: string, component: any}>;

   constructor(public menu: MenuController, public navController : NavController){
       // set our app's pages
    this.pages = [
      { title: 'Hello Ionic', component: SearchPage },
      { title: 'Test Page', component: TestPage}
    ];
   }

   openPage(page) {
    this.nav.setRoot(page.component);
  }
}