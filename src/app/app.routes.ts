import { Routes } from '@angular/router';

export const routes: Routes = [
  // { path: 'login' },
  // { path: 'register' },
  {
    path: 'wardrobe',
    loadComponent: () => import('./pages/wardrobe/wardrobe-page.component').then(m => m.WardrobePageComponent),
    // TODO: impl security guard
  },
  { path: '**', redirectTo: 'wardrobe' },
];
