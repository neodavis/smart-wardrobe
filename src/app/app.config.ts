import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AuthenticatedUserGuard } from './shared/auth/guards';
import { JwtInterceptor } from './shared/auth/interceptors';
import { GuestUserGuard } from './shared/auth/guards/guest-user.guard';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi()),
    AuthenticatedUserGuard,
    GuestUserGuard,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ]
};
