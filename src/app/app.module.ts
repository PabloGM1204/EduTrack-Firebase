import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy, Platform } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientProvider } from './core/services/http/http-client.provider';
import { HttpClientWebProvider } from './core/services/http/http-client-web.provider';
import { AuthService } from './core/services/api/strapi/auth.service';
import { ApiService } from './core/services/api/api.service';
import { AuthStrapiService } from './core/services/api/strapi/auth-strapi.service';
import { JwtService } from './core/services/jwt.service';
import { SharedModule } from './shared/shared.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { createTranslateLoader } from './core/translate/translate';
import { FirebaseService } from './core/services/firebase/firebase.service';
import { FirebaseAuthService } from './core/services/api/firebase/firebase-auth.service';
import { environment } from 'src/environments/environment';
import { StrapiMediaService } from './core/services/api/strapi/strapi-media.service';
import { FirebaseMediaService } from './core/services/api/firebase/firebase-media.service';
import { MediaService } from './core/services/api/media.service';

export function httpProviderFactory(http: HttpClient) {
  return new HttpClientWebProvider(http);
}

export function MediaServiceFactory(
  backend:string,
  api:ApiService,
  firebase:FirebaseService){
    switch(backend){
      case 'Strapi':
        return new StrapiMediaService(api);
      case 'Firebase':
        return new FirebaseMediaService(firebase)
      default:
        throw new Error("Not implemented");
    }
}

export function AuthServiceFactory(
  backend:string,
  jwt:JwtService,
  api:ApiService,
  firebase:FirebaseService
) {
    switch(backend){
      case 'Strapi':
        return new AuthStrapiService(jwt, api);
      case 'Firebase':
        return new FirebaseAuthService(firebase);
      default:
        throw new Error("Not implemented");
    }
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule, 
    HttpClientModule,
    SharedModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: 'firebase-config',
      useValue:environment.firebase
    },
    {
      provide: 'backend',
      useValue:'Firebase'
    },
    {
      provide: HttpClientProvider,
      deps: [HttpClient, Platform],
      useFactory: httpProviderFactory,
    },
    {
      provide: AuthService,
      deps: ['backend',JwtService, ApiService, FirebaseService],
      useFactory: AuthServiceFactory,  
    },
    {
      provide: MediaService,
      deps: ['backend', ApiService, FirebaseService],
      useFactory: MediaServiceFactory,  
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
