import { Routes } from '@angular/router';
import { UrlShotForm } from './url-shot-form/url-shot-form';
import { SecurityPinVerification } from './security-pin-verification/security-pin-verification';

export const routes: Routes = [
  { path: '', component: UrlShotForm },
  { path: '/:uniqueWord', component: SecurityPinVerification },
  //{ path: 'shorturl/:uniqueWord', component: UrlShotForm },
  { path: 'link/:uniqueWord', component: SecurityPinVerification },
  { path: '**', redirectTo: '' },
];
