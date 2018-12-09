import { CrearComponent } from './components/crear/crear.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { Routes } from '@angular/router';
import { RacksComponent } from 'src/app/components/racks/racks.component';
import { EditarComponent } from './components/editar/editar.component';


export const APP_Routes: Routes = [
    { path: 'racks', component: RacksComponent },
    { path: 'rack/crear', component: CrearComponent },
    { path: 'racks/:id', component: EditarComponent },
    { path: '', component: NavbarComponent },
    { path: '**', pathMatch: 'full', component: NavbarComponent }
];
