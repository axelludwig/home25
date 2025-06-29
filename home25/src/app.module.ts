// app.module.ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app/app.component';


// Import du CoreModule qu'on vient de créer
// import { CoreModule } from './core/core.module';
import { HttpClientModule } from '@angular/common/http';
import { WeatherComponent } from './app/weather/weather.component';
import { MenuComponent } from './app/menu/menu.component';

@NgModule({
    declarations: [
        AppComponent,
        WeatherComponent,
        MenuComponent
    ],
    imports: [
        BrowserModule
        // HttpClientModule,    // <-- Ajout obligatoire
        // CoreModule,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
