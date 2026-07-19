import { ApplicationConfig } from '@angular/core';

import { appProviders } from './core/config/app.providers';

export const appConfig: ApplicationConfig = {
  providers: [...appProviders],
};
