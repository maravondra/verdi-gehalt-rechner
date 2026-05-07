import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: '',
		loadComponent: () => import('./pages/home/home-page.component').then((m) => m.HomePageComponent),
	},
	{
		path: 'rechner',
		loadComponent: () => import('./pages/calculator/calculator-page.component').then((m) => m.CalculatorPageComponent),
	},
	{
		path: '**',
		redirectTo: '',
	},
];
