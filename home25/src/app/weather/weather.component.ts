import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../core/http.service';

@Component({
  selector: 'app-weather',
  imports: [],
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.scss'
})
export class WeatherComponent implements OnInit {

  latitude: number | null = null;
  longitude: number | null = null;

  constructor(private httpService: HttpService) { }

  ngOnInit() {
    this.getLocation();

    if (this.latitude !== null && this.longitude !== null) {
      this.httpService.getWeather(this.latitude, this.longitude).subscribe(console.log);
    } else {
      console.error('Latitude or Longitude is null');
    }
  }

  getLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          console.log('Position récupérée :', this.latitude, this.longitude);
        },
        (error) => {
          console.error('Erreur géolocalisation :', error);
        }
      );
    } else {
      console.log('La géolocalisation n\'est pas supportée par ce navigateur.');
    }
  }


}
