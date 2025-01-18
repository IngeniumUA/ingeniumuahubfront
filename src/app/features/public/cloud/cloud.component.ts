import {Component} from '@angular/core';
import {backButtonClicked} from "@app_services/app-functions.service";
import {CapacitorHttp} from '@capacitor/core';
import {InAppBrowser, iOSAnimation, iOSViewStyle, ToolbarPosition} from '@capacitor/inappbrowser';

@Component({
  selector: 'app-cloud',
  templateUrl: './cloud.component.html',
  styleUrls: ['./cloud.component.css']
})
export class CloudComponent {
  constructor() {
    backButtonClicked()

    // this.open_cloud()
    // this.get_token().then(token => {this.loaded = true})

  }

  async open_cloud() {
    await InAppBrowser.openInWebView({
      url: "https://eu.ingeniumua.be/d/038d6736ad4b450bbee3/",
      options: {
        showURL: false,
        showToolbar: true,
        clearCache: false,
        clearSessionCache: false,
        mediaPlaybackRequiresUserAction: false,
        closeButtonText: "Terug",
        toolbarPosition: ToolbarPosition.TOP,
        showNavigationButtons: false,
        leftToRight: true,
        android: {
          allowZoom: true,
          hardwareBack: true,
          pauseMedia:true
        },
        iOS: {
          allowOverScroll: false,
          enableViewportScale: true,
          allowInLineMediaPlayback: true,
          surpressIncrementalRendering: false,
          viewStyle: iOSViewStyle.FULL_SCREEN,
          animationEffect: iOSAnimation.COVER_VERTICAL
        }
      }
    });
  }

  public loaded = false

  async get_token() {

    try {
      const options = {
        url: "https://eu.ingeniumua.be/d/038d6736ad4b450bbee3/",
      }
      let response = await CapacitorHttp.get(options);
      console.log("response: " + JSON.stringify(response.data));
      console.log("headers: " + JSON.stringify(response.headers["Set-Cookie"]));
      document.cookie = response.headers["Set-Cookie"] + "; SameSite=None"
      document.cookie = response.headers["Set-Cookie"] + "; SameSite=None; domain=https://eu.ingeniumua.be/d/038d6736ad4b450bbee3/"

    } catch (error) {
      console.log(error)
    }

  }

}
