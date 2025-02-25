import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WeatherComponent } from './weather/weather.component';
import { MainComponent } from './main/main.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, WeatherComponent, MainComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'home25';
}
