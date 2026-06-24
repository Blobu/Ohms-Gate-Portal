import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { provideNzI18n, en_US } from 'ng-zorro-antd/i18n';
import {authInterceptor} from './core/interceptors/auth.interceptor';

import { routes } from './app.routes';
import { authErrorInterceptor } from './core/interceptors/auth-error.interceptor';

registerLocaleData(en);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([authInterceptor, authErrorInterceptor])),
    provideRouter(routes),
    provideNzI18n(en_US),
    provideZoneChangeDetection({eventCoalescing:true}),

  ],
};