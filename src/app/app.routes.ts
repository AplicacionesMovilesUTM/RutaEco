import { Routes } from '@angular/router';
import { guestGuard, authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'registro',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/register/registro.page').then(
        (m) => m.RegistroPage,
      ),
  },
  {
    path: '',
    redirectTo: 'splash',
    pathMatch: 'full',
  },
  {
    path: 'splash',
    loadComponent: () =>
      import('./features/splash/splash.page').then((m) => m.SplashPage),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./features/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'resultado',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/resultado/resultado.page').then(
        (m) => m.ResultadoPage,
      ),
  },
  {
    path: 'tabs',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/dashboard.page').then(
        (m) => m.DashboardPage,
      ),
    children: [
      {
        path: '',
        redirectTo: 'inicio',
        pathMatch: 'full',
      },
      {
        path: 'inicio',
        loadComponent: () =>
          import('./features/inicio/inicio.page').then((m) => m.InicioPage),
      },
      {
        path: 'escanear',
        loadComponent: () =>
          import('./features/escanear/escanear.page').then(
            (m) => m.EscanearPage,
          ),
      },
      {
        path: 'mapa',
        loadComponent: () =>
          import('./features/mapa/mapa.page').then((m) => m.MapaPage),
      },
      {
        path: 'historial',
        loadComponent: () =>
          import('./features/historial/historial.page').then(
            (m) => m.HistorialPage,
          ),
      },
      {
        path: 'perfil',
        loadComponent: () =>
          import('./features/perfil/perfil.page').then((m) => m.PerfilPage),
      },
    ],
  },
];
