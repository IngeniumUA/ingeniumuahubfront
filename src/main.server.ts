import {bootstrapApplication} from "@angular/platform-browser";
import {mergeApplicationConfig} from "@angular/core";
import {provideServerRendering} from "@angular/platform-server";
import {provideServerRoutesConfig} from "@angular/ssr";

import {AppComponent} from "@ingenium/app/app.component";
import {serverRoutes} from "@ingenium/app/app.routes.server";
import {appConfig} from "@ingenium/app/app.config";

export const serverConfig = mergeApplicationConfig(appConfig, {
  providers: [provideServerRendering(), provideServerRoutesConfig(serverRoutes)],
});

const bootstrap = () => bootstrapApplication(AppComponent, serverConfig);

export default bootstrap;
