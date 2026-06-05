import { Component } from '@angular/core';
import { WeatherComponent } from '../../features/weather/weather.component';
import { MenuComponent } from '../../features/menu/menu.component';

@Component({
  selector: 'app-main',
  imports: [WeatherComponent, MenuComponent],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent { }