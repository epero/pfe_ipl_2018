import { Component } from "@angular/core";

import { Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";

@Component({
<<<<<<< HEAD
  selector: "app-root",
  templateUrl: "app.component.html"
=======
  selector: 'app-root',
  templateUrl: 'app.component.html'
>>>>>>> 1a35f4f6531fbfa3399500cc432341c3af929c8b
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.statusBar.hide();
      this.splashScreen.hide();
    });
  }
}
