import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatInputModule,
  MatCardModule,
  MatToolbarModule,
  MatExpansionModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule
} from '@angular/material';
// Components
import { AppComponent } from './app.component';
import { RacksComponent } from './components/racks/racks.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { CrearComponent } from './components/crear/crear.component';
import { EditarComponent } from './components/editar/editar.component';
import { MapComponent } from './components/map/map.component';

// Services
import { RackService } from './rack.service';

// Router
import { APP_Routes } from './app.routes';
import { KeyValuePipe } from './key-value.pipe';

@NgModule({
  declarations: [
    AppComponent,
    RacksComponent,
    EditarComponent,
    NavbarComponent,
    CrearComponent,
    KeyValuePipe,
    MapComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(APP_Routes),
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatTableModule,
    MatInputModule,
    MatCardModule,
    MatToolbarModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatSortModule
  ],
  providers: [RackService],
  bootstrap: [AppComponent]
})
export class AppModule {}
