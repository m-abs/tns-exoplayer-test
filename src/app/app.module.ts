import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptModule } from 'nativescript-angular/nativescript.module';
import * as nsApp from 'tns-core-modules/application';
import { isAndroid } from 'tns-core-modules/ui/page/page';
import * as utils from 'tns-core-modules/utils/utils';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ItemDetailComponent } from './item/item-detail.component';
import { ItemsComponent } from './item/items.component';

// Uncomment and add to NgModule imports if you need to use two-way binding
// import { NativeScriptFormsModule } from "nativescript-angular/forms";

// Uncomment and add to NgModule imports if you need to use the HttpClient wrapper
// import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";

declare namespace dk {
  namespace mabs {
    class BackgroundService extends android.app.Service {}
  }
}

if (isAndroid) {
  @JavaProxy('dk.mabs.BackgroundService')
  class BackgroundService extends android.app.Service {
    onStartCommand(intent, flags, startId) {
      console.log('start command', intent, flags, startId);
      super.onStartCommand(intent, flags, startId);
      return android.app.Service.START_STICKY;
    }
    onCreate() {
      console.log('onCreate');
      // Do something
    }
    onBind(param) {
      // haven't had to deal with this, so i can't recall what it does
      console.log('on Bind Services');

      return super.onBind(param);
    }
    onUnbind(param) {
      // haven't had to deal with this, so i can't recall what it does
      console.log('UnBind Service');

      return super.onUnbind(param);
    }
    onDestroy() {
      console.log('service onDestroy');
      // end service, reset any variables... etc...
    }
  }

  nsApp.on(nsApp.displayedEvent, () => {
    const context = utils.ad.getApplicationContext();
    const intent = new android.content.Intent(context, dk.mabs.BackgroundService.class);
    console.log('startService');
    context.startService(intent);
  });
}

@NgModule({
  bootstrap: [AppComponent],
  imports: [NativeScriptModule, AppRoutingModule],
  declarations: [AppComponent, ItemsComponent, ItemDetailComponent],
  providers: [],
  schemas: [NO_ERRORS_SCHEMA],
})
/*
Pass your application module to the bootstrapModule function located in main.ts to start your app
*/
export class AppModule {}
